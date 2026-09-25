import { NextRequest, NextResponse } from 'next/server';
import {
  sendWelcomeRegistrationEmail,
  sendGoogleReviewNotificationEmail,
  sendSubscriptionRenewalReminderEmail,
  sendSubscriptionCancellationEmail,
} from '@/lib/email/emailNotificationService';
import { verifySmtpConnection, getTransporter } from '@/lib/email/mailer';

export async function GET() {
  const { provider } = getTransporter();
  const smtpStatus = await verifySmtpConnection();

  return NextResponse.json({
    status: 'online',
    currentProvider: provider,
    smtpConnection: smtpStatus,
    endpoints: {
      testEmail: 'POST /api/v1/notifications/email-test',
      googleReview: 'POST /api/v1/notifications/google-review',
      subscription: 'POST /api/v1/notifications/subscription',
      registerWelcome: 'POST /api/v1/auth/register',
    },
    supportedTypes: ['welcome', 'google_review', 'subscription_renewal', 'subscription_cancellation'],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const type = body.type || 'welcome';
    const email = body.email || 'customer.test@selbar.in';
    const name = body.name || 'Priya Patel';

    if (type === 'welcome') {
      const result = await sendWelcomeRegistrationEmail({
        email,
        name,
        username: body.username || 'priya_p',
      });
      return NextResponse.json({
        success: true,
        type: 'welcome',
        message: 'Welcome email triggered successfully.',
        result,
      });
    }

    if (type === 'google_review') {
      const result = await sendGoogleReviewNotificationEmail({
        authorName: body.authorName || name,
        rating: Number(body.rating) || 5,
        reviewText:
          body.reviewText ||
          'Incredible experience! The technician arrived on time and verified my MacBook in 10 minutes. Money credited instantly.',
        time: 'Just now',
        adminEmail: email,
      });
      return NextResponse.json({
        success: true,
        type: 'google_review',
        message: 'Google review notification email triggered successfully.',
        result,
      });
    }

    if (type === 'subscription_renewal') {
      const result = await sendSubscriptionRenewalReminderEmail({
        userEmail: email,
        userName: name,
        planName: body.planName || 'SELBAR VIP Protection Pass',
        renewalDate: body.renewalDate || '12 Oct 2026',
        renewalAmount: Number(body.amount) || 1299,
        billingCycle: 'Annual',
        paymentMethodSnippet: 'UPI Auto-pay (•••• 1024)',
      });
      return NextResponse.json({
        success: true,
        type: 'subscription_renewal',
        message: 'Subscription renewal reminder email triggered successfully.',
        result,
      });
    }

    if (type === 'subscription_cancellation') {
      const result = await sendSubscriptionCancellationEmail({
        userEmail: email,
        userName: name,
        planName: body.planName || 'SELBAR VIP Protection Pass',
        cancellationDate: 'Today',
        effectiveUntilDate: body.effectiveUntilDate || '12 Oct 2026',
        reason: body.reason || 'Switched device brand',
      });
      return NextResponse.json({
        success: true,
        type: 'subscription_cancellation',
        message: 'Subscription cancellation confirmation email triggered successfully.',
        result,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: `Unknown email test type '${type}'. Supported: 'welcome', 'google_review', 'subscription_renewal', 'subscription_cancellation'`,
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[Email Test API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to dispatch test email',
      },
      { status: 500 }
    );
  }
}
