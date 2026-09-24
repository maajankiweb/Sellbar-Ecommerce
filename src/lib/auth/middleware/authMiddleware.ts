import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db/mongodb';
import User, { UserRole } from '@/lib/db/models/User';
import Seller from '@/lib/db/models/Seller';
import { verifyAccessToken, TokenPayload } from '@/lib/auth/jwt';
import { DEFAULT_ROLE_PERMISSIONS } from '@/lib/db/models/Role';

export interface AuthUserContext {
  userId: string;
  role: UserRole;
  roles: UserRole[];
  permissions: string[];
  phone: string;
  email?: string;
  username?: string;
  sellerId?: string;
}

export interface AuthGuardResult {
  success: boolean;
  user?: AuthUserContext;
  response?: NextResponse;
}

/**
 * Extract Bearer token from Authorization header or cookie
 */
export function extractTokenFromRequest(req: Request | NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // NextRequest cookies inspection
  if ('cookies' in req && typeof (req as any).cookies?.get === 'function') {
    const cookieVal = (req as NextRequest).cookies.get('selbar_access_token')?.value;
    if (cookieVal) return cookieVal;
  }

  // Standard Request Cookie header parsing fallback
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/selbar_access_token=([^;]+)/);
    if (match) return match[1];
  }

  return null;
}

/**
 * Authenticate incoming request and construct verified user context
 */
export async function authenticateRequest(req: Request | NextRequest): Promise<AuthGuardResult> {
  const token = extractTokenFromRequest(req);
  if (!token) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Authentication required. Missing Bearer token.',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      ),
    };
  }

  const payload: TokenPayload | null = verifyAccessToken(token);
  if (!payload || !payload.userId) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired access token.',
          code: 'TOKEN_EXPIRED',
        },
        { status: 401 }
      ),
    };
  }

  await connectToDatabase();

  const user = await User.findById(payload.userId)
    .select('_id fullName email mobile username roles status sellerId')
    .lean();

  if (!user || user.status !== 'active') {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'User account is inactive, suspended, or not found.',
          code: 'ACCOUNT_INACTIVE',
        },
        { status: 403 }
      ),
    };
  }

  // Collect effective permissions across all roles assigned to user
  const userRoles = (user.roles as UserRole[]) || ['customer'];
  const permissionSet = new Set<string>();

  for (const r of userRoles) {
    const perms = DEFAULT_ROLE_PERMISSIONS[r] || [];
    perms.forEach((p) => permissionSet.add(p));
  }

  // If seller profile exists, associate sellerId
  let resolvedSellerId = user.sellerId?.toString();
  if (!resolvedSellerId && userRoles.includes('seller')) {
    const seller = await Seller.findOne({ userId: user._id }).select('_id').lean();
    if (seller) resolvedSellerId = seller._id.toString();
  }

  const userContext: AuthUserContext = {
    userId: user._id.toString(),
    role: (userRoles[0] as UserRole) || 'customer',
    roles: userRoles,
    permissions: Array.from(permissionSet),
    phone: user.mobile?.number || (user as any).phone || '',
    email: user.email?.value || (user as any).email || undefined,
    username: user.username?.value || (user as any).username || undefined,
    sellerId: resolvedSellerId,
  };

  return {
    success: true,
    user: userContext,
  };
}

/**
 * Require at least one matching role
 */
export function checkRole(user: AuthUserContext, allowedRoles: UserRole[]): boolean {
  if (user.roles.includes('super_admin')) return true;
  return allowedRoles.some((r) => user.roles.includes(r));
}

/**
 * Require specific permission (or wildcard '*')
 */
export function checkPermission(user: AuthUserContext, requiredPermission: string): boolean {
  if (user.roles.includes('super_admin') || user.permissions.includes('*')) {
    return true;
  }
  return user.permissions.includes(requiredPermission);
}

/**
 * Strict Multi-Vendor Resource Ownership Guard (Prevents BOLA / IDOR)
 * Verifies that the authenticated seller owns the target resource.
 * Admin and super_admin bypass tenant boundaries.
 */
export function verifySellerResourceOwnership(
  user: AuthUserContext,
  targetSellerId: string | mongoose.Types.ObjectId
): { allowed: boolean; response?: NextResponse } {
  if (user.roles.includes('super_admin') || user.roles.includes('admin')) {
    return { allowed: true };
  }

  if (!user.sellerId) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Forbidden: You do not have an active seller profile.',
          code: 'SELLER_PROFILE_REQUIRED',
        },
        { status: 403 }
      ),
    };
  }

  const targetIdStr = targetSellerId.toString();
  if (user.sellerId !== targetIdStr) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Access Denied: You cannot inspect or modify another seller’s resources.',
          code: 'RESOURCE_OWNERSHIP_VIOLATION',
        },
        { status: 403 }
      ),
    };
  }

  return { allowed: true };
}

/**
 * Higher-Order Route Handler with complete auth, role, and permission validation
 */
export function withAuth(
  handler: (req: NextRequest, user: AuthUserContext) => Promise<NextResponse>,
  options?: {
    roles?: UserRole[];
    permission?: string;
  }
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const authResult = await authenticateRequest(req);
    if (!authResult.success || !authResult.user) {
      return authResult.response!;
    }

    const { user } = authResult;

    if (options?.roles && !checkRole(user, options.roles)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden: You do not have the required role to access this resource.',
          code: 'FORBIDDEN_ROLE',
        },
        { status: 403 }
      );
    }

    if (options?.permission && !checkPermission(user, options.permission)) {
      return NextResponse.json(
        {
          success: false,
          error: `Forbidden: Missing required permission '${options.permission}'.`,
          code: 'FORBIDDEN_PERMISSION',
        },
        { status: 403 }
      );
    }

    return handler(req, user);
  };
}
