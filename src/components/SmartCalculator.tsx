/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator as CalcIcon, RotateCcw, Copy, ClipboardCheck, ArrowLeft, Delete } from 'lucide-react';
import { LanguagePack, HistoryItem } from '../types';
import { safeCopyToClipboard } from '../utils';

interface SmartCalculatorProps {
  key?: string;
  t: LanguagePack;
  language: 'en' | 'hi';
  onAddHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  onBack: () => void;
  themeMode: 'light' | 'dark';
}

export default function SmartCalculator({ t, language, onAddHistory, onBack, themeMode }: SmartCalculatorProps) {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [copied, setCopied] = useState(false);
  const [isEvaluated, setIsEvaluated] = useState(false);

  const calculateSafe = (expr: string): string => {
    // Sanitizes and safely computes simple arithmetic
    try {
      // Normalize operators
      let sanitized = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\s+/g, '');

      if (!sanitized) return '0';

      // Let's resolve percentage expressions like: A + B% or A - B% or just A * B%
      // E.g., "100 - 10%" -> "100 - (100 * 0.10)"
      // Let's find patterns in our arithmetic:
      // Pattern: (number)(operator)(percentage)%
      // E.g. "100-10%"
      const additionSubstReg = /(\d+(?:\.\d+)?)([+-])(\d+(?:\.\d+)?)%/g;
      sanitized = sanitized.replace(additionSubstReg, (_, base, op, percent) => {
        const val = parseFloat(base) * (parseFloat(percent) / 100);
        return `${base}${op}${val}`;
      });

      // Also replace standalone like: "200*10%" -> "200*0.1" or "10%" -> "0.1"
      sanitized = sanitized.replace(/(\d+(?:\.\d+)?)%/g, (_, val) => {
        return (parseFloat(val) / 100).toString();
      });

      // Safe clean character test
      if (!/^[0-9+\-*/().\s]+$/.test(sanitized)) {
        return 'Error';
      }

      // Safe evaluation using Function constructor (equivalent to sandboxed math)
      // Since sanitized has been strictly filtered, this is extremely safe.
      const evaluated = new Function(`return (${sanitized})`)();
      if (evaluated === undefined || isNaN(evaluated) || !isFinite(evaluated)) {
        return 'Error';
      }

      // Limit decimals to 4 for clean displaying
      return Math.round(evaluated * 10000) / 10000 + '';
    } catch {
      return 'Error';
    }
  };

  const handleKeyPress = (val: string) => {
    setCopied(false);

    if (isEvaluated) {
      // If we previously computed standard response, hitting an operator continues it.
      // Hitting a number starts fresh.
      setIsEvaluated(false);
      if (['+', '-', '×', '÷', '%'].includes(val)) {
        setExpression((prev) => prev + ' ' + val + ' ');
        return;
      } else {
        setExpression(val);
        return;
      }
    }

    if (val === 'C') {
      setExpression('');
      setResult('0');
    } else if (val === 'DEL') {
      setExpression((prev) => {
        const trimmed = prev.trim();
        if (trimmed.length <= 1) {
          return '';
        }
        // if trailing is a space-separated operator, delete it along with spaces
        if (prev.endsWith(' ')) {
          return prev.substring(0, prev.length - 3);
        }
        return prev.substring(0, prev.length - 1);
      });
    } else if (val === '=') {
      if (!expression) return;
      const resVal = calculateSafe(expression);
      setResult(resVal);
      setIsEvaluated(true);

      if (resVal !== 'Error') {
        onAddHistory({
          type: 'calculator',
          inputDescription: expression,
          formulaDescription: `= ${resVal}`,
          result: resVal,
          rawDetails: { expression }
        });
      }
    } else if (['+', '-', '×', '÷'].includes(val)) {
      // avoid multiple concurrent operators
      setExpression((prev) => {
        let trimmed = prev.trim();
        if (!trimmed) {
          if (val === '-') return '-';
          return '';
        }
        const lastChar = trimmed.charAt(trimmed.length - 1);
        if (['+', '-', '×', '÷'].includes(lastChar)) {
          // swap operator
          return trimmed.substring(0, trimmed.length - 1) + val + ' ';
        }
        return prev + ' ' + val + ' ';
      });
    } else {
      setExpression((prev) => prev + val);
    }
  };

  const handleCopy = () => {
    if (!result || result === 'Error') return;
    const shareText = expression ? `${expression} = ${result}` : result;
    safeCopyToClipboard(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 max-w-md mx-auto"
    >
      {/* Header back navigation */}
      <div className="flex items-center space-x-3 mb-2">
        <button
          onClick={onBack}
          id="btn-back-calc"
          className={`p-2.5 rounded-full border transition-colors ${
            themeMode === 'dark'
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700/50 text-slate-300 hover:text-white'
              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className={`text-xl font-display font-black flex items-center gap-2 ${
            themeMode === 'dark' ? 'text-slate-100' : 'text-slate-905'
          }`}>
            <CalcIcon className="w-5 h-5 text-indigo-500" />
            {t.calcCardTitle}
          </h2>
          <p className={`text-xs font-bold ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.calcCardDesc}
          </p>
        </div>
      </div>

      {/* Calculator Screen Frame */}
      <div id="calculator-viewport" className={`border p-6 rounded-3xl shadow-2xl space-y-4 ${
        themeMode === 'dark'
          ? 'bg-slate-950 border-slate-800/80 shadow-black'
          : 'bg-white border-slate-200/90 shadow-slate-200'
      }`}>
        {/* Digital display area */}
        <div className={`p-5 rounded-2xl flex flex-col justify-end items-end min-h-[110px] space-y-2 relative overflow-hidden border ${
          themeMode === 'dark'
            ? 'bg-slate-900 border-slate-850'
            : 'bg-slate-100 border-slate-200/80'
        }`}>
          {/* Accent decoration for visual focus */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none" />
          
          <div className={`font-mono text-sm tracking-wide font-bold break-all max-w-full text-right h-6 select-all ${
            themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {expression || ' '}
          </div>
          
          <div className={`text-4.5xl font-display font-extrabold font-mono tracking-tight break-all max-w-full text-right overflow-x-auto ${
            themeMode === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
          }`}>
            {result}
          </div>
        </div>

        {/* Copy tool layer */}
        <div className="flex justify-end pr-1">
          <button
            type="button"
            id="btn-calc-copy"
            onClick={handleCopy}
            disabled={result === 'Error' || result === '0'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg disabled:opacity-35 transition-all font-black uppercase tracking-wider border ${
              themeMode === 'dark'
                ? 'bg-slate-900 hover:bg-slate-850 hover:text-slate-200 border-slate-800 text-slate-400'
                : 'bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border-slate-200 text-slate-700'
            }`}
          >
            {copied ? (
              <>
                <ClipboardCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">{t.copied || 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 opacity-80" />
                <span>{t.copyResult}</span>
              </>
            )}
          </button>
        </div>

        {/* Button Keyboard Grid matching requirements: 0-9, +, -, *, /, %, ., = */}
        <div id="calculator-keyboard" className="grid grid-cols-4 gap-3">
          {/* Row 1: Clear, DEL, % , / */}
          <button
            type="button"
            id="btn-key-clear"
            onClick={() => handleKeyPress('C')}
            className={`p-4 rounded-2xl font-display font-black text-2xl transition-all active:scale-95 border ${
              themeMode === 'dark'
                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20'
                : 'bg-amber-100 hover:bg-amber-150 text-amber-700 border-amber-200'
            }`}
          >
            C
          </button>
          <button
            type="button"
            id="btn-key-del"
            onClick={() => handleKeyPress('DEL')}
            className={`p-4 rounded-2xl font-display font-black text-2xl flex items-center justify-center transition-all active:scale-95 border ${
              themeMode === 'dark'
                ? 'bg-slate-900 hover:bg-slate-850 text-rose-400 border-slate-800'
                : 'bg-slate-100 hover:bg-slate-200 text-rose-650 border-slate-200'
            }`}
            aria-label="Delete last"
          >
            <Delete className="w-6 h-6 stroke-[2.5]" />
          </button>
          <button
            type="button"
            id="btn-key-percent"
            onClick={() => handleKeyPress('%')}
            className={`p-4 rounded-2xl font-display font-black text-2xl transition-all active:scale-95 border ${
              themeMode === 'dark'
                ? 'bg-slate-900 hover:bg-slate-850 text-indigo-400 border-slate-800'
                : 'bg-slate-100 hover:bg-slate-200 text-indigo-650 border-slate-200'
            }`}
          >
            %
          </button>
          <button
            type="button"
            id="btn-key-divide"
            onClick={() => handleKeyPress('÷')}
            className="p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-black text-3xl transition-all active:scale-95 shadow-md shadow-indigo-600/10"
          >
            ÷
          </button>

          {/* Row 2: 7, 8, 9, * */}
          <button
            type="button"
            onClick={() => handleKeyPress('7')}
            className={`p-4 rounded-2xl font-display font-black text-3.5xl transition-all active:scale-95 border ${
              themeMode === 'dark'
                ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-100 border-slate-850'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200/60'
            }`}
          >
            7
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('8')}
            className={`p-4 rounded-2xl font-display font-black text-3.5xl transition-all active:scale-95 border ${
              themeMode === 'dark'
                ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-100 border-slate-850'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200/60'
            }`}
          >
            8
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('9')}
            className={`p-4 rounded-2xl font-display font-black text-3.5xl transition-all active:scale-95 border ${
              themeMode === 'dark'
                ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-100 border-slate-850'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200/60'
            }`}
          >
            9
          </button>
          <button
            type="button"
            id="btn-key-multiply"
            onClick={() => handleKeyPress('×')}
            className="p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-black text-3xl transition-all active:scale-95 shadow-md shadow-indigo-600/10"
          >
            ×
          </button>

          {/* Row 3: 4, 5, 6, - */}
          <button
            type="button"
            onClick={() => handleKeyPress('4')}
            className={`p-4 rounded-2xl font-display font-black text-3.5xl transition-all active:scale-95 border ${
              themeMode === 'dark'
                ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-100 border-slate-850'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200/60'
            }`}
          >
            4
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('5')}
            className={`p-4 rounded-2xl font-display font-black text-3.5xl transition-all active:scale-95 border ${
              themeMode === 'dark'
                ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-100 border-slate-850'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200/60'
            }`}
          >
            5
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('6')}
            className={`p-4 rounded-2xl font-display font-black text-3.5xl transition-all active:scale-95 border ${
              themeMode === 'dark'
                ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-100 border-slate-850'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200/60'
            }`}
          >
            6
          </button>
          <button
            type="button"
            id="btn-key-minus"
            onClick={() => handleKeyPress('-')}
            className="p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-black text-3xl transition-all active:scale-95 shadow-md shadow-indigo-600/10"
          >
            -
          </button>

          {/* Row 4: 1, 2, 3, + */}
          <button
            type="button"
            onClick={() => handleKeyPress('1')}
            className={`p-4 rounded-2xl font-display font-black text-3.5xl transition-all active:scale-95 border ${
              themeMode === 'dark'
                ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-100 border-slate-850'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200/60'
            }`}
          >
            1
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('2')}
            className={`p-4 rounded-2xl font-display font-black text-3.5xl transition-all active:scale-95 border ${
              themeMode === 'dark'
                ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-100 border-slate-850'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200/60'
            }`}
          >
            2
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('3')}
            className={`p-4 rounded-2xl font-display font-black text-3.5xl transition-all active:scale-95 border ${
              themeMode === 'dark'
                ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-100 border-slate-850'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200/60'
            }`}
          >
            3
          </button>
          <button
            type="button"
            id="btn-key-plus"
            onClick={() => handleKeyPress('+')}
            className="p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-black text-3xl transition-all active:scale-95 shadow-md shadow-indigo-600/10"
          >
            +
          </button>

          {/* Row 5: 0, ., Equals */}
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className={`p-4 rounded-2xl font-display font-black text-3.5xl transition-all active:scale-95 border col-span-2 ${
              themeMode === 'dark'
                ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-100 border-slate-850'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200/60'
            }`}
          >
            0
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('.')}
            className={`p-4 rounded-2xl font-display font-black text-3.5xl transition-all active:scale-95 border ${
              themeMode === 'dark'
                ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-100 border-slate-850'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200/60'
            }`}
          >
            .
          </button>
          <button
            type="button"
            id="btn-key-equals"
            onClick={() => handleKeyPress('=')}
            className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-3.5xl transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            =
          </button>
        </div>
      </div>
    </motion.div>
  );
}
