import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db/productsStore';

// Helper to escape CSV cell according to RFC 4180
function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const condition = searchParams.get('condition') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const inStockOnly = searchParams.get('inStockOnly') === 'true';

    const all = await getAllProducts();

    const filtered = all.filter((p) => {
      if (category && category !== 'all' && p.category !== category && p.categoryGroup !== category) {
        return false;
      }
      if (brand && brand !== 'all' && p.brand?.toLowerCase() !== brand.toLowerCase()) {
        return false;
      }
      if (condition && condition !== 'all' && p.conditionType !== condition) {
        return false;
      }
      if (minPrice !== undefined && p.price < minPrice) return false;
      if (maxPrice !== undefined && p.price > maxPrice) return false;
      if (inStockOnly && (p.stock || 0) <= 0) return false;
      return true;
    });

    const headers = [
      'Product ID',
      'Name',
      'Brand',
      'Category',
      'Condition Type',
      'Selling Price (INR)',
      'Original MRP (INR)',
      'Discount %',
      'Stock Left',
      'Warranty (Months)',
      'Replacement Window',
      'QC Points Passed',
      'Customer Rating',
      'Slug / URL',
    ];

    const rows = filtered.map((p) => [
      p.id || '',
      p.name || '',
      p.brand || '',
      p.category || '',
      p.conditionType || 'refurbished',
      p.price || 0,
      p.originalMrp || p.price || 0,
      p.discountPercent || 0,
      p.stock || 0,
      p.warrantyMonths || 12,
      `${p.replacementDays || 5} Days Easy Return`,
      `${p.qcPointsCount || 32}-Point Tested`,
      p.rating || 4.8,
      `https://selbar.in/buy/${p.slug || p.id}`,
    ]);

    const csvContent = [
      headers.map(escapeCsvCell).join(','),
      ...rows.map((r) => r.map(escapeCsvCell).join(',')),
    ].join('\r\n');

    const filename = `selbar_inventory_screener_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to export screener CSV', error: String(error) },
      { status: 500 }
    );
  }
}
