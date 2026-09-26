import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/services/catalog/searchService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const sort = (searchParams.get('sort') as any) || 'relevance';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const result = await SearchService.fullSearch({
      query,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.products,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        limit,
      },
      facets: {
        brands: result.facetBrands,
        categories: result.facetCategories,
      },
      meta: {
        engine: result.usedAtlasSearch ? 'atlas_search_compound' : 'mongoose_fallback',
      },
    });
  } catch (error: any) {
    console.error('[Search API Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SEARCH_QUERY_ERROR',
          message: error.message || 'Failed to execute search',
        },
      },
      { status: 500 }
    );
  }
}
