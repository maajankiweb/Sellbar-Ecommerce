'use client';

import React, { useState, useEffect, useCallback } from 'react';

export interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  currencySymbol?: string;
  histogram?: number[];
}

export function PriceRangeSlider({
  min,
  max,
  step = 100,
  value,
  onChange,
  currencySymbol = '₹',
  histogram = [12, 28, 45, 80, 110, 95, 65, 40, 25, 14, 8, 3]
}: PriceRangeSliderProps) {
  const [localRange, setLocalRange] = useState<[number, number]>(value);
  const [minInput, setMinInput] = useState<string>(value[0].toString());
  const [maxInput, setMaxInput] = useState<string>(value[1].toString());

  useEffect(() => {
    setLocalRange(value);
    setMinInput(value[0].toString());
    setMaxInput(value[1].toString());
  }, [value]);

  const minPercent = Math.max(0, Math.min(100, ((localRange[0] - min) / (max - min)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((localRange[1] - min) / (max - min)) * 100));

  const handleMinSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMin = Math.min(Number(e.target.value), localRange[1] - step);
    setLocalRange([nextMin, localRange[1]]);
    setMinInput(nextMin.toString());
    onChange([nextMin, localRange[1]]);
  };

  const handleMaxSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMax = Math.max(Number(e.target.value), localRange[0] + step);
    setLocalRange([localRange[0], nextMax]);
    setMaxInput(nextMax.toString());
    onChange([localRange[0], nextMax]);
  };

  const handleMinInputBlur = () => {
    const num = parseInt(minInput.replace(/[^\d]/g, ''), 10) || min;
    const clamped = Math.max(min, Math.min(num, localRange[1] - step));
    setLocalRange([clamped, localRange[1]]);
    setMinInput(clamped.toString());
    onChange([clamped, localRange[1]]);
  };

  const handleMaxInputBlur = () => {
    const num = parseInt(maxInput.replace(/[^\d]/g, ''), 10) || max;
    const clamped = Math.min(max, Math.max(num, localRange[0] + step));
    setLocalRange([localRange[0], clamped]);
    setMaxInput(clamped.toString());
    onChange([localRange[0], clamped]);
  };

  const maxDensity = Math.max(...histogram, 1);

  return (
    <div className="space-y-3 select-none">
      {/* Mini Distribution Histogram */}
      {histogram && histogram.length > 0 && (
        <div className="flex items-end gap-1 h-8 px-1">
          {histogram.map((count, idx) => {
            const barPercent = (idx / (histogram.length - 1)) * 100;
            const isInRange = barPercent >= minPercent && barPercent <= maxPercent;
            const heightPx = Math.max(4, (count / maxDensity) * 32);
            return (
              <div
                key={idx}
                className={`flex-1 rounded-t-xs transition-colors duration-150 ${
                  isInRange ? 'bg-blue-500/80' : 'bg-slate-200'
                }`}
                style={{ height: `${heightPx}px` }}
                title={`${count} items`}
              />
            );
          })}
        </div>
      )}

      {/* Dual Slider Track Container */}
      <div className="relative h-6 flex items-center">
        {/* Background Track */}
        <div className="absolute w-full h-1.5 bg-slate-200 rounded-full" />

        {/* Selected Active Range */}
        <div
          className="absolute h-1.5 bg-blue-600 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`
          }}
        />

        {/* Invisible Range Inputs for Double Thumbs */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localRange[0]}
          onChange={handleMinSlider}
          className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none z-10 
            [&::-webkit-slider-thumb]:pointer-events-auto 
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:h-4 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:border-2 
            [&::-webkit-slider-thumb]:border-blue-600 
            [&::-webkit-slider-thumb]:shadow-md 
            [&::-webkit-slider-thumb]:cursor-pointer 
            [&::-webkit-slider-thumb]:hover:scale-110 
            [&::-webkit-slider-thumb]:active:scale-125 
            [&::-webkit-slider-thumb]:transition-transform"
          aria-label="Minimum Price"
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localRange[1]}
          onChange={handleMaxSlider}
          className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none z-20 
            [&::-webkit-slider-thumb]:pointer-events-auto 
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:h-4 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:border-2 
            [&::-webkit-slider-thumb]:border-blue-600 
            [&::-webkit-slider-thumb]:shadow-md 
            [&::-webkit-slider-thumb]:cursor-pointer 
            [&::-webkit-slider-thumb]:hover:scale-110 
            [&::-webkit-slider-thumb]:active:scale-125 
            [&::-webkit-slider-thumb]:transition-transform"
          aria-label="Maximum Price"
        />
      </div>

      {/* Numeric Inputs Grid */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
            {currencySymbol}
          </span>
          <input
            type="text"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            onBlur={handleMinInputBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleMinInputBlur()}
            className="w-full pl-7 pr-2 py-1.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600"
            placeholder="Min"
          />
        </div>

        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
            {currencySymbol}
          </span>
          <input
            type="text"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            onBlur={handleMaxInputBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleMaxInputBlur()}
            className="w-full pl-7 pr-2 py-1.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
}
