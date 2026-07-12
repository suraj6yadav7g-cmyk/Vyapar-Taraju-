/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { IndianRupee, RotateCcw, Copy, Share2, ClipboardCheck, ArrowLeft, Layers } from 'lucide-react';
import { LanguagePack, HistoryItem } from '../types';
import { safeCopyToClipboard } from '../utils';

interface AmountCalculatorProps {
  key?: string;
  t: LanguagePack;
  language: 'en' | 'hi';
  onAddHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  onBack: () => void;
  themeMode: 'light' | 'dark';
}

export default function AmountCalculator({ t, language, onAddHistory, onBack, themeMode }: AmountCalculatorProps) {
  const [price, setPrice] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'g'>('g'); // Default to grams since many buy small weights
  const [resultAmount, setResultAmount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(price);
    const w = parseFloat(weight);

    if (isNaN(p) || p <= 0 || isNaN(w) || w <= 0) {
      alert(language === 'hi' ? 'कृपया सही भाव और वज़न दर्ज़ करें!' : 'Please enter valid rate and weight amount!');
      return;
    }

    // Amount = Price * (Weight if KG, or Weight/1000 if Gram)
    const factor = weightUnit === 'kg' ? 1 : 0.001;
    const rawCalculated = p * w * factor;
    // Perfect rounding to 2 decimal places
    const finalAmount = Math.round(rawCalculated * 100) / 100;

    setResultAmount(finalAmount);

    onAddHistory({
      type: 'amount',
      inputDescription: `${t.pricePerKg}: ₹${p}/kg, ${t.weightAmount}: ${w} ${weightUnit === 'kg' ? t.kg : t.gram}`,
      formulaDescription: `Amount = ₹${p} × (${w} ${weightUnit})`,
      result: `₹${finalAmount}`,
      rawDetails: { price: p, weight: w, weightType: weightUnit, amount: finalAmount }
    });
  };

  const handleClear = () => {
    setPrice('');
    setWeight('');
    setResultAmount(null);
    setCopied(false);
    setShared(false);
  };

  const handleCopy = () => {
    if (resultAmount === null) return;
    const copyString = `${t.pricePerKg || 'Price'}: ₹${price}/kg\n` +
                       `${t.weightAmount || 'Weight'}: ${weight} ${weightUnit === 'kg' ? t.kg : t.gram}\n` +
                       `${t.amountResult || 'Amount'}: ₹${resultAmount}`;
    safeCopyToClipboard(copyString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    if (resultAmount === null) return;
    const shareText = `⚖️ *Vyapar Taraju* ⚖️\n` +
                      `━━━━━━━━━━━━━━━\n` +
                      `💵 Rate: ₹${price}/kg\n` +
                      `⚖️ Qty: ${weight} ${weightUnit === 'kg' ? t.kg : t.gram}\n` +
                      `💰 *Amount: ₹${resultAmount}*\n` +
                      `━━━━━━━━━━━━━━━\n` +
                      `Calculated using Vyapar Taraju App.`;
    safeCopyToClipboard(shareText);
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 max-w-4xl mx-auto"
    >
      {/* Header back navigation */}
      <div className="flex items-center space-x-3 mb-2">
        <button
          type="button"
          onClick={onBack}
          id="btn-back-amount"
          className={`p-2.5 rounded-full border transition-colors ${
            themeMode === 'dark'
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700/50 text-slate-300 hover:text-white pointer-events-auto'
              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm pointer-events-auto'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className={`text-xl font-display font-black flex items-center gap-2 ${
            themeMode === 'dark' ? 'text-slate-100' : 'text-slate-905'
          }`}>
            <IndianRupee className="w-5 h-5 text-emerald-500" />
            {t.amountCardTitle}
          </h2>
          <p className={`text-xs font-bold ${
            themeMode === 'dark' ? 'text-slate-400' : 'text-slate-650'
          }`}>{t.amountCardDesc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form panel */}
        <div id="card-amount-calc-form" className={`border rounded-3xl p-6 shadow-xl ${
          themeMode === 'dark'
            ? 'bg-slate-900 border-slate-800/80 shadow-black/20'
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <form onSubmit={handleCalculate} className="space-y-5">
            <div>
              <label className={`block text-xs font-black mb-2 uppercase tracking-wider ${
                themeMode === 'dark' ? 'text-slate-400' : 'text-slate-700'
              }`}>
                {t.pricePerKg}
              </label>
              <div className={`relative rounded-2xl border transition-all p-1 focus-within:ring-2 focus-within:ring-indigo-500/10 ${
                themeMode === 'dark'
                  ? 'bg-slate-950 border-slate-800 focus-within:border-emerald-500'
                  : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500 focus-within:bg-white'
              }`}>
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${
                  themeMode === 'dark' ? 'text-slate-400' : 'text-slate-800'
                }`}>₹</span>
                <input
                  type="number"
                  step="any"
                  id="input-amount-price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={t.enterPrice}
                  className={`w-full bg-transparent p-3 pl-8 text-xl font-display font-black outline-none placeholder:font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    themeMode === 'dark'
                      ? 'text-slate-100 placeholder:text-slate-600'
                      : 'text-slate-900 placeholder:text-slate-400'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Segment Toggle for unit selection */}
            <div>
              <label className={`block text-xs font-black mb-2 uppercase tracking-wider ${
                themeMode === 'dark' ? 'text-slate-400' : 'text-slate-700'
              }`}>
                {t.weightType}
              </label>
              <div id="segment-weight-unit" className={`grid grid-cols-2 gap-2 border p-1 rounded-2xl ${
                themeMode === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  type="button"
                  id="btn-unit-gram"
                  onClick={() => setWeightUnit('g')}
                  className={`py-3 text-sm font-black rounded-xl transition-all border ${
                    weightUnit === 'g'
                      ? themeMode === 'dark'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-md'
                        : 'bg-white text-emerald-700 border-slate-250/80 shadow-xs'
                      : themeMode === 'dark'
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-transparent'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 border-transparent'
                  }`}
                >
                  {t.gram}
                </button>
                <button
                  type="button"
                  id="btn-unit-kg"
                  onClick={() => setWeightUnit('kg')}
                  className={`py-3 text-sm font-black rounded-xl transition-all border ${
                    weightUnit === 'kg'
                      ? themeMode === 'dark'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-md'
                        : 'bg-white text-emerald-700 border-slate-250/80 shadow-xs'
                      : themeMode === 'dark'
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-transparent'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 border-transparent'
                  }`}
                >
                  {t.kg}
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-black mb-2 uppercase tracking-wider ${
                themeMode === 'dark' ? 'text-slate-400' : 'text-slate-700'
              }`}>
                {t.weightAmount}
              </label>
              <div className={`relative rounded-2xl border transition-all p-1 focus-within:ring-2 focus-within:ring-indigo-500/10 ${
                themeMode === 'dark'
                  ? 'bg-slate-950 border-slate-800 focus-within:border-emerald-500'
                  : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500 focus-within:bg-white'
              }`}>
                <input
                  type="number"
                  step="any"
                  id="input-amount-weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={t.enterWeight}
                  className={`w-full bg-transparent p-3 pr-20 text-xl font-display font-black outline-none placeholder:font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    themeMode === 'dark'
                      ? 'text-slate-100 placeholder:text-slate-600'
                      : 'text-slate-900 placeholder:text-slate-400'
                  }`}
                  required
                />
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black px-2.5 py-1.5 rounded-lg border ${
                  themeMode === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-slate-400'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  {weightUnit === 'g' ? t.gram : t.kg}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleClear}
                id="btn-amount-clear"
                className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border transition-colors font-black text-sm ${
                  themeMode === 'dark'
                    ? 'border-slate-850 hover:border-slate-750 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-100 hover:bg-slate-150 text-slate-700 hover:text-slate-900'
                }`}
              >
                <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                {t.clear}
              </button>
              <button
                type="submit"
                id="btn-amount-calculate"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-505 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black transition-all shadow-md shadow-emerald-500/10 text-sm"
              >
                <IndianRupee className="w-4 h-4 stroke-[2.5]" />
                {t.calculate}
              </button>
            </div>
          </form>
        </div>

        {/* Results Panel */}
        <div id="card-amount-calc-results" className={`border rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[280px] ${
          themeMode === 'dark'
            ? 'bg-slate-900 border-slate-800/80 shadow-black/40'
            : 'bg-white border-slate-200'
        }`}>
          {resultAmount !== null ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6 flex-1 flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 text-xs font-black uppercase tracking-wider rounded-full mb-3 border border-emerald-500/10">
                  {t.amountResult}
                </span>
                <p className={`text-xs font-bold tracking-wide ${
                  themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {t.calculatedAmount}
                </p>
                
                {/* Visual Cash Display with very big numbers */}
                <div className={`mt-4 border p-6 rounded-2xl text-center flex flex-col items-center justify-center ${
                  themeMode === 'dark' ? 'bg-slate-950 border-slate-800/60' : 'bg-slate-50 border-slate-150'
                }`}>
                  <div className="flex items-baseline gap-1 animate-pulse">
                    <span className="text-3.5xl font-display font-black text-emerald-600 dark:text-emerald-400 mr-1">₹</span>
                    <span className="text-5.5xl font-display font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight leading-none">
                      {resultAmount}
                    </span>
                  </div>
                  <span className={`text-xs font-black tracking-widest uppercase mt-2 ${
                    themeMode === 'dark' ? 'text-slate-500' : 'text-slate-600'
                  }`}>
                    {language === 'hi' ? 'देय राशि (CASH TO COLLECT)' : 'Price to Collect'}
                  </span>
                </div>

                {/* Info Recipe */}
                <div className={`mt-4 p-3 rounded-xl text-xs font-mono font-bold flex justify-between border ${
                  themeMode === 'dark'
                    ? 'bg-slate-950/50 border-slate-850 text-slate-400'
                    : 'bg-slate-50 border-slate-150 text-slate-650'
                }`}>
                  <span>Rate: ₹{price}/kg</span>
                  <span>Qty: {weight} {weightUnit === 'kg' ? t.kg : t.gram}</span>
                </div>
              </div>

              {/* Action grid (Copy/Share) */}
              <div className={`grid grid-cols-2 gap-3 pt-6 border-t ${
                themeMode === 'dark' ? 'border-slate-800/60' : 'border-slate-150'
              }`}>
                <button
                  type="button"
                  onClick={handleCopy}
                  id="btn-amount-copy"
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-colors font-black text-sm ${
                    themeMode === 'dark'
                      ? 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800 shadow-sm'
                  }`}
                >
                  {copied ? <ClipboardCheck className="w-4 h-4 text-emerald-500 stroke-[2.5]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
                  {copied ? t.copied || 'Copied' : t.copyResult}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  id="btn-amount-share"
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-colors font-black text-sm ${
                    themeMode === 'dark'
                      ? 'bg-violet-600/20 hover:bg-violet-600/30 border-violet-500/20 text-violet-300'
                      : 'bg-indigo-50 hover:bg-indigo-110 border-indigo-150 text-indigo-700'
                  }`}
                >
                  <Share2 className="w-4 h-4 stroke-[2.5]" />
                  {shared ? t.shared || 'Shared' : t.shareResult}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <Layers className={`${
                themeMode === 'dark' ? 'text-slate-800' : 'text-slate-300'
              } w-12 h-12 stroke-[1.5] mb-3 animate-pulse`} />
              <p className={`text-sm font-black ${
                themeMode === 'dark' ? 'text-slate-400' : 'text-slate-700'
              }`}>
                {language === 'hi' ? 'सामान का भाव और वज़न डालें' : 'Enter rate & weight metrics'}
              </p>
              <p className={`text-xs mt-1 max-w-[200px] font-bold ${
                themeMode === 'dark' ? 'text-slate-600' : 'text-slate-500'
              }`}>
                {language === 'hi' ? 'हिसाब के बटन पर क्लिक करें' : 'Click the calculate button to see price instantly'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
