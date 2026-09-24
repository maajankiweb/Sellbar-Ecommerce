/**
 * SELBAR Authentication & Security Verification Suite
 * Executes automated unit and integration tests across the security utilities.
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { hashPassword, verifyPassword } from '../lib/auth/security/passwordHasher';
import { generateSecureOtp, hashOtp, createAndStoreOtp, verifyStoredOtp } from '../lib/auth/security/otpSecurity';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, hashToken } from '../lib/auth/jwt';
import {
  RegisterInputSchema,
  LoginInputSchema,
  OtpRequestSchema,
  OtpVerifySchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
  normalizeMobileNumber,
  normalizeEmail,
  normalizeUsername
} from '../lib/validators/authValidators';

async function runTestSuite() {
  console.log('====================================================');
  console.log('  SELBAR AUTHENTICATION & SECURITY TEST SUITE       ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // -----------------------------------------------------------------
  // 1. PASSWORD HASHER & REHASH UPGRADE
  // -----------------------------------------------------------------
  console.log('[1/4] Testing Password Hashing & Verification (Argon2id + Bcrypt Migration)...');
  try {
    const rawPassword = 'SuperSecureP@ssw0rd!2026';

    // Argon2id hash & verify
    const argonHash = await hashPassword(rawPassword);
    assert(argonHash.startsWith('$argon2id$'), 'Hash uses Argon2id algorithm');
    
    const validArgon = await verifyPassword(rawPassword, argonHash);
    assert(validArgon.valid === true, 'Argon2id correct password verifies successfully');
    assert(validArgon.needsRehash === false, 'Fresh Argon2id does not require rehash');

    const wrongArgon = await verifyPassword('WrongPassword123!', argonHash);
    assert(wrongArgon.valid === false, 'Argon2id wrong password fails verification');

    // Legacy Bcrypt hash & verify (silent upgrade path)
    const salt = await bcrypt.genSalt(10);
    const legacyBcryptHash = await bcrypt.hash(rawPassword, salt);
    assert(legacyBcryptHash.startsWith('$2a$') || legacyBcryptHash.startsWith('$2b$'), 'Legacy hash uses bcrypt format');

    const legacyVerify = await verifyPassword(rawPassword, legacyBcryptHash);
    assert(legacyVerify.valid === true, 'Legacy bcrypt hash verifies successfully');
    assert(legacyVerify.needsRehash === true, 'Legacy bcrypt hash correctly flags needsRehash=true for silent Argon2id upgrade');
  } catch (err) {
    console.error('Password Hasher Test Error:', err);
    failed++;
  }

  // -----------------------------------------------------------------
  // 2. OTP CRYPTOGRAPHIC SECURITY & TIMING SAFETY
  // -----------------------------------------------------------------
  console.log('\n[2/4] Testing Cryptographic OTP Generation & Verification Lifecycle...');
  try {
    const otp = generateSecureOtp();
    assert(/^\d{6}$/.test(otp), 'OTP is exactly 6 numerical digits');
    assert(parseInt(otp, 10) >= 100000 && parseInt(otp, 10) <= 999999, 'OTP is in valid 100000-999999 range');

    const hash1 = hashOtp(otp);
    const hash2 = hashOtp(otp);
    assert(hash1 === hash2, 'Deterministic HMAC-SHA256 hash across identical OTP strings');
    assert(hash1.length === 64, 'OTP hash is 256-bit hex (SHA-256 HMAC)');

    // Test timingSafeEqual directly
    const timingMatch = crypto.timingSafeEqual(Buffer.from(hash1, 'hex'), Buffer.from(hash2, 'hex'));
    assert(timingMatch === true, 'Timing-safe comparison confirms identical HMAC hashes');

    const testIdentifier = 'test_user_' + Date.now() + '@selbar.com';
    const createResult = await createAndStoreOtp({
      identifier: testIdentifier,
      type: 'login_2fa'
    });
    assert(createResult.success === true, 'createAndStoreOtp creates record');
    assert(!!createResult.otp && createResult.otp.length === 6, 'Generated OTP returned to dispatcher');

    // Verify invalid OTP
    const failVerify = await verifyStoredOtp({
      identifier: testIdentifier,
      type: 'login_2fa',
      candidateCode: '000000'
    });
    assert(failVerify.valid === false, 'verifyStoredOtp correctly rejects wrong code');

    // Verify valid OTP
    const passVerify = await verifyStoredOtp({
      identifier: testIdentifier,
      type: 'login_2fa',
      candidateCode: createResult.otp!
    });
    assert(passVerify.valid === true, 'verifyStoredOtp successfully validates correct code');
  } catch (err) {
    console.error('OTP Security Test Error:', err);
    failed++;
  }

  // -----------------------------------------------------------------
  // 3. JWT ACCESS & REFRESH TOKENS
  // -----------------------------------------------------------------
  console.log('\n[3/4] Testing JWT Token Generation, Payload, & Verification...');
  try {
    const payload = {
      userId: '65f1a2b3c4d5e6f7a8b9c0d1',
      phone: '+919876543210',
      email: 'verified_user@selbar.com',
      role: 'seller' as const,
      sellerId: '65f1a2b3c4d5e6f7a8b9c0d2',
    };

    const accessToken = signAccessToken(payload);
    assert(typeof accessToken === 'string' && accessToken.split('.').length === 3, 'Access token is a valid JWT');

    const decoded = verifyAccessToken(accessToken);
    assert(decoded !== null, 'Access token decodes successfully');
    assert(decoded?.userId === payload.userId, 'Token payload contains correct userId');
    assert(decoded?.sellerId === payload.sellerId, 'Token payload contains tenant sellerId');
    assert(decoded?.role === 'seller', 'Token payload contains correct primary role');

    const refreshTokenResult = signRefreshToken(payload, false);
    assert(typeof refreshTokenResult.token === 'string' && refreshTokenResult.token.split('.').length === 3, 'Refresh token is a valid JWT');
    
    const tokenHash = hashToken(refreshTokenResult.token);
    assert(tokenHash.length === 64, 'Refresh token SHA-256 hash is generated for database storage');

    const verifiedRefresh = verifyRefreshToken(refreshTokenResult.token);
    assert(verifiedRefresh?.userId === payload.userId, 'Refresh token decodes correctly');
  } catch (err) {
    console.error('JWT Test Error:', err);
    failed++;
  }

  // -----------------------------------------------------------------
  // 4. ZOD VALIDATION & NORMALIZATION SCHEMAS
  // -----------------------------------------------------------------
  console.log('\n[4/4] Testing Zod Security Validation & Normalization Schemas...');
  try {
    // Normalizers
    const phoneNorm = normalizeMobileNumber('9876543210');
    assert(phoneNorm.isValid && phoneNorm.normalized === '+919876543210', 'normalizeMobileNumber formats 10-digit number correctly');

    const emailNorm = normalizeEmail('  Test.User@SELBAR.COM  ');
    assert(emailNorm === 'test.user@selbar.com', 'normalizeEmail cleans whitespace and lowercases');

    const userNorm = normalizeUsername('  SuperSeller_2026 ');
    assert(userNorm === 'superseller_2026', 'normalizeUsername normalizes casing');

    // Valid registration
    const validReg = RegisterInputSchema.safeParse({
      fullName: 'John Doe',
      username: 'johndoe_2026',
      email: 'john.doe@example.com',
      mobile: '9876543210',
      password: 'StrongPassword!2026',
      confirmPassword: 'StrongPassword!2026',
      acceptedTerms: true
    });
    assert(validReg.success === true, 'Valid registration payload passes Zod validation');

    // Invalid registration: weak password
    const weakReg = RegisterInputSchema.safeParse({
      fullName: 'John Doe',
      username: 'johndoe_2026',
      email: 'john@example.com',
      mobile: '9876543210',
      password: 'weak',
      confirmPassword: 'weak',
      acceptedTerms: true
    });
    assert(weakReg.success === false, 'Weak password fails Zod validation');

    // Invalid registration: invalid username characters
    const badUserReg = RegisterInputSchema.safeParse({
      fullName: 'John Doe',
      username: 'john<script>',
      email: 'john@example.com',
      mobile: '9876543210',
      password: 'StrongPassword!2026',
      confirmPassword: 'StrongPassword!2026',
      acceptedTerms: true
    });
    assert(badUserReg.success === false, 'Malicious XSS username fails Zod validation');

    // Valid login
    const validLogin = LoginInputSchema.safeParse({
      identifier: 'john.doe@example.com',
      password: 'AnyPassword123!',
      rememberMe: true
    });
    assert(validLogin.success === true, 'Valid login payload passes Zod validation');

    // Invalid login: empty password
    const emptyPassLogin = LoginInputSchema.safeParse({
      identifier: 'john.doe@example.com',
      password: ''
    });
    assert(emptyPassLogin.success === false, 'Empty password fails login Zod validation');

    // Password change validation
    const validChange = ChangePasswordSchema.safeParse({
      currentPassword: 'CurrentPassword!123',
      newPassword: 'BrandNewSecurePassword!2026',
      confirmPassword: 'BrandNewSecurePassword!2026'
    });
    assert(validChange.success === true, 'Matching new passwords pass ChangePasswordSchema');

    const mismatchChange = ChangePasswordSchema.safeParse({
      currentPassword: 'CurrentPassword!123',
      newPassword: 'BrandNewSecurePassword!2026',
      confirmPassword: 'DifferentPassword!2026'
    });
    assert(mismatchChange.success === false, 'Mismatched new passwords fail ChangePasswordSchema');
  } catch (err) {
    console.error('Zod Validation Test Error:', err);
    failed++;
  }

  // -----------------------------------------------------------------
  // SUMMARY
  // -----------------------------------------------------------------
  console.log('\n====================================================');
  console.log(`  FINAL VERIFICATION: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite();
