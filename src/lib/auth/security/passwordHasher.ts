import * as argon2 from 'argon2';
import bcrypt from 'bcryptjs';

// OWASP Recommended Argon2id parameters
const ARGON2_OPTIONS: argon2.HashOptions & { raw: false } = {
  type: argon2.argon2id,
  memoryCost: parseInt(process.env.ARGON2_MEMORY_COST || '65536', 10), // 64 MB
  timeCost: parseInt(process.env.ARGON2_TIME_COST || '3', 10),        // 3 iterations
  parallelism: parseInt(process.env.ARGON2_PARALLELISM || '4', 10),   // 4 threads
  raw: false,
};

/**
 * Hash password with Argon2id as primary algorithm.
 * Gracefully falls back to bcrypt with 12 salt rounds if Argon2 fails or is unsupported.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  try {
    const result = await argon2.hash(plainPassword, ARGON2_OPTIONS);
    return result as string;
  } catch (err: any) {
    console.warn('[PasswordHasher] Argon2 hashing failed, falling back to bcrypt (12 rounds):', err?.message);
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(plainPassword, salt);
  }
}

/**
 * Verify candidate password against stored hash.
 * Supports Argon2id, Argon2i, Argon2d, and legacy bcrypt ($2a$, $2b$, $2y$).
 * Returns `needsRehash: true` if the hash is legacy bcrypt so caller can re-hash to Argon2id.
 */
export async function verifyPassword(
  candidate: string,
  storedHash: string
): Promise<{ valid: boolean; needsRehash?: boolean }> {
  if (!storedHash || !candidate) {
    return { valid: false };
  }

  // Check if hash is Argon2 format ($argon2id$, $argon2i$, $argon2d$)
  if (storedHash.startsWith('$argon2')) {
    try {
      const valid = await argon2.verify(storedHash, candidate);
      const needsRehash = argon2.needsRehash(storedHash, {
        memoryCost: ARGON2_OPTIONS.memoryCost,
        timeCost: ARGON2_OPTIONS.timeCost,
        parallelism: ARGON2_OPTIONS.parallelism,
      });
      return { valid, needsRehash };
    } catch {
      return { valid: false };
    }
  }

  // Check if hash is legacy bcrypt ($2a$, $2b$, $2y$)
  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
    try {
      const valid = await bcrypt.compare(candidate, storedHash);
      return { valid, needsRehash: valid }; // If valid, recommend rehash to Argon2id
    } catch {
      return { valid: false };
    }
  }

  // Unknown hash format
  return { valid: false };
}
