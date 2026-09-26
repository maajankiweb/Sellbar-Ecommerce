import { NextRequest, NextResponse } from 'next/server';
import { QueueManager } from '@/queues/queueManager';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queue = searchParams.get('queue');
    const status = (searchParams.get('status') as any) || 'failed';

    const queueStats = await QueueManager.getAllQueueStats();

    let jobs: any[] = [];
    if (queue) {
      jobs = await QueueManager.getRecentJobs(queue, status, 25);
    }

    return NextResponse.json({
      success: true,
      data: {
        queues: queueStats,
        selectedQueue: queue,
        jobs,
      },
    });
  } catch (error: any) {
    console.error('[Admin Queues API Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'QUEUE_METRICS_ERROR',
          message: error.message || 'Failed to fetch queue metrics',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, queue, jobId } = body;

    if (!queue) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'Queue name is required' } },
        { status: 400 }
      );
    }

    if (action === 'retry' && jobId) {
      const retried = await QueueManager.retryJob(queue, jobId);
      return NextResponse.json({ success: true, message: `Job ${jobId} scheduled for retry`, retried });
    }

    if (action === 'toggle-pause') {
      const isPaused = await QueueManager.togglePause(queue);
      return NextResponse.json({
        success: true,
        message: `Queue ${queue} is now ${isPaused ? 'PAUSED' : 'ACTIVE'}`,
        isPaused,
      });
    }

    if (action === 'clean') {
      const cleaned = await QueueManager.cleanQueue(queue, 0, 'failed');
      return NextResponse.json({ success: true, message: `Cleaned ${cleaned.length} failed jobs` });
    }

    return NextResponse.json(
      { success: false, error: { code: 'UNKNOWN_ACTION', message: 'Unrecognized queue action' } },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[Admin Queues Action Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'QUEUE_ACTION_ERROR',
          message: error.message || 'Failed to execute queue action',
        },
      },
      { status: 500 }
    );
  }
}
