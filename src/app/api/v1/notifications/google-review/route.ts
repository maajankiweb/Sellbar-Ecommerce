import { NextRequest, NextResponse } from 'next/server';
import { sendGoogleReviewNotificationEmail } from '@/lib/email/emailNotificationService';
import { createNotification } from '@/lib/notifications/engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const authorName = body.authorName || body.reviewerName || body.name || 'Google Customer';
    const rating = Number(body.rating) || 5;
    const reviewText = body.reviewText || body.comment || body.text || 'Great experience with SELBAR!';
    const time = body.time || new Date().toLocaleString('en-IN');
    const reviewUrl = body.reviewUrl || 'https://maps.google.com/?cid=selbar-recommerce';
    const adminEmail = body.adminEmail || process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;

    // 1. Dispatch Google Review Email Alert to Admin/Store Manager
    const mailResult = await sendGoogleReviewNotificationEmail({
      authorName,
      rating,
      reviewText,
      time,
      reviewUrl,
      adminEmail,
    });

    // 2. Register alert in admin notification system
    createNotification({
      recipient: 'admin',
      title: `New Google Review: ${rating}★ from ${authorName}`,
      message: `"${reviewText.slice(0, 120)}..."`,
      type: 'SYSTEM_ANNOUNCEMENT',
      metadata: { authorName, rating, reviewUrl, provider: mailResult.provider },
    });

    return NextResponse.json({
      success: true,
      message: `Google review notification processed and email dispatched via ${mailResult.provider}.`,
      data: {
        authorName,
        rating,
        reviewText,
        mailResult,
      },
    });
  } catch (error: any) {
    console.error('[API Google Review Notification Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process Google review notification',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/v1/notifications/google-review',
    description: 'POST to trigger Google Review notification email to Admin/Operations Manager',
    examplePayload: {
      authorName: 'Rahul Sharma',
      rating: 5,
      reviewText: 'Sold my iPhone 14 Pro at my doorstep in Bettiah. Got paid cash on UPI within 5 minutes. Best experience!',
      reviewUrl: 'https://maps.google.com/?cid=selbar',
    },
  });
}
