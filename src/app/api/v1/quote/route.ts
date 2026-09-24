import { NextResponse } from 'next/server';
import { calculateQuote, getQuote } from '@/lib/pricing/engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { modelId, variantId, conditionAnswers } = body;

    if (!modelId || !variantId || !conditionAnswers) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: modelId, variantId, conditionAnswers' },
        { status: 400 }
      );
    }

    const quote = calculateQuote(modelId, variantId, conditionAnswers);
    return NextResponse.json({ success: true, data: quote });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
