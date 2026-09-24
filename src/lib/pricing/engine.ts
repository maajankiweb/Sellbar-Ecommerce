import { MODELS, CONDITION_QUESTIONS, db } from '@/lib/db/data';
import { Quote, QuoteBreakdownItem } from '@/types';

export function calculateQuote(
  modelId: string,
  variantId: string,
  answers: Record<string, string | string[]>
): Quote {
  const model = MODELS.find(m => m.id === modelId);
  if (!model) {
    throw new Error(`Device model not found: ${modelId}`);
  }

  const variant = model.variants.find(v => v.id === variantId) ?? model.variants[0];
  if (!variant) {
    throw new Error(`Variant not found for model: ${modelId}`);
  }

  const basePrice = variant.basePrice;
  const breakdown: QuoteBreakdownItem[] = [
    {
      title: `Base Value (${model.name} ${variant.storage})`,
      amount: basePrice,
      type: 'base',
      note: 'Initial fair market buyback estimate in pristine working condition',
    },
  ];

  let currentDeductionTotal = 0;

  for (const question of CONDITION_QUESTIONS) {
    const answer = answers[question.id];
    if (!answer) continue;

    const selectedOptionIds = Array.isArray(answer) ? answer : [answer];

    for (const optId of selectedOptionIds) {
      const option = question.options.find(o => o.id === optId);
      if (!option) continue;

      let deductionAmount = 0;
      if (option.deductionType === 'percent') {
        deductionAmount = Math.round((basePrice * option.deductionValue) / 100);
      } else {
        deductionAmount = option.deductionValue;
      }

      if (deductionAmount > 0) {
        currentDeductionTotal += deductionAmount;
        breakdown.push({
          title: option.label,
          amount: -deductionAmount,
          type: 'deduction',
          note: option.description,
        });
      } else if (deductionAmount < 0) {
        // Negative deduction = bonus!
        const bonusAmount = Math.abs(deductionAmount);
        currentDeductionTotal -= bonusAmount;
        breakdown.push({
          title: `Bonus: ${option.label}`,
          amount: bonusAmount,
          type: 'bonus',
          note: option.description,
        });
      }
    }
  }

  // Ensure price never drops below 10% of base price or minimum ₹1,000 for recyclable components
  const calculatedPrice = basePrice - currentDeductionTotal;
  const minimumPrice = Math.max(1000, Math.round(basePrice * 0.12));
  const finalPrice = Math.max(minimumPrice, calculatedPrice);

  const quoteId = `QUO-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const validUntil = new Date(Date.now() + 72 * 3600 * 1000).toISOString(); // 72-hour validity guarantee

  const quote: Quote = {
    id: quoteId,
    modelId: model.id,
    modelName: model.name,
    brandName: model.brandId.toUpperCase(),
    modelImage: model.imageUrl,
    variantId: variant.id,
    variantText: `${variant.ram ? variant.ram + ' / ' : ''}${variant.storage}`,
    basePrice,
    finalPrice,
    breakdown,
    conditionAnswers: answers,
    validUntil,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  // Cache in database store
  db.quotes.set(quote.id, quote);

  return quote;
}

export function getQuote(quoteId: string): Quote | null {
  return db.quotes.get(quoteId) ?? null;
}
