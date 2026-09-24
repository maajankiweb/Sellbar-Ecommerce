import { NextRequest, NextResponse } from 'next/server';
import { getAllApiKeys, generateApiKey, revokeApiKey, verifyApiKey } from '@/lib/auth/apiKeyAuth';
import { withAuth, AuthUserContext } from '@/lib/auth/middleware/authMiddleware';

// GET /api/v1/admin/api-keys (List all Custom API Keys) - strictly Admin/Super Admin only
export const GET = withAuth(
  async (req: NextRequest, user: AuthUserContext) => {
    try {
      const { searchParams } = new URL(req.url);
      const showFullKey = searchParams.get('reveal') === 'true';

      const allKeys = getAllApiKeys().map((k) => ({
        ...k,
        key: showFullKey ? k.key : `${k.key.substring(0, 14)}...${k.key.substring(k.key.length - 4)}`,
      }));

      return NextResponse.json({
        success: true,
        count: allKeys.length,
        keys: allKeys,
        requestedBy: user.userId,
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Failed to retrieve API keys', error: String(error) },
        { status: 500 }
      );
    }
  },
  { roles: ['admin', 'super_admin'], permission: 'security:audit_view' }
);

// POST /api/v1/admin/api-keys (Generate a new Custom API Key) - strictly Admin/Super Admin only
export const POST = withAuth(
  async (req: NextRequest, user: AuthUserContext) => {
    try {
      const body = await req.json().catch(() => ({}));

      if (!body.name) {
        return NextResponse.json(
          { success: false, message: 'Missing "name" for the API key.' },
          { status: 400 }
        );
      }

      const createdKey = generateApiKey({
        name: body.name,
        environment: body.environment === 'test' ? 'test' : 'live',
        scopes: Array.isArray(body.scopes) ? body.scopes : ['*'],
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Custom API Key generated successfully. Save this key safely.',
          apiKey: createdKey,
          generatedBy: user.userId,
        },
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Failed to generate API key', error: String(error) },
        { status: 500 }
      );
    }
  },
  { roles: ['admin', 'super_admin'] }
);

// DELETE /api/v1/admin/api-keys (Revoke an API Key) - strictly Admin/Super Admin only
export const DELETE = withAuth(
  async (req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const keyId = searchParams.get('id');

      if (!keyId) {
        return NextResponse.json(
          { success: false, message: 'Missing "id" parameter of the key to revoke.' },
          { status: 400 }
        );
      }

      const revoked = revokeApiKey(keyId);
      if (!revoked) {
        return NextResponse.json(
          { success: false, message: 'API key not found or already revoked.' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `API Key ${keyId} revoked successfully.`,
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Failed to revoke API key', error: String(error) },
        { status: 500 }
      );
    }
  },
  { roles: ['admin', 'super_admin'] }
);
