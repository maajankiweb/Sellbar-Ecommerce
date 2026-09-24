import connectToDatabase from '../db/mongodb';
import AuthAuditLog, { type AuthAuditEventType } from '../db/models/AuthAuditLog';

interface LogEventParams {
  userId?: any;
  identifier: string;
  event: AuthAuditEventType;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  req?: Request;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

declare global {
  // eslint-disable-next-line no-var
  var __SELBAR_AUDIT_FALLBACK_LOGS__: any[] | undefined;
}

if (!global.__SELBAR_AUDIT_FALLBACK_LOGS__) {
  global.__SELBAR_AUDIT_FALLBACK_LOGS__ = [];
}

/**
 * Log an authentication event to MongoDB Atlas (with safe in-memory fallback)
 */
export async function logAuthEvent(params: LogEventParams): Promise<void> {
  let ip = params.ipAddress || '127.0.0.1';
  let ua = params.userAgent || 'Unknown';

  if (params.req) {
    const forwarded = params.req.headers.get('x-forwarded-for');
    ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    ua = params.req.headers.get('user-agent') || 'Unknown';
  }

  const logEntry = {
    userId: params.userId,
    identifierAttempted: params.identifier.trim().toLowerCase(),
    event: params.event,
    status: params.status,
    ipAddress: ip,
    userAgent: ua,
    metadata: params.metadata || {},
    createdAt: new Date(),
  };

  // Always keep in fast local memory ring buffer (last 500 entries)
  global.__SELBAR_AUDIT_FALLBACK_LOGS__!.unshift(logEntry);
  if (global.__SELBAR_AUDIT_FALLBACK_LOGS__!.length > 500) {
    global.__SELBAR_AUDIT_FALLBACK_LOGS__!.pop();
  }

  // Persist to MongoDB Atlas asynchronously
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await AuthAuditLog.create(logEntry);
    }
  } catch (err) {
    console.warn(`[AuditLog Fallback] Recorded in-memory: ${params.event} for ${params.identifier}`);
  }
}

/**
 * Retrieve recent audit logs (for admin review)
 */
export async function getRecentAuditLogs(limit = 50) {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      return await AuthAuditLog.find().sort({ createdAt: -1 }).limit(limit).lean();
    }
  } catch {
    // fallback to memory
  }
  return (global.__SELBAR_AUDIT_FALLBACK_LOGS__ || []).slice(0, limit);
}
