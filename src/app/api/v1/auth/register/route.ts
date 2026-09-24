import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import Session from '@/lib/db/models/Session';
import LoginHistory from '@/lib/db/models/LoginHistory';
import {
  signAccessToken,
  signRefreshToken,
  hashToken,
  extractDeviceInfo,
  TokenPayload,
} from '@/lib/auth/jwt';
import { limitAuthAttempts } from '@/lib/auth/security/rateLimiterRedis';
import { hashPassword } from '@/lib/auth/security/passwordHasher';
import {
  RegisterInputSchema,
  normalizeMobileNumber,
  normalizeEmail,
  normalizeUsername,
} from '@/lib/validators/authValidators';
import { logAuthEvent } from '@/lib/auth/auditLogger';

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 1. IP Rate Limiting Check
    const rateCheck = await limitAuthAttempts(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many registration attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const rawBody = await req.json().catch(() => ({}));

    // Support legacy field mapping if client sends 'name' instead of 'fullName' or 'phone' instead of 'mobile'
    const payload = {
      fullName: rawBody.fullName || rawBody.name,
      mobile: rawBody.mobile || rawBody.phone,
      email: rawBody.email,
      username: rawBody.username,
      password: rawBody.password,
      confirmPassword: rawBody.confirmPassword,
      acceptedTerms: rawBody.acceptedTerms,
      termsVersion: rawBody.termsVersion || 'v1.0',
      privacyVersion: rawBody.privacyVersion || 'v1.0',
      captchaToken: rawBody.captchaToken,
    };

    // 2. Strict Zod Schema Validation
    const parseResult = RegisterInputSchema.safeParse(payload);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: firstIssue.message,
          field: firstIssue.path.join('.'),
        },
        { status: 400 }
      );
    }

    const validData = parseResult.data;
    const mobileData = normalizeMobileNumber(validData.mobile);
    const cleanEmail = normalizeEmail(validData.email);
    const cleanUsername = normalizeUsername(validData.username);

    await connectToDatabase();

    // 3. Uniqueness Check (Mobile, Email, Username)
    const mobileQuery: Record<string, any> = {
      $or: [
        { 'mobile.normalized': mobileData.normalized },
        { 'mobile.number': mobileData.number },
        { phone: mobileData.number },
      ],
    };
    const existingMobile = await User.findOne(mobileQuery).select('_id').lean();

    if (existingMobile) {
      return NextResponse.json(
        { success: false, error: 'An account with this mobile number already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const emailQuery: Record<string, any> = {
      $or: [{ 'email.normalized': cleanEmail }, { email: cleanEmail }],
    };
    const existingEmail = await User.findOne(emailQuery).select('_id').lean();

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const usernameQuery: Record<string, any> = {
      $or: [{ 'username.normalized': cleanUsername }, { username: cleanUsername }],
    };
    const existingUsername = await User.findOne(usernameQuery).select('_id').lean();

    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: 'This username is already taken. Please choose another.' },
        { status: 409 }
      );
    }

    // 4. Secure Password Hashing with Argon2id
    const hashedPassword = await hashPassword(validData.password);

    // 5. Create Upgraded User Document
    const newUser = await User.create({
      fullName: validData.fullName,
      mobile: {
        countryCode: mobileData.countryCode,
        number: mobileData.number,
        normalized: mobileData.normalized,
        verified: true, // Registration step marks mobile verified
        verifiedAt: new Date(),
      },
      email: {
        value: cleanEmail,
        normalized: cleanEmail,
        verified: false,
      },
      username: {
        value: cleanUsername,
        normalized: cleanUsername,
      },
      passwordHash: hashedPassword,
      roles: ['customer'],
      status: 'active',
      security: {
        failedLoginAttempts: 0,
        twoFactorEnabled: false,
      },
      profile: {
        completionPercentage: 40, // Base profile with mobile + name + email + username
      },
      consent: {
        termsVersion: validData.termsVersion,
        privacyVersion: validData.privacyVersion,
        acceptedAt: new Date(),
        ipAddress: ip,
        userAgent: req.headers.get('user-agent') || 'Unknown',
      },
      addresses: [],
    });

    // 6. Generate Tokens & Session
    const tokenPayload: TokenPayload = {
      userId: newUser._id.toString(),
      role: newUser.role,
      phone: newUser.phone,
      email: cleanEmail,
      username: cleanUsername,
    };

    const accessToken = signAccessToken(tokenPayload);
    const { token: refreshToken, expiresInSeconds, expiresAt } = signRefreshToken(tokenPayload, true);

    const device = extractDeviceInfo(req);
    const familyId = crypto.randomUUID();

    await Session.create({
      userId: newUser._id,
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

    await LoginHistory.create({
      userId: newUser._id,
      identifierAttempted: cleanEmail,
      status: 'SUCCESS',
      ipAddress: device.ipAddress,
      userAgent: device.userAgent,
      device: device.deviceType,
      browser: device.browser,
      operatingSystem: device.os,
      isSuspicious: false,
    }).catch(() => {});

    await logAuthEvent({
      userId: newUser._id,
      identifier: newUser.phone,
      event: 'USER_REGISTERED',
      status: 'SUCCESS',
      req,
      metadata: { username: cleanUsername, email: cleanEmail },
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account registered successfully!',
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          phone: newUser.phone,
          email: cleanEmail,
          username: cleanUsername,
          role: newUser.role,
          roles: newUser.roles,
          phoneVerified: newUser.phoneVerified,
          emailVerified: newUser.emailVerified,
          profileCompleted: newUser.profileCompleted,
          createdAt: newUser.createdAt,
        },
        accessToken,
      },
      { status: 201 }
    );

    // Set secure HttpOnly cookie for Refresh Token
    response.cookies.set('selbar_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth',
      maxAge: expiresInSeconds,
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}
