import { sendEmail, SendMailResult } from './mailer';

// ============================================================================
// 1. WELCOME EMAIL UPON USER REGISTRATION
// ============================================================================

export interface WelcomeEmailParams {
  email: string;
  name?: string;
  username?: string;
}

export async function sendWelcomeRegistrationEmail(params: WelcomeEmailParams): Promise<SendMailResult> {
  const displayName = params.name || params.username || 'SELBAR Member';
  const cleanEmail = params.email.trim().toLowerCase();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to SELBAR</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
    
    <!-- Hero Banner -->
    <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 50%, #0284c7 100%); padding: 36px 28px; text-align: center; color: #ffffff;">
      <div style="font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 0;">SEL<span style="color: #6ee7b7;">BAR</span></div>
      <p style="margin: 6px 0 0; font-size: 13px; color: #ccfbf1; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
        India's Trusted Electronics Recommerce Platform
      </p>
      <div style="display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); padding: 6px 18px; border-radius: 9999px; margin-top: 18px; font-size: 13px; font-weight: 700;">
        🎉 Welcome to the Community!
      </div>
    </div>

    <!-- Content Body -->
    <div style="padding: 32px 28px;">
      <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 12px;">Hello ${displayName},</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px;">
        Thank you for joining <strong>SELBAR</strong>. Your account has been successfully created and secured. You now have full access to doorstep gadget buybacks, certified refurbished devices, and premium device trade-in pricing.
      </p>

      <!-- Key Benefits Card -->
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
        <h2 style="font-size: 14px; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px;">
          What You Can Do Right Now:
        </h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; vertical-align: top; width: 28px; font-size: 16px;">🛵</td>
            <td style="padding: 8px 0; font-size: 13px; color: #15803d; line-height: 1.5;">
              <strong>Instant Doorstep Buyback:</strong> Sell your used smartphone, laptop, or tablet. Our executive inspects the device at your home and transfers cash to your UPI immediately.
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; vertical-align: top; width: 28px; font-size: 16px;">✨</td>
            <td style="padding: 8px 0; font-size: 13px; color: #15803d; line-height: 1.5;">
              <strong>Certified Refurbished Tech:</strong> Shop rigorously tested Grade A+ gadgets backed by a <strong>12-Month Assured Warranty</strong> and 5-Day Return Guarantee.
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; vertical-align: top; width: 28px; font-size: 16px;">🛡️</td>
            <td style="padding: 8px 0; font-size: 13px; color: #15803d; line-height: 1.5;">
              <strong>DoD-Standard Data Wiping:</strong> We ensure 100% cryptographic sanitization of your previous data before resale or recycling.
            </td>
          </tr>
        </table>
      </div>

      <!-- Action Buttons -->
      <div style="text-align: center; margin: 28px 0 16px;">
        <a href="https://selbar.in/sell" style="display: inline-block; background: #059669; color: #ffffff; text-decoration: none; padding: 13px 26px; border-radius: 12px; font-size: 14px; font-weight: 700; margin: 4px; box-shadow: 0 4px 12px rgba(5,150,105,0.25);">
          Sell Old Device →
        </a>
        <a href="https://selbar.in/user/profile" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 13px 26px; border-radius: 12px; font-size: 14px; font-weight: 700; margin: 4px;">
          Complete My Profile
        </a>
      </div>

      <!-- Account Details Summary -->
      <div style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 16px; font-size: 12px; color: #64748b; margin-top: 24px;">
        <div style="font-weight: 700; color: #334155; margin-bottom: 6px;">Your Registered Credentials:</div>
        <div>Primary Email: <strong style="color: #0f172a;">${cleanEmail}</strong></div>
        ${params.username ? `<div>Username: <strong style="color: #0f172a;">${params.username}</strong></div>` : ''}
        <div style="margin-top: 6px; color: #94a3b8; font-size: 11px;">If you ever lose access to your account, you can reset your password using this email.</div>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; line-height: 1.6;">
      <p style="margin: 0;">SELBAR Recommerce India (Maajanki Web Tech) • Bettiah, West Champaran, Bihar - 845438</p>
      <p style="margin: 4px 0 0;">Need assistance? Reply directly to this email or visit our <a href="https://selbar.in/account/help" style="color: #059669; text-decoration: none; font-weight: 600;">24/7 Help Desk</a>.</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: cleanEmail,
    subject: `Welcome to SELBAR, ${displayName}! 🎉 Your account is ready`,
    html,
  });
}

// ============================================================================
// 2. NOTIFICATION WHEN A NEW GOOGLE REVIEW IS RECEIVED
// ============================================================================

export interface GoogleReviewNotificationParams {
  authorName: string;
  rating: number;
  reviewText: string;
  time?: string;
  reviewUrl?: string;
  adminEmail?: string;
}

export async function sendGoogleReviewNotificationEmail(params: GoogleReviewNotificationParams): Promise<SendMailResult> {
  const recipient = params.adminEmail || process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER || 'admin@selbar.in';
  const stars = '★'.repeat(Math.max(1, Math.min(5, Math.round(params.rating)))) + '☆'.repeat(5 - Math.max(1, Math.min(5, Math.round(params.rating))));
  const isPositive = params.rating >= 4;
  const isCritical = params.rating <= 2;
  const reviewTime = params.time || 'Just now';
  const gmbUrl = params.reviewUrl || 'https://maps.google.com/?cid=selbar-recommerce';

  const badgeColor = isPositive ? '#059669' : isCritical ? '#dc2626' : '#d97706';
  const badgeBg = isPositive ? '#ecfdf5' : isCritical ? '#fef2f2' : '#fffbeb';
  const badgeBorder = isPositive ? '#a7f3d0' : isCritical ? '#fecaca' : '#fde68a';
  const sentimentText = isPositive ? 'POSITIVE REVIEW (4-5 Stars)' : isCritical ? 'URGENT: CRITICAL FEEDBACK (1-2 Stars)' : 'NEUTRAL FEEDBACK (3 Stars)';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Google Review Notification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
    
    <!-- Header -->
    <div style="background: #0f172a; padding: 24px 28px; color: #ffffff; display: flex; align-items: center; justify-content: space-between;">
      <div>
        <div style="font-size: 20px; font-weight: 800; color: #38bdf8;">Google Business Profile Alert</div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">SELBAR Official Store & Doorstep Hub</div>
      </div>
    </div>

    <!-- Banner -->
    <div style="background: ${badgeBg}; border-bottom: 1px solid ${badgeBorder}; padding: 14px 28px; font-size: 12px; font-weight: 800; color: ${badgeColor};">
      ${sentimentText} • ${reviewTime}
    </div>

    <!-- Review Card Content -->
    <div style="padding: 28px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <div>
          <div style="font-size: 18px; font-weight: 800; color: #0f172a;">${params.authorName}</div>
          <div style="font-size: 12px; color: #64748b;">Verified Google Reviewer</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 22px; color: #f59e0b; letter-spacing: 2px; font-weight: 900;">${stars}</div>
          <div style="font-size: 11px; font-weight: 700; color: #64748b;">${params.rating} out of 5.0</div>
        </div>
      </div>

      <!-- Quote Box -->
      <div style="background: #f8fafc; border-left: 4px solid ${badgeColor}; border-radius: 0 12px 12px 0; padding: 18px; margin: 20px 0; font-size: 14px; line-height: 1.6; color: #334155; font-style: italic;">
        "${params.reviewText}"
      </div>

      ${
        isCritical
          ? `
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 14px; font-size: 12px; color: #991b1b; margin-bottom: 20px;">
          ⚠️ <strong>Immediate Resolution Required:</strong> This review is below our 4.0 benchmark. Replying publicly within 2 hours boosts customer retention and prevents brand score depreciation.
        </div>
      `
          : ''
      }

      <!-- Action Buttons -->
      <div style="margin-top: 24px; text-align: center;">
        <a href="${gmbUrl}" style="display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 13px; font-weight: 700; margin-right: 8px;">
          Reply on Google Maps →
        </a>
        <a href="https://selbar.in/admin/reviews" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 13px; font-weight: 700;">
          Open Admin Reviews Desk
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
      Automated dispatch via SELBAR Nodemailer Integration • Google Business API Webhook
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: recipient,
    subject: `⭐ New Google Review: ${params.rating} Stars from ${params.authorName}`,
    html,
  });
}

// ============================================================================
// 3A. SUBSCRIPTION RENEWAL REMINDER EMAIL
// ============================================================================

export interface SubscriptionRenewalParams {
  userEmail: string;
  userName: string;
  planName: string;
  renewalDate: string;
  renewalAmount: number;
  billingCycle?: string;
  paymentMethodSnippet?: string;
  manageUrl?: string;
}

export async function sendSubscriptionRenewalReminderEmail(params: SubscriptionRenewalParams): Promise<SendMailResult> {
  const cleanEmail = params.userEmail.trim().toLowerCase();
  const manageLink = params.manageUrl || 'https://selbar.in/user/profile';
  const cycle = params.billingCycle || 'Annual';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Subscription Renewal Reminder</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
    
    <!-- Top Brand -->
    <div style="background: #0f172a; padding: 28px; text-align: center; color: #ffffff;">
      <div style="font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">SEL<span style="color: #38bdf8;">BAR</span> Care+</div>
      <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Device Protection & VIP Membership</p>
    </div>

    <!-- Notice Pill -->
    <div style="background: #eff6ff; border-bottom: 1px solid #bfdbfe; padding: 14px 28px; font-size: 13px; font-weight: 700; color: #1d4ed8; text-align: center;">
      ⏰ Upcoming Auto-Renewal on ${params.renewalDate}
    </div>

    <!-- Body -->
    <div style="padding: 32px 28px;">
      <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 12px;">Hi ${params.userName},</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
        This is a friendly reminder that your <strong>${params.planName}</strong> plan will automatically renew on <strong>${params.renewalDate}</strong>. Your device warranty and priority trade-in benefits will continue uninterrupted.
      </p>

      <!-- Invoice Breakdown Card -->
      <div style="background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; color: #64748b;">Plan:</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #0f172a;">${params.planName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; color: #64748b;">Billing Frequency:</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0f172a;">${cycle}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; color: #64748b;">Renewal Date:</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0f172a;">${params.renewalDate}</td>
          </tr>
          ${
            params.paymentMethodSnippet
              ? `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; color: #64748b;">Payment Method:</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0f172a;">${params.paymentMethodSnippet}</td>
          </tr>
          `
              : ''
          }
          <tr>
            <td style="padding: 12px 0 0; font-size: 15px; font-weight: 800; color: #0f172a;">Amount Due:</td>
            <td style="padding: 12px 0 0; text-align: right; font-size: 18px; font-weight: 900; color: #059669;">
              ₹${params.renewalAmount.toLocaleString('en-IN')}
            </td>
          </tr>
        </table>
      </div>

      <!-- Covered Benefits -->
      <div style="background: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0; padding: 16px; margin-bottom: 24px; font-size: 13px; color: #166534;">
        <strong style="display: block; margin-bottom: 6px;">Active Protection Retained:</strong>
        ✓ Zero-deductible screen & liquid damage protection<br>
        ✓ Free doorstep courier pickup across India<br>
        ✓ Guaranteed +15% extra buyback bonus on future device upgrades
      </div>

      <!-- Action CTAs -->
      <div style="text-align: center; margin-top: 24px;">
        <a href="${manageLink}" style="display: inline-block; background: #059669; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 12px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 12px rgba(5,150,105,0.25);">
          Manage Subscription & Payment Method →
        </a>
      </div>

      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 20px;">
        If you wish to change your payment method or cancel auto-renewal, you can do so anytime before ${params.renewalDate} from your SELBAR User Portal.
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #f1f5f9; padding: 18px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
      SELBAR Warranty & Protection Services • Maajanki Web Tech • Bettiah, Bihar
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: cleanEmail,
    subject: `Notice: Your ${params.planName} renews on ${params.renewalDate}`,
    html,
  });
}

// ============================================================================
// 3B. SUBSCRIPTION CANCELLATION CONFIRMATION EMAIL
// ============================================================================

export interface SubscriptionCancellationParams {
  userEmail: string;
  userName: string;
  planName: string;
  cancellationDate?: string;
  effectiveUntilDate: string;
  reason?: string;
  resubscribeUrl?: string;
}

export async function sendSubscriptionCancellationEmail(params: SubscriptionCancellationParams): Promise<SendMailResult> {
  const cleanEmail = params.userEmail.trim().toLowerCase();
  const cancelDate = params.cancellationDate || new Date().toLocaleDateString('en-IN');
  const resubscribeLink = params.resubscribeUrl || 'https://selbar.in/warranty';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Subscription Cancellation Confirmation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
    
    <!-- Top Header -->
    <div style="background: #334155; padding: 28px; text-align: center; color: #ffffff;">
      <div style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">SELBAR</div>
      <p style="margin: 4px 0 0; font-size: 12px; color: #cbd5e1; text-transform: uppercase;">Subscription Update</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 28px;">
      <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 12px;">Hi ${params.userName},</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px;">
        As requested, auto-renewal for your <strong>${params.planName}</strong> has been cancelled as of <strong>${cancelDate}</strong>. No further charges will be made to your payment method.
      </p>

      <!-- Active Until Banner -->
      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 14px; padding: 18px; margin-bottom: 24px;">
        <div style="font-size: 13px; font-weight: 700; color: #92400e;">
          🛡️ Your Coverage Remains Active Until:
        </div>
        <div style="font-size: 16px; font-weight: 900; color: #78350f; margin-top: 4px;">
          ${params.effectiveUntilDate}
        </div>
        <p style="font-size: 12px; color: #b45309; margin: 6px 0 0; line-height: 1.5;">
          You can continue submitting warranty claims and enjoying your coverage until this date without penalty.
        </p>
      </div>

      ${
        params.reason
          ? `
      <div style="font-size: 12px; color: #64748b; margin-bottom: 20px;">
        Recorded Feedback / Reason: <em>"${params.reason}"</em>
      </div>
      `
          : ''
      }

      <p style="font-size: 14px; line-height: 1.6; color: #475569;">
        We're sorry to see you go! If you ever wish to reactivate your device protection or VIP status, you can resubscribe with a single click anytime.
      </p>

      <!-- Reactivate CTA -->
      <div style="text-align: center; margin: 28px 0 12px;">
        <a href="${resubscribeLink}" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 13px 26px; border-radius: 12px; font-size: 14px; font-weight: 700;">
          Reactivate My Protection →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f1f5f9; padding: 18px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
      SELBAR Support Desk • Have questions? Contact us at support@selbar.in
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: cleanEmail,
    subject: `Confirmation: Cancellation of ${params.planName}`,
    html,
  });
}
