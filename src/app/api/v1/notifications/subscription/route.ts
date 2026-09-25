import { NextRequest, NextResponse } from 'next/server';
import {
  sendSubscriptionRenewalReminderEmail,
  sendSubscriptionCancellationEmail,
} from '@/lib/email/emailNotificationService';
import { createNotification } from '@/lib/notifications/engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || body.type;

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing 'action' in request body. Must be 'renewal_reminder' or 'cancellation'.",
        },
        { status: 400 }
      );
    }

    const userEmail = body.userEmail || body.email;
    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing 'userEmail' or 'email' in request body.",
        },
        { status: 400 }
      );
    }

    const userName = body.userName || body.name || 'Valued Member';
    const planName = body.planName || 'SELBAR Complete Care+ (1-Year Device Protection)';

    // Action 1: Renewal Reminder Email
    if (action === 'renewal_reminder' || action === 'renewal') {
      const renewalDate = body.renewalDate || new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const renewalAmount = Number(body.renewalAmount || body.amount) || 1499;
      const billingCycle = body.billingCycle || 'Annual (12 Months)';
      const paymentMethodSnippet = body.paymentMethodSnippet || body.paymentMethod || 'UPI Auto-pay (•••• 9842)';
      const manageUrl = body.manageUrl || 'https://selbar.in/user/profile';

      const mailResult = await sendSubscriptionRenewalReminderEmail({
        userEmail,
        userName,
        planName,
        renewalDate,
        renewalAmount,
        billingCycle,
        paymentMethodSnippet,
        manageUrl,
      });

      createNotification({
        recipient: userEmail,
        title: `Subscription Renewal Notice: ${planName}`,
        message: `Your ${planName} is scheduled to renew on ${renewalDate} for ₹${renewalAmount}.`,
        type: 'SYSTEM_ANNOUNCEMENT',
        metadata: { planName, renewalDate, renewalAmount, provider: mailResult.provider },
      });

      return NextResponse.json({
        success: true,
        action: 'renewal_reminder',
        message: `Subscription renewal reminder email dispatched to ${userEmail} via ${mailResult.provider}.`,
        mailResult,
      });
    }

    // Action 2: Cancellation Confirmation Email
    if (action === 'cancellation' || action === 'cancel') {
      const cancellationDate = body.cancellationDate || new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const effectiveUntilDate =
        body.effectiveUntilDate ||
        new Date(Date.now() + 23 * 86400000).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      const reason = body.reason || 'User opted not to renew auto-protection';
      const resubscribeUrl = body.resubscribeUrl || 'https://selbar.in/warranty';

      const mailResult = await sendSubscriptionCancellationEmail({
        userEmail,
        userName,
        planName,
        cancellationDate,
        effectiveUntilDate,
        reason,
        resubscribeUrl,
      });

      createNotification({
        recipient: userEmail,
        title: `Subscription Cancelled: ${planName}`,
        message: `Auto-renewal for ${planName} stopped. Coverage remains active until ${effectiveUntilDate}.`,
        type: 'SYSTEM_ANNOUNCEMENT',
        metadata: { planName, effectiveUntilDate, reason, provider: mailResult.provider },
      });

      return NextResponse.json({
        success: true,
        action: 'cancellation',
        message: `Subscription cancellation confirmation email dispatched to ${userEmail} via ${mailResult.provider}.`,
        mailResult,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: `Unsupported action '${action}'. Expected 'renewal_reminder' or 'cancellation'.`,
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[API Subscription Notification Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to dispatch subscription notification email',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/v1/notifications/subscription',
    description: 'POST to trigger subscription renewal reminder or cancellation confirmation email',
    supportedActions: ['renewal_reminder', 'cancellation'],
    exampleRenewalPayload: {
      action: 'renewal_reminder',
      userEmail: 'customer@example.com',
      userName: 'Karan Sharma',
      planName: 'SELBAR Care+ Extended Warranty',
      renewalDate: '15 Oct 2026',
      renewalAmount: 1499,
      billingCycle: 'Annual',
    },
    exampleCancellationPayload: {
      action: 'cancellation',
      userEmail: 'customer@example.com',
      userName: 'Karan Sharma',
      planName: 'SELBAR Care+ Extended Warranty',
      effectiveUntilDate: '15 Oct 2026',
      reason: 'Upgraded to a new phone',
    },
  });
}
