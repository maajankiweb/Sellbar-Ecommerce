import { NextResponse } from 'next/server';
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  sendEmailNotification,
} from '@/lib/notifications/engine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipient = searchParams.get('recipient') || undefined;
    const unreadOnly = searchParams.get('unread') === 'true';

    const notifications = getNotifications(recipient, unreadOnly);
    return NextResponse.json({
      success: true,
      notifications,
      unreadCount: notifications.filter(n => !n.isRead).length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch notifications';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'send_email') {
      const { to, subject, htmlContent } = body;
      if (!to || !subject) {
        return NextResponse.json({ success: false, error: 'Recipient and subject required' }, { status: 400 });
      }
      const result = await sendEmailNotification({ to, subject, htmlContent: htmlContent || subject });
      return NextResponse.json({ success: true, result });
    }

    // Default action: create notification
    const { recipient, title, message, type, metadata } = body;
    if (!recipient || !title || !message) {
      return NextResponse.json({ success: false, error: 'Recipient, title and message required' }, { status: 400 });
    }

    const item = createNotification({
      recipient,
      title,
      message,
      type: type || 'SYSTEM_ANNOUNCEMENT',
      metadata,
    });

    return NextResponse.json({ success: true, notification: item });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, recipient, markAll } = body;

    if (markAll && recipient) {
      const updatedCount = markAllNotificationsAsRead(recipient);
      return NextResponse.json({ success: true, updatedCount });
    }

    if (id) {
      const success = markNotificationAsRead(id);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, error: 'ID or recipient required' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
