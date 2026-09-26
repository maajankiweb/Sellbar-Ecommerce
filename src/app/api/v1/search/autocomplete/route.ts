import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/services/catalog/searchService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '8', 10);

    const result = await SearchService.autocomplete(query, limit);

    return NextResponse.json({
      success: true,
      data: result.suggestions,
      meta: {
        query,
        count: result.suggestions.length,
        engine: result.usedAtlasSearch ? 'atlas_search_lucene' : 'regex_text_fallback',
      },
    });
  } catch (error: any) {
    console.error('[Autocomplete API Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SEARCH_AUTOCOMPLETE_ERROR',
          message: error.message || 'Failed to fetch suggestions',
        },
      },
      { status: 500 }
    );
  }
}
