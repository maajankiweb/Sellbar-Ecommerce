import { NextResponse } from 'next/server';
import { getDistinctCategories, addCustomCategory } from '@/lib/db/productsStore';

export async function GET() {
  try {
    const categories = await getDistinctCategories();
    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const categoryName = body.category || body.name;

    if (!categoryName || typeof categoryName !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Category name is required' },
        { status: 400 }
      );
    }

    const created = await addCustomCategory(categoryName);

    if (!created) {
      return NextResponse.json(
        { success: false, message: 'Invalid category name' },
        { status: 400 }
      );
    }

    const categories = await getDistinctCategories();

    return NextResponse.json({
      success: true,
      message: `Category "${created}" added successfully!`,
      category: created,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add category' },
      { status: 500 }
    );
  }
}
