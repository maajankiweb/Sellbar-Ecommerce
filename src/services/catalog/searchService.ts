import connectToDatabase from '@/lib/db/mongodb';
import { Product } from '@/lib/db/models/Product';

export interface AutocompleteSuggestion {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  sellingPrice: number;
  thumbnail?: string;
  score?: number;
}

export interface SearchFilterOptions {
  query: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: any[];
  total: number;
  page: number;
  totalPages: number;
  facetBrands: { brand: string; count: number }[];
  facetCategories: { category: string; count: number }[];
  usedAtlasSearch: boolean;
}

export class SearchService {
  /**
   * Fast autocomplete suggestions with fuzzy matching
   */
  public static async autocomplete(query: string, limit: number = 8): Promise<{
    suggestions: AutocompleteSuggestion[];
    usedAtlasSearch: boolean;
  }> {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      return { suggestions: [], usedAtlasSearch: false };
    }

    await connectToDatabase();

    // 1. Attempt MongoDB Atlas Search ($search) with autocomplete & fuzzy
    try {
      const atlasPipeline: any[] = [
        {
          $search: {
            index: 'products_search',
            autocomplete: {
              query: trimmed,
              path: 'name',
              fuzzy: {
                maxEdits: 1,
                prefixLength: 1,
              },
            },
          },
        },
        {
          $match: {
            status: 'ACTIVE',
          },
        },
        {
          $project: {
            id: '$_id',
            name: 1,
            slug: 1,
            brand: 1,
            category: 1,
            sellingPrice: 1,
            thumbnail: { $arrayElemAt: ['$images', 0] },
            score: { $meta: 'searchScore' },
          },
        },
        { $limit: limit },
      ];

      const results = await Product.aggregate(atlasPipeline);
      if (results && results.length > 0) {
        return {
          suggestions: results.map((r) => ({
            id: r._id.toString(),
            name: r.name,
            slug: r.slug,
            brand: r.brand,
            category: r.category,
            sellingPrice: r.sellingPrice,
            thumbnail: r.thumbnail,
            score: r.score,
          })),
          usedAtlasSearch: true,
        };
      }
    } catch (err: any) {
      // Atlas search index not present or running in local non-Atlas MongoDB; fallback gracefully
      // console.warn('[SearchService] Atlas Search not available, falling back to regex/text matching:', err?.message);
    }

    // 2. Local Fallback: Regex Prefix & Substring Match
    const escapedQuery = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedQuery, 'i');

    const fallbackResults = await Product.find({
      status: { $in: ['ACTIVE', 'active', undefined] },
      $or: [
        { name: { $regex: regex } },
        { brand: { $regex: regex } },
        { tags: { $in: [regex] } },
      ],
    })
      .select('_id name slug brand category sellingPrice price images')
      .limit(limit)
      .lean();

    return {
      suggestions: fallbackResults.map((p: any) => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug || p._id.toString(),
        brand: p.brand || '',
        category: p.category || '',
        sellingPrice: p.sellingPrice || p.price || 0,
        thumbnail: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : undefined,
      })),
      usedAtlasSearch: false,
    };
  }

  /**
   * Full search query with compound fuzzy matching, facet aggregation, and filtering
   */
  public static async fullSearch(options: SearchFilterOptions): Promise<SearchResult> {
    const {
      query,
      category,
      brand,
      minPrice,
      maxPrice,
      sort = 'relevance',
      page = 1,
      limit = 20,
    } = options;

    await connectToDatabase();
    const skip = (page - 1) * limit;

    // 1. Try Atlas Search Compound Pipeline
    try {
      const compoundMust: any[] = [];
      const compoundFilter: any[] = [{ text: { query: 'ACTIVE', path: 'status' } }];

      if (query && query.trim()) {
        compoundMust.push({
          text: {
            query: query.trim(),
            path: ['name', 'brand', 'description', 'tags'],
            fuzzy: {
              maxEdits: 2,
              prefixLength: 1,
            },
          },
        });
      }

      if (category) {
        compoundFilter.push({ text: { query: category, path: 'category' } });
      }
      if (brand) {
        compoundFilter.push({ text: { query: brand, path: 'brand' } });
      }

      const atlasPipeline: any[] = [
        {
          $search: {
            index: 'products_search',
            compound: {
              must: compoundMust.length > 0 ? compoundMust : [{ wildcard: { query: '*', path: 'name' } }],
              filter: compoundFilter,
            },
            count: { type: 'total' },
          },
        },
      ];

      // Price filter in match stage
      const matchStage: any = {};
      if (minPrice !== undefined || maxPrice !== undefined) {
        matchStage.sellingPrice = {};
        if (minPrice !== undefined) matchStage.sellingPrice.$gte = minPrice;
        if (maxPrice !== undefined) matchStage.sellingPrice.$lte = maxPrice;
      }

      if (Object.keys(matchStage).length > 0) {
        atlasPipeline.push({ $match: matchStage });
      }

      // Facets
      atlasPipeline.push({
        $facet: {
          products: [
            {
              $sort:
                sort === 'price_asc'
                  ? { sellingPrice: 1 }
                  : sort === 'price_desc'
                  ? { sellingPrice: -1 }
                  : sort === 'rating'
                  ? { rating: -1 }
                  : sort === 'newest'
                  ? { createdAt: -1 }
                  : { score: { $meta: 'searchScore' } },
            },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $count: 'count' }],
          brands: [{ $group: { _id: '$brand', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 15 }],
          categories: [{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }],
        },
      });

      const [aggregationResult] = await Product.aggregate(atlasPipeline);
      if (aggregationResult && aggregationResult.products) {
        const total = aggregationResult.totalCount[0]?.count || 0;
        return {
          products: aggregationResult.products,
          total,
          page,
          totalPages: Math.ceil(total / limit) || 1,
          facetBrands: (aggregationResult.brands || []).map((b: any) => ({ brand: b._id, count: b.count })),
          facetCategories: (aggregationResult.categories || []).map((c: any) => ({ category: c._id, count: c.count })),
          usedAtlasSearch: true,
        };
      }
    } catch {
      // Fallback to Mongoose native query
    }

    // 2. Mongoose Fallback Query
    const queryFilter: any = {
      status: { $in: ['ACTIVE', 'active', undefined] },
    };

    if (query && query.trim()) {
      const regex = new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      queryFilter.$or = [{ name: regex }, { brand: regex }, { tags: { $in: [regex] } }, { description: regex }];
    }
    if (category) queryFilter.category = category;
    if (brand) queryFilter.brand = brand;
    if (minPrice !== undefined || maxPrice !== undefined) {
      queryFilter.sellingPrice = {};
      if (minPrice !== undefined) queryFilter.sellingPrice.$gte = minPrice;
      if (maxPrice !== undefined) queryFilter.sellingPrice.$lte = maxPrice;
    }

    const sortOptions: any = {};
    if (sort === 'price_asc') sortOptions.sellingPrice = 1;
    else if (sort === 'price_desc') sortOptions.sellingPrice = -1;
    else if (sort === 'rating') sortOptions.rating = -1;
    else if (sort === 'newest') sortOptions.createdAt = -1;
    else sortOptions.createdAt = -1;

    const [products, total] = await Promise.all([
      Product.find(queryFilter).sort(sortOptions).skip(skip).limit(limit).lean(),
      Product.countDocuments(queryFilter),
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      facetBrands: [],
      facetCategories: [],
      usedAtlasSearch: false,
    };
  }
}
