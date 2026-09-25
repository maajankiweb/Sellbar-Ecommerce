import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { createNotification } from '../notifications/engine';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export interface SendMailResult {
  success: boolean;
  provider: 'Gmail' | 'SendGrid' | 'SMTP' | 'Local Sandbox';
  messageId?: string;
  message: string;
  error?: string;
}

let cachedTransporter: Transporter | null = null;
let currentProvider: 'Gmail' | 'SendGrid' | 'SMTP' | 'Local Sandbox' = 'Local Sandbox';

/**
 * Creates and caches the Nodemailer transporter based on environment variables.
 * Supported SMTP Providers:
 * 1. Gmail (SMTP_SERVICE=gmail or GMAIL_USER + GMAIL_APP_PASSWORD)
 * 2. SendGrid (SMTP_SERVICE=sendgrid or SENDGRID_API_KEY)
 * 3. Custom SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE)
 * 4. Local Sandbox fallback (Logs to console and internal notification queue)
 */
export function getTransporter(): { transporter: Transporter | null; provider: typeof currentProvider } {
  if (cachedTransporter) {
    return { transporter: cachedTransporter, provider: currentProvider };
  }

  // 1. SendGrid SMTP Configuration
  if (
    process.env.SENDGRID_API_KEY ||
    (process.env.SMTP_SERVICE?.toLowerCase() === 'sendgrid' && process.env.SMTP_PASS)
  ) {
    const apiKey = process.env.SENDGRID_API_KEY || process.env.SMTP_PASS || '';
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: apiKey,
      },
    });
    currentProvider = 'SendGrid';
    return { transporter: cachedTransporter, provider: currentProvider };
  }

  // 2. Gmail SMTP Configuration
  if (
    process.env.SMTP_SERVICE?.toLowerCase() === 'gmail' ||
    (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
  ) {
    const user = process.env.GMAIL_USER || process.env.SMTP_USER;
    const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

    if (user && pass) {
      cachedTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass,
        },
      });
      currentProvider = 'Gmail';
      return { transporter: cachedTransporter, provider: currentProvider };
    }
  }

  // 3. Generic Custom SMTP (Hostinger / AWS SES / Zoho / Mailgun)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });
    currentProvider = 'SMTP';
    return { transporter: cachedTransporter, provider: currentProvider };
  }

  // 4. Default: Local Sandbox
  currentProvider = 'Local Sandbox';
  return { transporter: null, provider: 'Local Sandbox' };
}

/**
 * Central email dispatcher with graceful fallback to Sandbox if SMTP credentials are missing.
 */
export async function sendEmail(options: SendMailOptions): Promise<SendMailResult> {
  const { transporter, provider } = getTransporter();
  const recipient = Array.isArray(options.to) ? options.to.join(', ') : options.to;
  const defaultFrom =
    process.env.SMTP_FROM ||
    process.env.GMAIL_USER ||
    `"SELBAR Notifications" <notifications@selbar.in>`;

  // 1. If transporter is configured, attempt real email delivery via Nodemailer
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: options.from || defaultFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
        replyTo: options.replyTo,
        cc: options.cc,
        bcc: options.bcc,
      });

      // Log to internal notification center
      createNotification({
        recipient,
        title: `[${provider}] ${options.subject}`,
        message: `Dispatched successfully to ${recipient}. Message ID: ${info.messageId}`,
        type: 'SYSTEM_ANNOUNCEMENT',
        metadata: { messageId: info.messageId, provider },
      });

      return {
        success: true,
        provider,
        messageId: info.messageId,
        message: `Email delivered successfully via ${provider} to ${recipient}`,
      };
    } catch (err: any) {
      console.warn(`[Nodemailer] Delivery via ${provider} failed (${err.message}). Logging to Dev Sandbox.`);
    }
  }

  // 2. Dev Sandbox Fallback (Zero cost & zero crash during local testing)
  const plainText = options.text || options.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  
  console.log(`\n======================================================`);
  console.log(`📧 [SELBAR NODEMAILER EMAIL SANDBOX]`);
  console.log(`📤 Provider: ${provider}`);
  console.log(`👤 To: ${recipient}`);
  console.log(`📝 Subject: ${options.subject}`);
  console.log(`📄 Preview: ${plainText.slice(0, 160)}...`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log(`======================================================\n`);

  // Record in in-memory notification queue
  createNotification({
    recipient,
    title: `[Sandbox Email] ${options.subject}`,
    message: `Dispatched to ${recipient}. Subject: ${options.subject}`,
    type: 'SYSTEM_ANNOUNCEMENT',
    metadata: {
      provider: 'Local Sandbox',
      subject: options.subject,
      recipient,
      htmlPreview: options.html.substring(0, 200),
    },
  });

  return {
    success: true,
    provider: 'Local Sandbox',
    messageId: `sandbox_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    message: `[Sandbox] Email simulation recorded for ${recipient}. To send real emails, set SMTP_HOST/GMAIL_USER/SENDGRID_API_KEY in .env.local`,
  };
}

/**
 * Verify SMTP connection health
 */
export async function verifySmtpConnection(): Promise<{ connected: boolean; provider: string; message: string }> {
  const { transporter, provider } = getTransporter();
  if (!transporter) {
    return {
      connected: false,
      provider: 'Local Sandbox',
      message: 'No SMTP credentials configured. Operating in Sandbox logger mode.',
    };
  }

  try {
    await transporter.verify();
    return {
      connected: true,
      provider,
      message: `Successfully connected to ${provider} SMTP server. Ready to dispatch emails.`,
    };
  } catch (error: any) {
    return {
      connected: false,
      provider,
      message: `Failed to connect to ${provider} SMTP server: ${error.message}`,
    };
  }
}
