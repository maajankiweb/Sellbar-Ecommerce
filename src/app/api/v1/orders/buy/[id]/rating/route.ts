import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Order from '@/lib/db/models/Order';
import { cacheStore } from '@/lib/auth/security/redisClient';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { rating, tags, comment } = body;

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_RATING', message: 'Rating must be an integer between 1 and 5' } },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Cache rating in Redis for quick courier aggregate performance updates
    const ratingRecord = {
      orderId: id,
      rating,
      tags: tags || [],
      comment: comment || '',
      submittedAt: new Date().toISOString(),
    };

    await cacheStore.set(`order:rating:${id}`, JSON.stringify(ratingRecord), 365 * 24 * 60 * 60);

    // Update order rating in MongoDB if Order collection exists
    try {
      await Order.findByIdAndUpdate(id, {
        $set: {
          deliveryRating: rating,
          deliveryRatingTags: tags,
          deliveryRatingComment: comment,
          deliveryRatedAt: new Date(),
        },
      });
    } catch {
      // Order schema update fallback
    }

    return NextResponse.json({
      success: true,
      message: 'Delivery rating recorded successfully',
      data: ratingRecord,
    });
  } catch (error: any) {
    console.error('[Order Rating API Error]', error);
    return NextResponse.json(
      { success: false, error: { code: 'RATING_SUBMISSION_ERROR', message: error.message || 'Failed to submit rating' } },
      { status: 500 }
    );
  }
}
