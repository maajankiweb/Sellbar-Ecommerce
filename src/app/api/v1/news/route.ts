import { NextResponse } from 'next/server';
import { getAllArticles, createArticle, deleteArticle } from '@/lib/db/newsStore';

// GET /api/v1/news?category=gadgets
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const articles = getAllArticles(category);

    return NextResponse.json({
      success: true,
      count: articles.length,
      category: category || 'all',
      articles,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve news feed', error: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/v1/news (Add news article)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || !body.excerpt || !body.content) {
      return NextResponse.json(
        { success: false, message: 'Missing required article fields (title, excerpt, content)' },
        { status: 400 }
      );
    }

    const slug = (body.slug || body.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newArticle = createArticle({
      slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category || 'gadgets',
      tags: Array.isArray(body.tags) ? body.tags : ['SELBAR', 'Tech News'],
      author: body.author || 'SELBAR Editorial',
      readTime: body.readTime || '3 min read',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
    });

    return NextResponse.json({
      success: true,
      message: 'Article published successfully',
      article: newArticle,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to publish article', error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/news?id=art_xxx
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Article id is required' },
        { status: 400 }
      );
    }

    const deleted = deleteArticle(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete article', error: String(error) },
      { status: 500 }
    );
  }
}
