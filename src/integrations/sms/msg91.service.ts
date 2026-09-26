import axios from 'axios';
import { cacheStore } from '@/lib/auth/security/redisClient';

export interface Msg91UsageReport {
  currentUsage: number;
  quotaLimit: number;
  warningThreshold: number;
  criticalThreshold: number;
  isHardStopped: boolean;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'HARD_STOP';
}

export class Msg91Service {
  private static readonly AUTH_KEY = process.env.MSG91_AUTH_KEY || '';
  private static readonly TEMPLATE_ID = process.env.MSG91_OTP_TEMPLATE_ID || '';
  public static readonly OTP_LIMIT = parseInt(process.env.MSG91_OTP_LIMIT || '5000', 10);
  public static readonly WARNING_THRESHOLD = parseInt(process.env.MSG91_WARNING_THRESHOLD || '4500', 10);
  public static readonly CRITICAL_THRESHOLD = parseInt(process.env.MSG91_CRITICAL_THRESHOLD || '4750', 10);

  /**
   * Get real-time MSG91 quota metrics
   */
  public static async getUsageMetrics(): Promise<Msg91UsageReport> {
    const raw = await cacheStore.get('msg91:usage:total');
    const currentUsage = raw ? parseInt(raw, 10) : 0;

    let status: Msg91UsageReport['status'] = 'NORMAL';
    if (currentUsage >= this.OTP_LIMIT) {
      status = 'HARD_STOP';
    } else if (currentUsage >= this.CRITICAL_THRESHOLD) {
      status = 'CRITICAL';
    } else if (currentUsage >= this.WARNING_THRESHOLD) {
      status = 'WARNING';
    }

    return {
      currentUsage,
      quotaLimit: this.OTP_LIMIT,
      warningThreshold: this.WARNING_THRESHOLD,
      criticalThreshold: this.CRITICAL_THRESHOLD,
      isHardStopped: currentUsage >= this.OTP_LIMIT,
      status,
    };
  }

  /**
   * Check threshold boundaries and dispatch Slack webhook + Admin Email alerts
   */
  public static async checkAndDispatchQuotaAlerts(currentUsage: number): Promise<void> {
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@selbar.in';

    // 1. HARD STOP ALERT (5,000)
    if (currentUsage >= this.OTP_LIMIT) {
      const lockKey = `msg91:alert:sent:5000`;
      const alreadySent = await cacheStore.get(lockKey);
      if (!alreadySent) {
        await cacheStore.set(lockKey, 'true', 30 * 24 * 3600); // 30-day lock
        await this.postSlackWebhook(slackWebhookUrl, {
          color: '#ef4444',
          title: '🛑 [MSG91 HARD STOP TRIGGERED] 5,000 SMS OTP Budget Exhausted!',
          message: `SMS OTP dispatching is now disabled. Registration is strictly operating via Email Verification OTP fallback. Please top up MSG91 credits immediately.`,
          usage: `${currentUsage} / ${this.OTP_LIMIT}`,
        });
        await this.sendAdminEmailAlert(adminEmail, 'CRITICAL: MSG91 SMS Budget Exhausted (Hard Stop)', currentUsage);
      }
      return;
    }

    // 2. CRITICAL ALERT (4,750)
    if (currentUsage >= this.CRITICAL_THRESHOLD) {
      const lockKey = `msg91:alert:sent:4750`;
      const alreadySent = await cacheStore.get(lockKey);
      if (!alreadySent) {
        await cacheStore.set(lockKey, 'true', 30 * 24 * 3600);
        await this.postSlackWebhook(slackWebhookUrl, {
          color: '#f97316',
          title: '🚨 [MSG91 CRITICAL ALERT] 4,750/5,000 Credits Used (95%)',
          message: `Only 250 SMS OTP credits remain in the safety budget. Prepare quota extension to avoid registration fallback.`,
          usage: `${currentUsage} / ${this.OTP_LIMIT}`,
        });
        await this.sendAdminEmailAlert(adminEmail, 'URGENT: MSG91 Reached 95% (4,750 Credits)', currentUsage);
      }
      return;
    }

    // 3. WARNING ALERT (4,500)
    if (currentUsage >= this.WARNING_THRESHOLD) {
      const lockKey = `msg91:alert:sent:4500`;
      const alreadySent = await cacheStore.get(lockKey);
      if (!alreadySent) {
        await cacheStore.set(lockKey, 'true', 30 * 24 * 3600);
        await this.postSlackWebhook(slackWebhookUrl, {
          color: '#f59e0b',
          title: '⚠️ [MSG91 QUOTA WARNING] 4,500/5,000 Credits Used (90%)',
          message: `SMS OTP consumption has reached 90% of configured safety ceiling.`,
          usage: `${currentUsage} / ${this.OTP_LIMIT}`,
        });
      }
    }
  }

  /**
   * Dispatch SMS OTP via MSG91 v5 API with budget safety guard
   */
  public static async sendRegistrationOtp(
    mobile: string,
    otp: string
  ): Promise<{ success: boolean; messageId?: string; fallbackRequired?: boolean; error?: string }> {
    const metrics = await this.getUsageMetrics();

    // Enforce Hard Stop
    if (metrics.isHardStopped) {
      console.warn(`[MSG91] Hard stop active (${metrics.currentUsage}/${this.OTP_LIMIT}). Falling back to Email OTP.`);
      return {
        success: false,
        fallbackRequired: true,
        error: 'SMS_QUOTA_EXHAUSTED',
      };
    }

    try {
      // Clean mobile format (e.g. 919876543210)
      const sanitizedPhone = mobile.replace(/\D/g, '');

      // In sandbox mode or if auth key is not configured, simulate success and increment counter
      if (!this.AUTH_KEY || this.AUTH_KEY.includes('placeholder')) {
        const nextUsage = metrics.currentUsage + 1;
        await cacheStore.set('msg91:usage:total', nextUsage.toString());
        await this.checkAndDispatchQuotaAlerts(nextUsage);

        return {
          success: true,
          messageId: `mock_msg91_${Date.now()}`,
        };
      }

      const response = await axios.post(
        'https://control.msg91.com/api/v5/otp',
        {
          template_id: this.TEMPLATE_ID,
          mobile: sanitizedPhone,
          otp: otp,
        },
        {
          headers: {
            authkey: this.AUTH_KEY,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );

      if (response.data?.type === 'success' || response.status === 200) {
        const nextUsage = metrics.currentUsage + 1;
        await cacheStore.set('msg91:usage:total', nextUsage.toString());
        await this.checkAndDispatchQuotaAlerts(nextUsage);

        return {
          success: true,
          messageId: response.data?.message || `msg91_${Date.now()}`,
        };
      }

      return {
        success: false,
        fallbackRequired: true,
        error: response.data?.message || 'MSG91_REJECTED_DISPATCH',
      };
    } catch (err: any) {
      console.error('[MSG91 Error]', err?.response?.data || err.message);
      return {
        success: false,
        fallbackRequired: true,
        error: 'MSG91_NETWORK_ERROR',
      };
    }
  }

  private static async postSlackWebhook(
    webhookUrl: string | undefined,
    data: { color: string; title: string; message: string; usage: string }
  ) {
    if (!webhookUrl) return;
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attachments: [
            {
              color: data.color,
              title: data.title,
              text: `${data.message}\n*Current Quota:* \`${data.usage}\``,
              footer: 'SELBAR Telemetry & Quota Engine',
              ts: Math.floor(Date.now() / 1000),
            },
          ],
        }),
      });
    } catch (err) {
      console.warn('[MSG91 Slack Webhook Error]', err);
    }
  }

  private static async sendAdminEmailAlert(adminEmail: string, subject: string, usage: number) {
    try {
      const { sendEmail } = await import('@/lib/email/mailer');
      await sendEmail({
        to: adminEmail,
        subject: `⚠️ [SELBAR QUOTA] ${subject}`,
        html: `
          <div style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px;">
            <h3 style="color: #f59e0b;">MSG91 SMS OTP Quota Alert</h3>
            <p>Your configured safety limit of <strong>${this.OTP_LIMIT}</strong> SMS OTP credits is reaching saturation.</p>
            <p><strong>Current Consumption:</strong> ${usage} / ${this.OTP_LIMIT} (${Math.round((usage / this.OTP_LIMIT) * 100)}%)</p>
            <p style="color: #94a3b8; font-size: 12px;">If usage reaches 5,000, new registrations will automatically fall back to email verification without charging additional SMS credits.</p>
          </div>
        `,
      });
    } catch (err) {
      console.warn('[MSG91 Email Alert Error]', err);
    }
  }
}
