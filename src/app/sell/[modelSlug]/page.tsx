'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MODELS, CONDITION_QUESTIONS } from '@/lib/db/data';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function ModelEvaluationPage({
  params,
}: {
  params: Promise<{ modelSlug: string }>;
}) {
  const router = useRouter();
  const { modelSlug } = use(params);

  const model = MODELS.find((m) => m.slug === modelSlug);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    model?.variants[0]?.id || ''
  );

  // Condition answers dictionary: questionId -> optionId or optionId[]
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({
    q_switch_on: 'power_yes',
    q_screen_condition: 'screen_flawless',
    q_body_condition: 'body_flawless',
    q_functional_issues: [],
    q_accessories: ['acc_original_charger', 'acc_original_box'],
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0 = variant, 1..5 = questions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!model) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Device model not found</h2>
        <Link href="/sell" className="text-emerald-600 text-sm font-semibold hover:underline mt-2 inline-block">
          Return to Sell Catalog
        </Link>
      </div>
    );
  }

  const selectedVariant = model.variants.find((v) => v.id === selectedVariantId) || model.variants[0];

  // Handle single-select auto advance
  const handleSingleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Handle multi-select toggle
  const handleMultiToggle = (questionId: string, optionId: string) => {
    const current = (answers[questionId] as string[]) || [];
    const updated = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
    setAnswers((prev) => ({ ...prev, [questionId]: updated }));
  };

  const currentQuestion = CONDITION_QUESTIONS[currentStepIndex];

  // Submit assessment and generate quote
  const handleGetExactQuote = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/v1/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: model.id,
          variantId: selectedVariant.id,
          conditionAnswers: answers,
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.id) {
        router.push(`/sell/quote/${data.data.id}`);
      } else {
        setSubmitError(data.error || 'Failed to generate quote. Please try again.');
        setIsSubmitting(false);
      }
    } catch {
      setSubmitError('Connection failed. Please verify your network.');
      setIsSubmitting(false);
    }
  };

  const totalQuestions = CONDITION_QUESTIONS.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/sell"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Models</span>
        </Link>
        <span className="text-xs font-bold text-slate-400">
          Step {currentStepIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Device Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 p-2 border border-slate-100 flex items-center justify-center shrink-0">
          <img src={model.imageUrl} alt={model.name} className="w-full h-full object-contain" />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{model.brandId}</div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-950">{model.name}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Base market buyback estimate: <strong className="text-emerald-700 font-extrabold text-sm">₹{selectedVariant.basePrice.toLocaleString('en-IN')}</strong>
          </p>

          {/* Variant Selector Pills */}
          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Storage:</span>
            {model.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedVariant.id === v.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {v.storage} {v.ram ? `(${v.ram})` : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-600">Condition Assessment</span>
          <span className="text-emerald-700">{progressPercent}% Completed</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
            <span>Question {currentStepIndex + 1} of {totalQuestions}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            {currentQuestion.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentQuestion.description}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSingle = currentQuestion.type === 'single';
            const selected = isSingle
              ? answers[currentQuestion.id] === option.id
              : ((answers[currentQuestion.id] as string[]) || []).includes(option.id);

            return (
              <div
                key={option.id}
                onClick={() => {
                  if (isSingle) {
                    handleSingleSelect(currentQuestion.id, option.id);
                  } else {
                    handleMultiToggle(currentQuestion.id, option.id);
                  }
                }}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-4 ${
                  selected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${
                      selected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {selected && <CheckCircle2 className="w-4 h-4 fill-white text-emerald-600" />}
                  </div>

                  <div>
                    <h3 className={`text-xs sm:text-sm font-bold ${selected ? 'text-emerald-950' : 'text-slate-800'}`}>
                      {option.label}
                    </h3>
                    {option.description && (
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>

                {option.deductionValue < 0 && (
                  <span className="shrink-0 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-bold">
                    +₹{Math.abs(option.deductionValue)} Bonus
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {submitError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {submitError}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentStepIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStepIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleGetExactQuote}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-600/25 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{isSubmitting ? 'Calculating Exact Value...' : 'Calculate My Final Cash Quote'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Trust Banner */}
      <div className="flex items-center justify-center gap-4 text-slate-400 text-xs text-center">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Transparent deduction formula with 72-hour price lock
        </span>
      </div>
    </div>
  );
}
