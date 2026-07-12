/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { History, Trash2, Copy, ClipboardCheck, ArrowLeft, Scale, IndianRupee, Calculator, Clock } from 'lucide-react';
import { LanguagePack, HistoryItem } from '../types';
import { safeCopyToClipboard } from '../utils';

interface HistoryListProps {
  key?: string;
  t: LanguagePack;
  history: HistoryItem[];
  onClearHistory: () => void;
  onBack: () => void;
  themeMode: 'light' | 'dark';
  language: 'en' | 'hi';
}

export default function HistoryList({ t, history, onClearHistory, onBack, themeMode, language }: HistoryListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formatTime = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleCopy = (item: HistoryItem) => {
    let copyText = '';
    if (item.type === 'weight') {
      copyText = `${t.weightCardTitle}\n${item.inputDescription}\n${t.weightResult}: ${item.result}`;
    } else if (item.type === 'amount') {
      copyText = `${t.amountCardTitle}\n${item.inputDescription}\n${t.amountResult}: ${item.result}`;
    } else {
      copyText = `${t.calcCardTitle}\n${item.inputDescription} ${item.formulaDescription}`;
    }
    
    copyText += `\n\n-- ${t.appTitle} --`;

    safeCopyToClipboard(copyText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 max-w-2xl mx-auto"
    >
      {/* Header back navigation bar */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            id="btn-back-history"
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
              <History className="w-5 h-5 text-indigo-500" />
              {t.historyTitle}
            </h2>
            <p className={`text-xs font-bold ${
              themeMode === 'dark' ? 'text-slate-400' : 'text-slate-650'
            }`}>
              {language === 'hi' ? 'हाल की व्यावसायिक गणनाएं' : 'Recent business calculations'}
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            id="btn-clear-history-list"
            className={`flex items-center gap-1 px-3.5 py-2 text-xs font-black rounded-xl border transition-colors ${
              themeMode === 'dark'
                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/25'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
            }`}
          >
            <Trash2 className="w-4 h-4 stroke-[2.5]" />
            {t.clearHistory || 'Clear'}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={`border rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3 ${
          themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <History className={`w-12 h-12 stroke-[1.5] ${
            themeMode === 'dark' ? 'text-slate-850' : 'text-slate-300'
          }`} />
          <div>
            <p className={`text-base font-black ${
              themeMode === 'dark' ? 'text-slate-400' : 'text-slate-700'
            }`}>
              {language === 'hi' ? 'कोई पुराना हिसाब उपलब्ध नहीं है' : 'Calculations Ledger is Empty'}
            </p>
            <p className={`text-xs max-w-[280px] mx-auto mt-1 font-bold ${
              themeMode === 'dark' ? 'text-slate-600' : 'text-slate-500'
            }`}>
              {language === 'hi' 
                ? 'जब आप वजन या कीमत कैलकुलेटर का उपयोग करेंगे, तो वे यहाँ दिखाई लगेंगे।' 
                : 'Your weight and amount transactions will be listed here automatically.'}
            </p>
          </div>
        </div>
      ) : (
        <div id="ledgers-scroll" className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {history.map((item) => {
            const isWeight = item.type === 'weight';
            const isAmount = item.type === 'amount';

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-colors ${
                  themeMode === 'dark'
                    ? 'bg-slate-900 border-slate-850 hover:border-slate-800'
                    : 'bg-white border-slate-200 hover:border-slate-250 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Ledger avatar matching calculation category */}
                  <div className={`p-2.5 rounded-xl shrink-0 border ${
                    isWeight 
                      ? 'bg-amber-500/10 text-amber-550 dark:text-amber-400 border-amber-500/20' 
                      : isAmount 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                        : 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border-indigo-500/20'
                  }`}>
                    {isWeight && <Scale className="w-4.5 h-4.5 stroke-[2.5]" />}
                    {isAmount && <IndianRupee className="w-4.5 h-4.5 stroke-[2.5]" />}
                    {!isWeight && !isAmount && <Calculator className="w-4.5 h-4.5 stroke-[2.5]" />}
                  </div>

                  {/* Left content description */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs font-black uppercase tracking-wider ${
                        themeMode === 'dark' ? 'text-slate-400' : 'text-slate-700'
                      }`}>
                        {isWeight ? t.weightCardTitle : isAmount ? t.amountCardTitle : t.calcCardTitle}
                      </span>
                      <span className={`text-[10px] font-mono font-bold flex items-center gap-0.5 ${
                        themeMode === 'dark' ? 'text-slate-500' : 'text-slate-550'
                      }`}>
                        <Clock className="w-2.5 h-2.5" />
                        {formatTime(item.timestamp)}
                      </span>
                    </div>

                    <p className={`text-xs truncate max-w-[220px] font-bold ${
                      themeMode === 'dark' ? 'text-slate-350' : 'text-slate-600'
                    }`}>
                      {item.inputDescription}
                    </p>
                    <p className={`text-xs font-mono font-bold ${
                      themeMode === 'dark' ? 'text-slate-500' : 'text-slate-600'
                    }`}>
                      {item.formulaDescription}
                    </p>
                  </div>
                </div>

                {/* Right Result Badge + Copy button */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="text-right">
                    <span className={`block font-display font-extrabold text-base tracking-tight ${
                      isWeight ? 'text-amber-600 dark:text-amber-400' : isAmount ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {item.result}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className={`p-2 rounded-lg border transition-colors ${
                      themeMode === 'dark'
                        ? 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200'
                        : 'bg-slate-50 hover:bg-slate-150 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                    title={t.copyResult}
                  >
                    {copiedId === item.id ? (
                      <ClipboardCheck className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
