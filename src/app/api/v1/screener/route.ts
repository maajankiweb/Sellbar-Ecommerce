import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db/productsStore';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const condition = searchParams.get('condition') || undefined;
    const grade = searchParams.get('grade') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const minDiscount = searchParams.get('minDiscount') ? Number(searchParams.get('minDiscount')) : undefined;
    const minRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined;
    const inStockOnly = searchParams.get('inStockOnly') === 'true';
    const warrantyMin = searchParams.get('warrantyMin') ? Number(searchParams.get('warrantyMin')) : undefined;
    const search = searchParams.get('search')?.toLowerCase() || undefined;
    const sortBy = searchParams.get('sortBy') || 'discount_desc';
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit')) || 20));

    // Fetch all raw products
    const all = await getAllProducts();

    // In-house custom screener filtering
    let filtered = all.filter((p) => {
      if (category && category !== 'all') {
        const catMatch =
          p.category === category ||
          p.categoryGroup === category ||
          (category === 'phone' && (p.category === 'old-phone' || p.categoryGroup === 'old-phone')) ||
          (category === 'laptop' && (p.category === 'old-laptop' || p.categoryGroup === 'old-laptop'));
        if (!catMatch) return false;
      }

      if (brand && brand !== 'all') {
        if (p.brand?.toLowerCase() !== brand.toLowerCase()) return false;
      }

      if (condition && condition !== 'all') {
        if (p.conditionType !== condition) return false;
      }

      if (grade && grade !== 'all') {
        const hasGrade = Array.isArray(p.grades)
          ? p.grades.some((g: any) => g.grade === grade || g.title?.toLowerCase().includes(grade.toLowerCase()))
          : true;
        if (!hasGrade) return false;
      }

      if (minPrice !== undefined && p.price < minPrice) return false;
      if (maxPrice !== undefined && p.price > maxPrice) return false;
      if (minDiscount !== undefined && (p.discountPercent || 0) < minDiscount) return false;
      if (minRating !== undefined && (p.rating || 0) < minRating) return false;
      if (inStockOnly && (p.stock || 0) <= 0) return false;
      if (warrantyMin !== undefined && (p.warrantyMonths || 0) < warrantyMin) return false;

      if (search) {
        const match =
          p.name?.toLowerCase().includes(search) ||
          p.brand?.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search);
        if (!match) return false;
      }

      return true;
    });

    // Custom in-house sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return (a.price || 0) - (b.price || 0);
        case 'price_desc':
          return (b.price || 0) - (a.price || 0);
        case 'discount_desc':
          return (b.discountPercent || 0) - (a.discountPercent || 0);
        case 'rating_desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'stock_desc':
          return (b.stock || 0) - (a.stock || 0);
        case 'newest':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    // Compute Screener Intelligence & Metrics
    const totalCount = filtered.length;
    const totalPrice = filtered.reduce((acc, p) => acc + (p.price || 0), 0);
    const totalOriginalMrp = filtered.reduce((acc, p) => acc + (p.originalMrp || p.price || 0), 0);
    const averagePrice = totalCount > 0 ? Math.round(totalPrice / totalCount) : 0;
    const totalInventoryValue = filtered.reduce((acc, p) => acc + (p.price || 0) * (p.stock || 1), 0);
    const averageDiscountPercent =
      totalOriginalMrp > 0 ? Math.round(((totalOriginalMrp - totalPrice) / totalOriginalMrp) * 100) : 0;

    const brandBreakdown: Record<string, number> = {};
    const categoryBreakdown: Record<string, number> = {};

    filtered.forEach((p) => {
      const b = p.brand || 'Other';
      brandBreakdown[b] = (brandBreakdown[b] || 0) + 1;

      const c = p.category || 'Other';
      categoryBreakdown[c] = (categoryBreakdown[c] || 0) + 1;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      meta: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      metrics: {
        averagePrice,
        averageDiscountPercent,
        totalInventoryValue,
        brandBreakdown,
        categoryBreakdown,
      },
      filtersApplied: {
        category,
        brand,
        condition,
        grade,
        minPrice,
        maxPrice,
        minDiscount,
        minRating,
        inStockOnly,
        warrantyMin,
        search,
        sortBy,
      },
      products: paginated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to execute custom screener', error: String(error) },
      { status: 500 }
    );
  }
}
