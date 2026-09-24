import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import Session from '@/lib/db/models/Session';
import LoginHistory from '@/lib/db/models/LoginHistory';
import {
  detectCredentialType,
  signAccessToken,
  signRefreshToken,
  hashToken,
  extractDeviceInfo,
  TokenPayload,
} from '@/lib/auth/jwt';
import { limitAuthAttempts, limitAccountLogin } from '@/lib/auth/security/rateLimiterRedis';
import { hashPassword } from '@/lib/auth/security/passwordHasher';
import { logAuthEvent } from '@/lib/auth/auditLogger';

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 1. IP Rate Limiting Check (Anti Brute-Force)
    const rateCheck = await limitAuthAttempts(ip);
    if (!rateCheck.allowed) {
      await logAuthEvent({
        identifier: 'rate_limited_ip',
        event: 'SUSPICIOUS_LOGIN_ATTEMPT',
        status: 'WARNING',
        req,
        metadata: { reason: 'Rate limit exceeded', retryAfter: rateCheck.retryAfterSeconds },
      });

      return NextResponse.json(
        {
          success: false,
          error: `Too many attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { credential, password, rememberMe = true } = body;

    if (!credential || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide your mobile number, email, or username, and password.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 2. Smart Credential Detection & Normalized Lookup
    const credType = detectCredentialType(credential);
    let query: Record<string, any> = {};

    if (credType === 'email') {
      const cleanEmail = credential.trim().toLowerCase();
      query = {
        $or: [{ 'email.normalized': cleanEmail }, { email: cleanEmail }],
      };
    } else if (credType === 'phone') {
      const cleanPhone = credential.toString().replace(/\D/g, '');
      const standardPhone = cleanPhone.length === 12 && cleanPhone.startsWith('91')
        ? cleanPhone.slice(2)
        : cleanPhone;
      query = {
        $or: [
          { 'mobile.normalized': `+91${standardPhone}` },
          { 'mobile.number': standardPhone },
          { phone: standardPhone },
        ],
      };
    } else {
      const cleanUname = credential.trim().toLowerCase();
      query = {
        $or: [{ 'username.normalized': cleanUname }, { username: cleanUname }],
      };
    }

    // 3. Fetch User with security & password hash
    const user = await User.findOne(query).select(
      '+passwordHash +password +security.lockedUntil +security.failedLoginAttempts'
    );

    const device = extractDeviceInfo(req);

    if (!user) {
      await logAuthEvent({
        identifier: credential,
        event: 'LOGIN_FAILED',
        status: 'FAILURE',
        req,
        metadata: { reason: 'User not found', credType },
      });

      // Record failed attempt in LoginHistory
      await LoginHistory.create({
        identifierAttempted: credential.trim().toLowerCase(),
        status: 'FAILED',
        failureReason: 'Invalid credentials',
        ipAddress: device.ipAddress,
        userAgent: device.userAgent,
        device: device.deviceType,
        browser: device.browser,
        operatingSystem: device.os,
        isSuspicious: false,
      }).catch(() => {});

      return NextResponse.json(
        { success: false, error: 'Invalid credentials. Please verify your details.' },
        { status: 401 }
      );
    }

    // 4. Account Lockout Check
    if (user.isLocked()) {
      const lockedUntilDate = user.security?.lockedUntil || user.lockUntil;
      const remainingMs = lockedUntilDate ? lockedUntilDate.getTime() - Date.now() : 0;
      const remainingMinutes = Math.max(1, Math.ceil(remainingMs / (60 * 1000)));

      await logAuthEvent({
        userId: user._id,
        identifier: credential,
        event: 'ACCOUNT_LOCKED',
        status: 'WARNING',
        req,
        metadata: { remainingMinutes },
      });

      return NextResponse.json(
        {
          success: false,
          error: `Account is temporarily locked due to excessive failed attempts. Please try again in ${remainingMinutes} minute(s).`,
          locked: true,
          remainingMinutes,
        },
        { status: 423 } // 423 Locked
      );
    }

    // 5. Verify Password (Argon2id primary with legacy bcrypt fallback)
    const passwordResult = await user.comparePassword(password);

    if (!passwordResult.valid) {
      const currentAttempts = (user.security?.failedLoginAttempts || user.failedLoginAttempts || 0) + 1;
      user.failedLoginAttempts = currentAttempts;

      if (currentAttempts >= 5) {
        // Lock for 30 minutes
        const lockUntil = new Date(Date.now() + 30 * 60 * 1000);
        user.lockUntil = lockUntil;
        await user.save();

        await logAuthEvent({
          userId: user._id,
          identifier: credential,
          event: 'ACCOUNT_LOCKED',
          status: 'WARNING',
          req,
          metadata: { reason: '5 consecutive failed attempts', lockedUntil: lockUntil },
        });

        await LoginHistory.create({
          userId: user._id,
          identifierAttempted: credential.trim().toLowerCase(),
          status: 'LOCKED',
          failureReason: '5 failed attempts lockout',
          ipAddress: device.ipAddress,
          userAgent: device.userAgent,
          device: device.deviceType,
          browser: device.browser,
          operatingSystem: device.os,
          isSuspicious: true,
        }).catch(() => {});

        return NextResponse.json(
          {
            success: false,
            error: 'Account locked for 30 minutes due to 5 consecutive failed login attempts.',
            locked: true,
            remainingMinutes: 30,
          },
          { status: 423 }
        );
      }

      await user.save();
      const remainingAttempts = 5 - currentAttempts;

      await logAuthEvent({
        userId: user._id,
        identifier: credential,
        event: 'LOGIN_FAILED',
        status: 'FAILURE',
        req,
        metadata: { failedAttempts: currentAttempts, remainingAttempts },
      });

      return NextResponse.json(
        {
          success: false,
          error: `Invalid credentials. ${remainingAttempts} attempt(s) remaining before temporary lockout.`,
          remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 6. Transparent Password Upgrade to Argon2id if verified using legacy bcrypt
    if (passwordResult.needsRehash) {
      try {
        const upgradedHash = await hashPassword(password);
        user.passwordHash = upgradedHash;
      } catch {
        // Non-blocking
      }
    }

    // 7. Reset Failed Attempts on Success
    if ((user.security?.failedLoginAttempts || 0) > 0 || user.security?.lockedUntil) {
      user.failedLoginAttempts = 0;
      user.lockUntil = undefined;
    }
    user.lastLoginAt = new Date();
    await user.save();

    // 8. Check 2FA requirement (if enabled)
    if (user.security?.twoFactorEnabled) {
      return NextResponse.json({
        success: true,
        requires2FA: true,
        twoFactorMethod: user.security.twoFactorMethod || 'totp',
        userId: user._id.toString(),
        message: 'Two-factor authentication required.',
      });
    }

    // 9. Issue JWT Tokens & Session
    const emailVal = user.email?.value || (typeof user.email === 'string' ? user.email : undefined);
    const usernameVal = user.username?.value || (typeof user.username === 'string' ? user.username : undefined);

    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      role: user.role,
      phone: user.phone,
      email: emailVal,
      username: usernameVal,
      sellerId: user.sellerId ? user.sellerId.toString() : undefined,
    };

    const accessToken = signAccessToken(tokenPayload);
    const { token: refreshToken, expiresInSeconds, expiresAt } = signRefreshToken(
      tokenPayload,
      Boolean(rememberMe)
    );

    const familyId = crypto.randomUUID();

    await Session.create({
      userId: user._id,
      tokenHash: hashToken(refreshToken),
      refreshTokenHash: hashToken(refreshToken),
      familyId,
      device: device.deviceType,
      browser: device.browser,
      operatingSystem: device.os,
      deviceInfo: {
        userAgent: device.userAgent,
        os: device.os,
        browser: device.browser,
        deviceType: device.deviceType,
      },
      ipAddress: device.ipAddress,
      isRevoked: false,
      expiresAt,
      lastUsedAt: new Date(),
      lastActiveAt: new Date(),
    });

    // 10. Audit & History Record
    await LoginHistory.create({
      userId: user._id,
      identifierAttempted: credential.trim().toLowerCase(),
      status: 'SUCCESS',
      ipAddress: device.ipAddress,
      userAgent: device.userAgent,
      device: device.deviceType,
      browser: device.browser,
      operatingSystem: device.os,
      isSuspicious: false,
    }).catch(() => {});

    await logAuthEvent({
      userId: user._id,
      identifier: credential,
      event: 'LOGIN_SUCCESS',
      status: 'SUCCESS',
      req,
      metadata: { rememberMe, device: device.deviceType },
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful!',
        user: {
          id: user._id.toString(),
          name: user.name,
          phone: user.phone,
          email: emailVal,
          username: usernameVal,
          role: user.role,
          roles: user.roles,
          phoneVerified: user.phoneVerified,
          emailVerified: user.emailVerified,
          profileCompleted: user.profileCompleted,
          sellerId: user.sellerId ? user.sellerId.toString() : undefined,
          addresses: user.addresses || [],
        },
        accessToken,
      },
      { status: 200 }
    );

    response.cookies.set('selbar_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth',
      maxAge: expiresInSeconds,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during login.' },
      { status: 500 }
    );
  }
}
