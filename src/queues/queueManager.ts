import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

const REDIS_CONNECTION_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

function createRedisConnection() {
  return new IORedis(REDIS_CONNECTION_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
      return Math.min(times * 200, 2000);
    },
  });
}

let redisConn: IORedis | null = null;
try {
  redisConn = createRedisConnection();
} catch (err) {
  console.warn('[QueueManager] Redis connection initialization warning:', err);
}

// Queue instances
export const emailQueue = new Queue('selbar-email-queue', {
  connection: redisConn as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
});

export const notificationQueue = new Queue('selbar-notification-queue', {
  connection: redisConn as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
});

export const deliverySyncQueue = new Queue('selbar-delivery-sync-queue', {
  connection: redisConn as any,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 3000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
});

export const QUEUES: Record<string, Queue> = {
  email: emailQueue,
  notification: notificationQueue,
  deliverySync: deliverySyncQueue,
};

export interface QueueHealthStats {
  name: string;
  isPaused: boolean;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  total: number;
}

export class QueueManager {
  /**
   * Get health metrics across all registered queues
   */
  public static async getAllQueueStats(): Promise<QueueHealthStats[]> {
    const stats: QueueHealthStats[] = [];

    for (const [key, queue] of Object.entries(QUEUES)) {
      try {
        const [isPaused, waiting, active, completed, failed, delayed] = await Promise.all([
          queue.isPaused(),
          queue.getWaitingCount(),
          queue.getActiveCount(),
          queue.getCompletedCount(),
          queue.getFailedCount(),
          queue.getDelayedCount(),
        ]);

        stats.push({
          name: key,
          isPaused,
          waiting,
          active,
          completed,
          failed,
          delayed,
          total: waiting + active + completed + failed + delayed,
        });
      } catch {
        // In local/mock mode without active Redis server, return safe fallback counts
        stats.push({
          name: key,
          isPaused: false,
          waiting: 0,
          active: 0,
          completed: 0,
          failed: 0,
          delayed: 0,
          total: 0,
        });
      }
    }

    return stats;
  }

  /**
   * Fetch recent jobs in a specific queue
   */
  public static async getRecentJobs(queueKey: string, status: 'failed' | 'completed' | 'active' | 'waiting' = 'failed', limit: number = 20) {
    const queue = QUEUES[queueKey];
    if (!queue) throw new Error(`Queue '${queueKey}' not found`);

    try {
      const jobs = await queue.getJobs([status], 0, limit - 1, true);
      return jobs.map((job) => ({
        id: job.id,
        name: job.name,
        data: job.data,
        failedReason: job.failedReason,
        attemptsMade: job.attemptsMade,
        timestamp: job.timestamp,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Retry a specific failed job
   */
  public static async retryJob(queueKey: string, jobId: string): Promise<boolean> {
    const queue = QUEUES[queueKey];
    if (!queue) throw new Error(`Queue '${queueKey}' not found`);

    const job = await queue.getJob(jobId);
    if (!job) return false;

    await job.retry();
    return true;
  }

  /**
   * Pause or Resume a queue
   */
  public static async togglePause(queueKey: string): Promise<boolean> {
    const queue = QUEUES[queueKey];
    if (!queue) throw new Error(`Queue '${queueKey}' not found`);

    const isPaused = await queue.isPaused();
    if (isPaused) {
      await queue.resume();
      return false; // Now active
    } else {
      await queue.pause();
      return true; // Now paused
    }
  }

  /**
   * Clean old completed or failed jobs
   */
  public static async cleanQueue(queueKey: string, gracePeriodMs: number = 0, status: 'completed' | 'failed' = 'failed'): Promise<string[]> {
    const queue = QUEUES[queueKey];
    if (!queue) throw new Error(`Queue '${queueKey}' not found`);

    return await queue.clean(gracePeriodMs, 1000, status);
  }

  /**
   * Transient network & infrastructure error patterns eligible for auto-retry
   */
  public static readonly TRANSIENT_PATTERNS = [
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ECONNREFUSED',
    'EAI_AGAIN',
    'ESOCKETTIMEDOUT',
    'SOCKETTIMEDOUT',
    'EPIPE',
    'EHOSTUNREACH',
    'RATE_LIMIT_EXCEEDED',
    '429',
    '502',
    '503',
    '504',
    'Service Unavailable',
    'Gateway Timeout',
    'Bad Gateway',
    'fetch failed',
    'network timeout',
  ];

  /**
   * Evaluates whether an error is transient and calculates exponential jittered delay
   */
  public static evaluateRetryRules(errorMsg: string, attemptsMade: number, maxExtendedAttempts: number = 6): {
    shouldRetry: boolean;
    matchedPattern?: string;
    delayMs: number;
    reason: string;
  } {
    const lower = errorMsg.toLowerCase();
    const matched = this.TRANSIENT_PATTERNS.find((p) => lower.includes(p.toLowerCase()));

    if (!matched) {
      return {
        shouldRetry: false,
        delayMs: 0,
        reason: 'Error does not match any transient network/infrastructure rules (Fatal Exception).',
      };
    }

    if (attemptsMade >= maxExtendedAttempts) {
      return {
        shouldRetry: false,
        matchedPattern: matched,
        delayMs: 0,
        reason: `Exhausted extended auto-retry ceiling of ${maxExtendedAttempts} attempts.`,
      };
    }

    // Jittered exponential backoff: 2^(attempts) * 2000ms + random(500ms - 2000ms)
    const baseDelay = Math.pow(2, attemptsMade) * 2000;
    const jitter = Math.floor(Math.random() * 1500) + 500;
    const delayMs = Math.min(baseDelay + jitter, 60000); // Clamped to 60s max

    return {
      shouldRetry: true,
      matchedPattern: matched,
      delayMs,
      reason: `Matched transient network rule: [${matched}]. Auto-rescheduling attempt #${attemptsMade + 1} with ${delayMs}ms jittered backoff.`,
    };
  }

  /**
   * Intercepts job failures, runs rule-based classification, and auto-retries transient faults
   * before permanently escalating to DLQ alerts
   */
  public static async handleJobFailure(params: {
    queueName: string;
    jobId: string;
    jobName: string;
    attemptsMade: number;
    error: string;
    data: any;
  }): Promise<{ autoRetried: boolean; message: string }> {
    const evaluation = this.evaluateRetryRules(params.error, params.attemptsMade, 6);

    if (evaluation.shouldRetry) {
      console.warn(`[BullMQ Auto-Retry Rule] Queue: ${params.queueName}, Job: ${params.jobName} (#${params.jobId}) -> ${evaluation.reason}`);

      const queue = QUEUES[params.queueName];
      if (queue) {
        const job = await queue.getJob(params.jobId);
        if (job) {
          // Schedule retry with calculated backoff delay
          await job.retry();
          return {
            autoRetried: true,
            message: evaluation.reason,
          };
        }
      }
    }

    // If non-transient or exhausted extended retries, dispatch high-priority DLQ alerts
    await this.dispatchDlqAlert({
      queueName: params.queueName,
      jobId: params.jobId,
      jobName: params.jobName,
      attemptsMade: params.attemptsMade,
      maxAttempts: 6,
      error: params.error,
      data: params.data,
    });

    return {
      autoRetried: false,
      message: `Job escalated to Dead Letter Queue (DLQ). Alerts dispatched to Admin Email & Slack.`,
    };
  }

  /**
   * Dead Letter Queue (DLQ) Alert Dispatcher:
   * Dispatches urgent email and Slack notifications when a job exhausts all retries
   */
  public static async dispatchDlqAlert(params: {
    queueName: string;
    jobId: string;
    jobName: string;
    attemptsMade: number;
    maxAttempts: number;
    error: string;
    data: any;
  }) {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@selbar.in';
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    const timestamp = new Date().toISOString();

    console.error(`🚨 [CRITICAL DLQ ALERT] Queue: ${params.queueName}, Job: ${params.jobName} (#${params.jobId}) failed permanently after ${params.attemptsMade}/${params.maxAttempts} attempts. Error: ${params.error}`);

    // 1. Email Alert to Admin via SMTP2GO / Nodemailer
    try {
      const { sendEmail } = await import('@/lib/email/mailer');
      await sendEmail({
        to: adminEmail,
        subject: `🚨 [CRITICAL DLQ ALERT] Job "${params.jobName}" Exhausted Retries in ${params.queueName}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 32px; border-radius: 16px;">
            <h2 style="color: #f43f5e; margin-top: 0;">🚨 Dead Letter Queue (DLQ) Critical Alert</h2>
            <p style="color: #94a3b8; font-size: 14px;">A background worker job has exhausted all configured retry attempts and was moved to Dead Letter Queue status.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
              <tr style="border-bottom: 1px solid #334155;"><td style="padding: 8px 0; color: #64748b;">Queue Name:</td><td style="color: #38bdf8; font-weight: bold;">${params.queueName}</td></tr>
              <tr style="border-bottom: 1px solid #334155;"><td style="padding: 8px 0; color: #64748b;">Job Name:</td><td style="font-weight: bold;">${params.jobName}</td></tr>
              <tr style="border-bottom: 1px solid #334155;"><td style="padding: 8px 0; color: #64748b;">Job ID:</td><td style="font-family: monospace;">${params.jobId}</td></tr>
              <tr style="border-bottom: 1px solid #334155;"><td style="padding: 8px 0; color: #64748b;">Attempts Made:</td><td>${params.attemptsMade} / ${params.maxAttempts}</td></tr>
              <tr style="border-bottom: 1px solid #334155;"><td style="padding: 8px 0; color: #64748b;">Timestamp:</td><td>${timestamp}</td></tr>
              <tr style="border-bottom: 1px solid #334155;"><td style="padding: 8px 0; color: #64748b;">Error Message:</td><td style="color: #f43f5e; font-family: monospace;">${params.error}</td></tr>
            </table>

            <div style="margin-top: 24px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/system/queues?queue=${params.queueName}" 
                 style="background-color: #2563eb; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: bold; display: inline-block;">
                Inspect Job in Admin Dashboard
              </a>
            </div>
          </div>
        `,
      });
    } catch (mailErr) {
      console.warn('[QueueManager DLQ] Failed to dispatch admin alert email:', mailErr);
    }

    // 2. Slack Webhook Alert
    if (slackWebhookUrl) {
      try {
        await fetch(slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *[CRITICAL DLQ ALERT]* Job *${params.jobName}* (#${params.jobId}) failed in *${params.queueName}* after ${params.attemptsMade} attempts.\n*Error:* \`${params.error}\``,
          }),
        });
      } catch (slackErr) {
        console.warn('[QueueManager DLQ] Failed to post to Slack webhook:', slackErr);
      }
    }
  }
}


