import connectToDatabase from './mongodb';
import User from './models/User';
import Session from './models/Session';
import Seller from './models/Seller';
import Role from './models/Role';
import Permission from './models/Permission';
import PasswordReset from './models/PasswordReset';
import LoginHistory from './models/LoginHistory';
import SecurityEvent from './models/SecurityEvent';
import OtpVerification from './models/OtpVerification';

let indexesInitialized = false;

/**
 * Initializes and synchronizes all mandatory MongoDB indexes:
 * - User: unique on email.normalized, mobile.normalized, username.normalized
 * - Session: TTL on expiresAt, index on userId, familyId
 * - OtpVerification: TTL on expiresAt, compound index (identifier, type)
 * - PasswordReset: TTL on expiresAt, unique tokenHash
 * - Seller: unique on userId and slug
 */
export async function ensureIndexes(): Promise<void> {
  if (indexesInitialized) return;

  try {
    const conn = await connectToDatabase();
    if (!conn) {
      console.warn('[IndexInit] MongoDB connection unavailable; skipping index synchronization.');
      return;
    }

    await Promise.all([
      User.syncIndexes(),
      Session.syncIndexes(),
      Seller.syncIndexes(),
      Role.syncIndexes(),
      Permission.syncIndexes(),
      PasswordReset.syncIndexes(),
      LoginHistory.syncIndexes(),
      SecurityEvent.syncIndexes(),
      OtpVerification.syncIndexes(),
    ]);

    indexesInitialized = true;
    console.log('✅ MongoDB unique constraints and TTL indexes synchronized successfully.');
  } catch (err: any) {
    console.error('❌ Error synchronizing MongoDB indexes:', err?.message);
  }
}

export default ensureIndexes;
