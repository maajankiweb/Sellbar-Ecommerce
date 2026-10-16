import crypto from 'crypto';
import connectToDatabase from '@/lib/db/mongodb';
import { ApiKey, IApiKey, ApiKeyScope } from '@/lib/db/models/ApiKey';

export type { ApiKeyScope };

export interface CreatedApiKeyResult {
  id: string;
  name: string;
  prefix: string;
  rawKey: string; // Shown once at creation
  environment: 'live' | 'test';
  scopes: ApiKeyScope[];
  createdAt: Date;
}

export function hashApiKey(rawKey: string): string {
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}

/**
 * Generate a new custom scoped API Key for Sellbar
 * The full raw key is returned ONLY once. The database stores strictly its SHA-256 hash.
 */
export async function generateApiKey(params: {
  name: string;
  environment?: 'live' | 'test';
  scopes?: ApiKeyScope[];
  createdBy?: string;
}): Promise<CreatedApiKeyResult> {
  const env = params.environment || 'live';
  const randomEntropy = crypto.randomBytes(24).toString('hex');
  const rawKey = `sellbar_${env}_sk_${randomEntropy}`;
  const prefix = rawKey.substring(0, 19);
  const keyHash = hashApiKey(rawKey);

  await connectToDatabase();

  const doc = await ApiKey.create({
    name: params.name,
    prefix,
    keyHash,
    environment: env,
    scopes: params.scopes || ['read:catalog'],
    createdBy: params.createdBy || undefined,
  });

  return {
    id: doc._id.toString(),
    name: doc.name,
    prefix: doc.prefix,
    rawKey,
    environment: doc.environment,
    scopes: doc.scopes,
    createdAt: doc.createdAt,
  };
}

/**
 * List all active API keys (metadata only, raw key is never stored or returned)
 */
export async function listAllApiKeys(): Promise<Array<{
  id: string;
  name: string;
  prefix: string;
  environment: string;
  scopes: ApiKeyScope[];
  usageCount: number;
  lastUsedAt?: Date;
  revokedAt?: Date;
  createdAt: Date;
}>> {
  await connectToDatabase();
  const keys = await ApiKey.find().sort({ createdAt: -1 }).lean();
  return keys.map((k) => ({
    id: k._id.toString(),
    name: k.name,
    prefix: k.prefix,
    environment: k.environment,
    scopes: k.scopes as ApiKeyScope[],
    usageCount: k.usageCount || 0,
    lastUsedAt: k.lastUsedAt,
    revokedAt: k.revokedAt,
    createdAt: k.createdAt,
  }));
}

/**
 * Verify incoming API Key against stored SHA-256 hash
 */
export async function verifyApiKey(
  rawKey: string,
  requiredScope?: ApiKeyScope
): Promise<{ valid: boolean; name?: string; scopes?: ApiKeyScope[]; error?: string }> {
  if (!rawKey || !rawKey.startsWith('sellbar_')) {
    return { valid: false, error: 'Invalid API key format' };
  }

  const keyHash = hashApiKey(rawKey);

  try {
    await connectToDatabase();
    const doc = await ApiKey.findOne({ keyHash });

    if (!doc) {
      return { valid: false, error: 'API key not recognized' };
    }

    if (doc.revokedAt) {
      return { valid: false, error: 'API key has been revoked' };
    }

    if (requiredScope && !doc.scopes.includes('*') && !doc.scopes.includes('admin:full') && !doc.scopes.includes(requiredScope)) {
      return { valid: false, error: `Key lacks required scope: ${requiredScope}` };
    }

    // Increment usage
    doc.usageCount = (doc.usageCount || 0) + 1;
    doc.lastUsedAt = new Date();
    await doc.save();

    return { valid: true, name: doc.name, scopes: doc.scopes };
  } catch (err) {
    return { valid: false, error: 'API key verification error' };
  }
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(id: string): Promise<boolean> {
  await connectToDatabase();
  const res = await ApiKey.findByIdAndUpdate(id, { $set: { revokedAt: new Date() } });
  return Boolean(res);
}
