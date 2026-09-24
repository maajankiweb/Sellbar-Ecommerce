import { NextResponse } from 'next/server';
import { getQuote } from '@/lib/pricing/engine';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ quoteId: string }> }
) {
  const { quoteId } = await params;
  const quote = getQuote(quoteId);

  if (!quote) {
    return NextResponse.json(
      { success: false, error: 'Quote not found or has expired' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: quote });
}
