import { NextResponse } from 'next/server';
import { BRANDS, MODELS, REFURB_PRODUCTS } from '@/lib/db/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';
  const brandId = searchParams.get('brand');
  const category = searchParams.get('category') || 'phone';

  if (type === 'brands') {
    return NextResponse.json({ success: true, data: BRANDS });
  }

  if (type === 'models') {
    let filtered = MODELS.filter(m => m.category === category);
    if (brandId) {
      filtered = filtered.filter(m => m.brandId.toLowerCase() === brandId.toLowerCase());
    }
    return NextResponse.json({ success: true, data: filtered });
  }

  if (type === 'refurb') {
    let filtered = REFURB_PRODUCTS.filter(p => p.category === category);
    if (brandId) {
      filtered = filtered.filter(p => p.brand.toLowerCase() === brandId.toLowerCase());
    }
    return NextResponse.json({ success: true, data: filtered });
  }

  return NextResponse.json({
    success: true,
    data: {
      brands: BRANDS,
      models: MODELS,
      refurb: REFURB_PRODUCTS,
    },
  });
}
