/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scale, RotateCcw, Copy, Share2, ClipboardCheck, ArrowLeft } from 'lucide-react';
import { LanguagePack, HistoryItem } from '../types';
import { safeCopyToClipboard } from '../utils';

interface WeightCalculatorProps {
  key?: string;
  t: LanguagePack;
  language: 'en' | 'hi';
  onAddHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  onBack: () => void;
  themeMode: 'light' | 'dark';
}

export default function WeightCalculator({ t, language, onAddHistory, onBack, themeMode }: WeightCalculatorProps) {
  const [price, setPrice] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [resultKg, setResultKg] = useState<number | null>(null);
  const [resultG, setResultG] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(price);
    const a = parseFloat(amount);

    if (isNaN(p) || p <= 0 || isNaN(a) || a < 0) {
      alert(language === 'hi' ? 'कृपया सही भाव और रकम दर्ज़ करें!' : 'Please enter valid rate and amount!');
      return;
    }

    const calculatedKg = a / p;
    const calculatedG = Math.round(calculatedKg * 1000 * 100) / 100; // Keep up to 2 decimals for grams if needed, or precise
    const formattedKg = Math.round(calculatedKg * 10000) / 10000;

    setResultKg(formattedKg);
    setResultG(calculatedG);

    // Track state in history
    onAddHistory({
      type: 'weight',
      inputDescription: `${t.pricePerKg}: ₹${p}/kg, ${t.amountToPay}: ₹${a}`,
      formulaDescription: `Weight = ₹${a} ÷ ₹${p}/kg`,
      result: `${formattedKg} ${t.kg} (${calculatedG} ${t.gram})`,
      rawDetails: { price: p, amount: a }
    });
  };

  const handleClear = () => {
    setPrice('');
    setAmount('');
    setResultKg(null);
    setResultG(null);
    setCopied(false);
    setShared(false);
  };

  const handleCopy = () => {
    if (resultKg === null || resultG === null) return;
    const copyString = `${t.pricePerKg || 'Price'}: ₹${price}/kg\n` +
                       `${t.amountToPay || 'Amount'}: ₹${amount}\n` +
                       `${t.weightResult || 'Weight'}: ${resultKg} ${t.kg} (${resultG} ${t.gram})`;
    safeCopyToClipboard(copyString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    if (resultKg === null || resultG === null) return;
    const shareText = `⚖️ *Vyapar Taraju* ⚖️\n` +
                      `━━━━━━━━━━━━━━━\n` +
                      `💵 Rate: ₹${price}/kg\n` +
                      `💰 Spent Res: ₹${amount}\n` +
                      `⚖️ *Weight: ${resultKg} ${t.kg} (${resultG} ${t.gram})*\n` +
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
          id="btn-back-weight"
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
            <Scale className="w-5 h-5 text-amber-500" />
            {t.weightCardTitle}
          </h2>
          <p className={`text-xs font-bold ${
            themeMode === 'dark' ? 'text-slate-400' : 'text-slate-650'
          }`}>{t.weightCardDesc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form panel */}
        <div id="card-weight-calc-form" className={`border rounded-3xl p-6 shadow-xl ${
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
                  ? 'bg-slate-950 border-slate-800 focus-within:border-amber-500'
                  : 'bg-slate-50 border-slate-200 focus-within:border-amber-500 focus-within:bg-white'
              }`}>
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${
                  themeMode === 'dark' ? 'text-slate-400' : 'text-slate-800'
                }`}>₹</span>
                <input
                  type="number"
                  step="any"
                  id="input-weight-price"
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

            <div>
              <label className={`block text-xs font-black mb-2 uppercase tracking-wider ${
                themeMode === 'dark' ? 'text-slate-400' : 'text-slate-700'
              }`}>
                {t.amountToPay}
              </label>
              <div className={`relative rounded-2xl border transition-all p-1 focus-within:ring-2 focus-within:ring-indigo-500/10 ${
                themeMode === 'dark'
                  ? 'bg-slate-950 border-slate-800 focus-within:border-amber-500'
                  : 'bg-slate-50 border-slate-200 focus-within:border-amber-500 focus-within:bg-white'
              }`}>
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${
                  themeMode === 'dark' ? 'text-slate-400' : 'text-slate-800'
                }`}>₹</span>
                <input
                  type="number"
                  step="any"
                  id="input-weight-amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t.enterAmount}
                  className={`w-full bg-transparent p-3 pl-8 text-xl font-display font-black outline-none placeholder:font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    themeMode === 'dark'
                      ? 'text-slate-100 placeholder:text-slate-600'
                      : 'text-slate-900 placeholder:text-slate-400'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Quick quick buttons block */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleClear}
                id="btn-weight-clear"
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
                id="btn-weight-calculate"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-450 active:scale-[0.98] text-slate-950 font-black transition-all shadow-md shadow-amber-500/10 text-sm"
              >
                <Scale className="w-4 h-4 stroke-[2.5]" />
                {t.calculate}
              </button>
            </div>
          </form>
        </div>

        {/* Results Panel */}
        <div id="card-weight-calc-results" className={`border rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[280px] ${
          themeMode === 'dark'
            ? 'bg-slate-900 border-slate-800/80 shadow-black/40'
            : 'bg-white border-slate-200'
        }`}>
          {resultG !== null && resultKg !== null ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6 flex-1 flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider rounded-full mb-3 border border-amber-500/10">
                  {t.weightResult}
                </span>
                <p className={`text-xs font-bold tracking-wide ${
                  themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {t.calculatedWeight}
                </p>
                
                {/* Visual Weight Board with BIG BOLD digits */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className={`p-4 rounded-2xl text-center border ${
                    themeMode === 'dark'
                      ? 'bg-slate-950 border-slate-800/60'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="block text-4.5xl font-display font-black text-amber-600 dark:text-amber-400 tracking-tight leading-none mb-1">
                      {resultKg}
                    </span>
                    <span className={`text-xs font-black uppercase tracking-widest ${
                      themeMode === 'dark' ? 'text-slate-500' : 'text-slate-600'
                    }`}>
                      {t.kg}
                    </span>
                  </div>
                  <div className={`p-4 rounded-2xl text-center border ${
                    themeMode === 'dark'
                      ? 'bg-slate-950 border-slate-800/60'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="block text-4.5xl font-display font-black text-indigo-600 dark:text-indigo-400 tracking-tight leading-none mb-1">
                      {resultG}
                    </span>
                    <span className={`text-xs font-black uppercase tracking-widest ${
                      themeMode === 'dark' ? 'text-slate-500' : 'text-slate-600'
                    }`}>
                      {t.gram}
                    </span>
                  </div>
                </div>

                {/* Info Recipe */}
                <div className={`mt-4 p-3 rounded-xl text-xs font-mono font-bold flex justify-between border ${
                  themeMode === 'dark'
                    ? 'bg-slate-950/50 border-slate-850 text-slate-400'
                    : 'bg-slate-50 border-slate-150 text-slate-650'
                }`}>
                  <span>Rate: ₹{price}/kg</span>
                  <span>Spent: ₹{amount}</span>
                </div>
              </div>

              {/* Share & Copy button layer */}
              <div className={`grid grid-cols-2 gap-3 pt-6 border-t ${
                themeMode === 'dark' ? 'border-slate-800/60' : 'border-slate-150'
              }`}>
                <button
                  type="button"
                  onClick={handleCopy}
                  id="btn-weight-copy"
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
                  id="btn-weight-share"
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
              <Scale className={`${
                themeMode === 'dark' ? 'text-slate-800' : 'text-slate-300'
              } w-12 h-12 stroke-[1.5] mb-3 animate-pulse`} />
              <p className={`text-sm font-black ${
                themeMode === 'dark' ? 'text-slate-400' : 'text-slate-700'
              }`}>
                {language === 'hi' ? 'सामान का रेट और रूपये डालें' : 'Enter rate & cash amount to calculate quantity'}
              </p>
              <p className={`text-xs mt-1 max-w-[200px] font-bold ${
                themeMode === 'dark' ? 'text-slate-600' : 'text-slate-500'
              }`}>
                {language === 'hi' ? 'हिसाब के बटन पर क्लिक करें' : 'Click the calculate button to see metrics'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
