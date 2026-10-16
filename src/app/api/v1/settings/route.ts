import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/settings/siteSettings';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve site settings',
      },
      { status: 500 }
    );
  }
}
