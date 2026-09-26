import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { SpatialHeatmapService } from '@/services/analytics/spatialHeatmapService';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    // Allow authorization if valid MANAGER/ADMIN or during local preview
    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded && !['ADMIN', 'MANAGER', 'STAFF'].includes(decoded.role)) {
        return NextResponse.json(
          { success: false, error: { code: 'FORBIDDEN', message: 'Insufficient privileges' } },
          { status: 403 }
        );
      }
    }

    const data = await SpatialHeatmapService.getOperationsHeatmap();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('[Operations Heatmap API Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'HEATMAP_FETCH_FAILED', message: error.message || 'Failed to fetch heatmap data' },
      },
      { status: 500 }
    );
  }
}
