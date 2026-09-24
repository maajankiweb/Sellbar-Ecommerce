import { NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/db/productsStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const condition = searchParams.get('condition') || undefined;
    const search = searchParams.get('search') || undefined;
    const featuredParam = searchParams.get('featured');
    const slug = searchParams.get('slug') || undefined;

    const featured = featuredParam !== null ? featuredParam === 'true' : undefined;

    const products = await getAllProducts({
      category,
      brand,
      condition,
      search,
      featured,
    });

    if (slug) {
      const single = products.find((p) => p.slug === slug);
      if (!single) {
        return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: single });
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.brand || !body.price) {
      return NextResponse.json(
        { success: false, message: 'Product title, brand, and selling price are required.' },
        { status: 400 }
      );
    }

    const created = await createProduct(body);

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully!',
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
