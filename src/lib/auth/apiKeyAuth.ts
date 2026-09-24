import crypto from 'crypto';

export type ApiKeyScope =
  | '*'
  | 'admin:full'
  | 'read:stock'
  | 'write:stock'
  | 'send:notifications'
  | 'read:notifications'
  | 'read:catalog'
  | 'manage:catalog'
  | 'read:screener'
  | 'manage:orders'
  | 'read:orders';

export interface SelbarApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  environment: 'live' | 'test';
  scopes: ApiKeyScope[];
  createdAt: string;
  lastUsedAt?: string;
  usageCount: number;
  isActive: boolean;
}

// Seeded keys loaded strictly from secure environment variables (no hardcoded keys in source)
const DEFAULT_PRESET_KEYS: SelbarApiKey[] = process.env.MASTER_API_KEY
  ? [
      {
        id: 'key_master_env',
        name: 'SELBAR Primary Environment Key',
        key: process.env.MASTER_API_KEY,
        prefix: process.env.MASTER_API_KEY.substring(0, 18),
        environment: 'live',
        scopes: ['*'],
        createdAt: '2026-09-15T00:00:00Z',
        usageCount: 0,
        isActive: true,
      },
    ]
  : [];

declare global {
  // eslint-disable-next-line no-var
  var __SELBAR_API_KEYS__: SelbarApiKey[] | undefined;
}

if (!global.__SELBAR_API_KEYS__) {
  global.__SELBAR_API_KEYS__ = [...DEFAULT_PRESET_KEYS];
}

export function getAllApiKeys(): SelbarApiKey[] {
  return global.__SELBAR_API_KEYS__ || [];
}

/**
 * Generate a new custom API Key for SELBAR
 */
export function generateApiKey(params: {
  name: string;
  environment?: 'live' | 'test';
  scopes?: ApiKeyScope[];
}): SelbarApiKey {
  const env = params.environment || 'live';
  const randomEntropy = crypto.randomBytes(16).toString('hex');
  const fullKey = `selbar_${env}_sk_${randomEntropy}`;
  const prefix = fullKey.substring(0, 18);

  const newKey: SelbarApiKey = {
    id: `key_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: params.name,
    key: fullKey,
    prefix,
    environment: env,
    scopes: params.scopes && params.scopes.length > 0 ? params.scopes : ['*'],
    createdAt: new Date().toISOString(),
    usageCount: 0,
    isActive: true,
  };

  global.__SELBAR_API_KEYS__ = [newKey, ...(global.__SELBAR_API_KEYS__ || [])];
  return newKey;
}

/**
 * Revoke or Toggle an API Key
 */
export function revokeApiKey(id: string): boolean {
  const keys = global.__SELBAR_API_KEYS__ || [];
  const target = keys.find((k) => k.id === id || k.key === id);
  if (!target) return false;

  target.isActive = false;
  return true;
}

/**
 * Verify Request API Key
 * Checks 'x-selbar-api-key' or 'Authorization: Bearer <key>'
 */
export function verifyApiKey(
  req: Request,
  requiredScope?: ApiKeyScope
): { valid: boolean; status: number; message: string; apiKey?: SelbarApiKey } {
  // Extract key from header
  const headerKey =
    req.headers.get('x-selbar-api-key') ||
    req.headers.get('x-api-key') ||
    extractBearerToken(req.headers.get('authorization'));

  if (!headerKey) {
    return {
      valid: false,
      status: 401,
      message: 'Missing API Key. Provide key in "x-selbar-api-key" header or Authorization Bearer token.',
    };
  }

  const keys = global.__SELBAR_API_KEYS__ || [];
  const found = keys.find((k) => k.key === headerKey);

  if (!found) {
    return {
      valid: false,
      status: 401,
      message: 'Invalid API Key provided.',
    };
  }

  if (!found.isActive) {
    return {
      valid: false,
      status: 403,
      message: 'This API Key has been revoked or disabled.',
    };
  }

  // Scope Verification
  if (requiredScope && !found.scopes.includes('*') && !found.scopes.includes('admin:full')) {
    if (!found.scopes.includes(requiredScope)) {
      return {
        valid: false,
        status: 403,
        message: `Insufficient permissions. Key lacks required scope: "${requiredScope}".`,
      };
    }
  }

  // Update audit tracking
  found.lastUsedAt = new Date().toISOString();
  found.usageCount += 1;

  return {
    valid: true,
    status: 200,
    message: 'Authorized',
    apiKey: found,
  };
}

function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  return null;
}
