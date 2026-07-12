/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Sun, Moon, Languages, Star, Share2, ArrowLeft, ClipboardCheck, Info, Sparkles, Crown, Check, Zap, ShieldAlert } from 'lucide-react';
import { LanguagePack, ThemeMode, Language } from '../types';
import { safeCopyToClipboard } from '../utils';

interface SettingsScreenProps {
  key?: string;
  t: LanguagePack;
  language: Language;
  themeMode: ThemeMode;
  onChangeLanguage: (lang: Language) => void;
  onChangeTheme: (theme: ThemeMode) => void;
  onBack: () => void;
  isPremium: boolean;
  onUpgradePremium: (status: boolean) => void;
}

export default function SettingsScreen({
  t,
  language,
  themeMode,
  onChangeLanguage,
  onChangeTheme,
  onBack,
  isPremium,
  onUpgradePremium,
}: SettingsScreenProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [ratingStars, setRatingStars] = useState<number | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleShareApp = () => {
    const textToShare = t.shareAppMessage;
    if (navigator.share) {
      navigator.share({
        title: t.appTitle,
        text: textToShare,
        url: window.location.href,
      }).catch(() => {
        safeCopyToClipboard(textToShare);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      });
    } else {
      safeCopyToClipboard(textToShare);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleRate = (stars: number) => {
    setRatingStars(stars);
    setRatingSubmitted(true);
    // Redirect to Play Store after 1.2 seconds to allow the success message to be visible
    setTimeout(() => {
      setRatingSubmitted(false);
      try {
        window.open('https://play.google.com/store/apps/details?id=com.vyapartaraju', '_blank');
      } catch (err) {
        console.error('Failed to open play store link:', err);
      }
    }, 1200);
  };

  const handleSubscribe = () => {
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      onUpgradePremium(true);
      setShowSuccessMessage(true);
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((freq, index) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.1);
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime + index * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + index * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + index * 0.1);
          osc.stop(audioCtx.currentTime + index * 0.1 + 0.5);
        });
      } catch (err) {
        console.error(err);
      }
    }, 1500);
  };

  const isDark = themeMode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 max-w-md mx-auto"
    >
      {/* Header back navigation */}
      <div className="flex items-center space-x-3 mb-2">
        <button
          onClick={onBack}
          id="btn-back-settings"
          className={`p-2.5 rounded-full border transition-all ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className={`text-xl font-display font-bold flex items-center gap-2 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            <Settings className="w-5 h-5 text-indigo-500 animate-spin-slow" />
            {t.settingsTitle}
          </h2>
          <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t.settingsDesc}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Theme Settings Panel */}
        <div 
          id="settings-theme-panel" 
          className={`p-5 rounded-3xl space-y-3.5 border shadow-xl transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <label className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {isDark ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            {t.themeSetting}
          </label>
          <div className={`grid grid-cols-2 gap-2 p-1 rounded-2xl border transition-colors ${
            isDark ? 'bg-slate-950 border-slate-850' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              id="settings-theme-dark"
              onClick={() => onChangeTheme('dark')}
              className={`flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all ${
                isDark
                  ? 'bg-slate-800 text-amber-400 border border-slate-700/60 shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Moon className="w-4 h-4" />
              {language === 'hi' ? 'डार्क थीम' : 'Dark Mode'}
            </button>
            <button
              type="button"
              id="settings-theme-light"
              onClick={() => onChangeTheme('light')}
              className={`flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all ${
                !isDark
                  ? 'bg-white text-indigo-600 border border-slate-200 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Sun className="w-4 h-4" />
              {language === 'hi' ? 'लाइट थीम' : 'Light Mode'}
            </button>
          </div>
        </div>

        {/* Language Settings Panel */}
        <div 
          id="settings-lang-panel" 
          className={`p-5 rounded-3xl space-y-3.5 border shadow-xl transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <label className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <Languages className="w-3.5 h-3.5 text-indigo-500" />
            {t.langSetting}
          </label>
          <div className={`grid grid-cols-2 gap-2 p-1 rounded-2xl border transition-colors ${
            isDark ? 'bg-slate-950 border-slate-850' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              id="settings-lang-hi"
              onClick={() => onChangeLanguage('hi')}
              className={`py-3 text-sm font-semibold rounded-xl transition-all ${
                language === 'hi'
                  ? isDark
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-md'
                    : 'bg-white text-indigo-600 border border-indigo-200 shadow-sm'
                  : isDark
                    ? 'text-slate-500 hover:text-slate-300'
                    : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              हिन्दी (Hindi)
            </button>
            <button
              type="button"
              id="settings-lang-en"
              onClick={() => onChangeLanguage('en')}
              className={`py-3 text-sm font-semibold rounded-xl transition-all ${
                language === 'en'
                  ? isDark
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-md'
                    : 'bg-white text-indigo-600 border border-indigo-200 shadow-sm'
                  : isDark
                    ? 'text-slate-500 hover:text-slate-300'
                    : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Rate Utility Panel */}
        <div 
          id="settings-rating-panel" 
          className={`p-5 rounded-3xl space-y-4 border shadow-xl relative overflow-hidden transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <h3 className={`text-sm font-bold font-display ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {t.rateApp}
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {language === 'hi' ? 'हमें फीडबैक देकर सुधार करने में मदद करें' : 'Help us scale & support local merchants'}
              </p>
            </div>
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>

          {ratingSubmitted ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-500/15 border border-emerald-500/20 rounded-xl p-3 text-center"
            >
              <p className="text-xs text-emerald-500 font-semibold">
                ⭐️ {t.rateAppMessage} ({ratingStars} Stars)
              </p>
            </motion.div>
          ) : (
            <div id="stars-row" className="flex items-center justify-center gap-2.5 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  className="group relative focus:outline-none transition-transform active:scale-90"
                  title={`Rate ${star} Stars`}
                >
                  <Star className={`w-8 h-8 hover:scale-110 active:scale-95 transition-all fill-transparent group-hover:fill-amber-500/20 group-hover:text-amber-500 ${
                    isDark ? 'text-slate-700' : 'text-slate-300'
                  }`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Premium Subscription Panel */}
        <div 
          id="settings-premium-panel" 
          className={`p-5 rounded-3xl border space-y-4 shadow-xl transition-all ${
            isPremium 
              ? isDark
                ? 'bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-slate-900 border-amber-500/30'
                : 'bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-white border-amber-500/30 shadow-md'
              : isDark
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className={`flex items-center justify-between pb-2 border-b ${
            isDark ? 'border-slate-800/80' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl shrink-0 ${
                isPremium 
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 animate-pulse' 
                  : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
              }`}>
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-sm font-black font-display flex items-center gap-1.5 ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  {language === 'hi' ? 'व्यापार प्रीमियम प्रो' : 'Vyapar Premium Pro'}
                  {isPremium && (
                    <span className="text-[9px] bg-amber-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      {language === 'hi' ? 'सक्रिय' : 'Active'}
                    </span>
                  )}
                </h3>
                <p className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isPremium 
                    ? (language === 'hi' ? 'असीमित एक्सेस अनलॉक है' : 'Unlimited developer perks unlocked')
                    : (language === 'hi' ? 'नो-ऐड्स और प्रो फीचर्स' : 'Ad-free and pro-merchant utility toolkit')
                  }
                </p>
              </div>
            </div>
            {!isPremium && (
              <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-400/20 px-2 py-0.5 rounded-lg">
                {language === 'hi' ? 'ऑफर चालू' : 'PRO SALE'}
              </span>
            )}
          </div>

          {/* If NOT Premium - Show plans and benefits */}
          {!isPremium ? (
            <div className="space-y-4">
              {/* Value features grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-semibold">
                <div className="flex items-start gap-2">
                  <div className={`p-0.5 rounded-full shrink-0 mt-0.5 ${
                    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className={`font-extrabold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {language === 'hi' ? '🚫 कोई विज्ञापन नहीं (No Ads)' : '🚫 100% Ad-Free'}
                    </span>
                    <span className={`text-[10px] block font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {language === 'hi' ? 'बिना रुकावट के तेज़ी से काम करें' : 'Zero interruptions or banner popups'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className={`p-0.5 rounded-full shrink-0 mt-0.5 ${
                    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className={`font-extrabold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {language === 'hi' ? '📊 एक्सेल/CSV एक्सपोर्ट' : '📊 Excel/CSV Export'}
                    </span>
                    <span className={`text-[10px] block font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {language === 'hi' ? 'खाता बही का डेटा डाउनलोड करें' : 'Direct spreadsheet downloads for accounting'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className={`p-0.5 rounded-full shrink-0 mt-0.5 ${
                    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className={`font-extrabold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {language === 'hi' ? '⚡ असीमित हिसाब-किताब' : '⚡ Unlimited Log Store'}
                    </span>
                    <span className={`text-[10px] block font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {language === 'hi' ? '20 से अधिक लॉग सुरक्षित रखें' : 'Store endless records with zero constraints'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className={`p-0.5 rounded-full shrink-0 mt-0.5 ${
                    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className={`font-extrabold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {language === 'hi' ? '🧾 डिजिटल रसीद जेनरेटर' : '🧾 Digital Invoice Pro'}
                    </span>
                    <span className={`text-[10px] block font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {language === 'hi' ? 'दुकान के नाम के साथ बिल भेजें' : 'Generate neat customer bills with shop name'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className={`p-0.5 rounded-full shrink-0 mt-0.5 ${
                    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className={`font-extrabold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {language === 'hi' ? '🔄 सुरक्षित क्लाउड सिंक' : '🔄 Offline + Cloud Sync'}
                    </span>
                    <span className={`text-[10px] block font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {language === 'hi' ? 'फोन बदलने पर भी डेटा सुरक्षित' : 'Keep data synced across dual merchant phones'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className={`p-0.5 rounded-full shrink-0 mt-0.5 ${
                    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className={`font-extrabold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {language === 'hi' ? '👑 गोल्डन वीआईपी बैज' : '👑 VIP Store Badge'}
                    </span>
                    <span className={`text-[10px] block font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {language === 'hi' ? 'दुकानदारों के लिए वीआईपी प्रोफाइल' : 'Exclusive golden crown in reports'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Plans toggles */}
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                {/* Monthly Plan */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan('monthly')}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                    selectedPlan === 'monthly'
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : isDark
                        ? 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300'
                  }`}
                >
                  <span className={`block text-[11px] font-black uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-550'}`}>
                    {language === 'hi' ? 'मासिक (Monthly)' : 'Monthly Plan'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-xl font-black ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>₹19</span>
                    <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/mo</span>
                  </div>
                  <span className="block text-[9px] text-indigo-500 font-bold mt-1.5">
                    {language === 'hi' ? 'बेसिक ट्रायल' : 'Ideal for testing'}
                  </span>
                  {selectedPlan === 'monthly' && (
                    <div className="absolute right-3 top-3 w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-slate-950' : 'bg-white'}`} />
                    </div>
                  )}
                </button>

                {/* Yearly Plan */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan('yearly')}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                    selectedPlan === 'yearly'
                      ? 'border-amber-500 bg-amber-500/10'
                      : isDark
                        ? 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300'
                  }`}
                >
                  {/* Save badge */}
                  <div className="absolute -right-7 -top-1 bg-amber-500 text-slate-950 text-[8px] font-black py-1 px-8 rotate-[25deg] tracking-wider shadow-sm">
                    {language === 'hi' ? 'बचत 35%' : 'SAVE 35%'}
                  </div>

                  <span className={`block text-[11px] font-black uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-550'}`}>
                    {language === 'hi' ? 'वार्षिक (Yearly)' : 'Yearly Plan'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-xl font-black ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>₹149</span>
                    <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/yr</span>
                  </div>
                  <span className="block text-[9px] text-amber-500 font-bold mt-1.5">
                    {language === 'hi' ? '₹12/महीना (बेस्ट वैल्यू)' : '₹12/mo (Most Popular)'}
                  </span>
                  {selectedPlan === 'yearly' && (
                    <div className="absolute right-3 top-3 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-slate-950' : 'bg-white'}`} />
                    </div>
                  )}
                </button>
              </div>

              {/* Subscribe button */}
              {showSuccessMessage ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-center text-xs font-black text-emerald-400 flex items-center justify-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-amber-400 animate-spin" />
                  {language === 'hi' ? 'बधाई हो! व्यापार प्रीमियम सक्रिय हो गया है!' : 'Congratulations! Premium status is now Active!'}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:from-slate-850 disabled:to-slate-850 text-slate-950 text-sm font-black rounded-xl transition-all shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {isSubscribing ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      {language === 'hi' ? 'सुरक्षित गेटवे लोड हो रहा है...' : 'Connecting Secure Gateway...'}
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 stroke-[2.5]" />
                      {language === 'hi' 
                        ? `प्रीमियम सक्रिय करें (${selectedPlan === 'monthly' ? '₹19' : '₹149'})` 
                        : `Activate Premium Now (${selectedPlan === 'monthly' ? '₹19' : '₹149'})`
                      }
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            /* If IS Premium - Show active status card */
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl space-y-3.5 border ${
                isDark 
                  ? 'bg-amber-500/10 border-amber-500/25' 
                  : 'bg-amber-50/50 border-amber-500/30'
              }`}>
                <div className="flex items-start gap-2.5">
                  <div className={`p-1 rounded-full shrink-0 ${
                    isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-black uppercase tracking-wider ${
                      isDark ? 'text-slate-100' : 'text-amber-950'
                    }`}>
                      {language === 'hi' ? 'प्रीमियम मेंबरशिप सक्रिय है' : 'Your Pro Membership is Active'}
                    </h4>
                    <p className={`text-[10px] leading-relaxed mt-1 font-medium ${
                      isDark ? 'text-slate-400' : 'text-amber-900/85'
                    }`}>
                      {language === 'hi' 
                        ? 'असीमित बहीखाता, नो-ऐड्स और प्रो बिल शेयरिंग का भरपूर लाभ उठाएं।' 
                        : 'Enjoy unlimited bookkeeping, zero advertisements, and customized invoicing tools.'}
                     </p>
                  </div>
                </div>

                <div className={`flex items-center justify-between text-[10px] font-bold border-t pt-3 ${
                  isDark ? 'text-slate-400 border-amber-500/10' : 'text-amber-900/75 border-amber-500/15'
                }`}>
                  <span>
                    {language === 'hi' ? 'सक्रिय प्लान:' : 'Active Plan:'} <strong className={isDark ? 'text-amber-400' : 'text-amber-700'}>{selectedPlan === 'yearly' ? (language === 'hi' ? '₹149 वार्षिक' : '₹149 Annual') : (language === 'hi' ? '₹19 मासिक' : '₹19 Monthly')}</strong>
                  </span>
                  <span>
                    {language === 'hi' ? 'ऑटो-नवीनीकरण: बंद' : 'Auto-Renew: Off'}
                  </span>
                </div>
              </div>

              {/* Demo cancel feature so they can cycle and re-test membership */}
              <button
                type="button"
                onClick={() => {
                  onUpgradePremium(false);
                  setShowSuccessMessage(false);
                }}
                className={`w-full py-2 text-[10px] font-black rounded-lg transition-all border active:scale-95 ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-rose-400 border-slate-800/80'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-rose-600 border-slate-200'
                }`}
              >
                {language === 'hi' ? 'मेंबरशिप रद्द करें (वापस टेस्ट करने के लिए)' : 'Cancel Membership (To test cycle again)'}
              </button>
            </div>
          )}
        </div>

        {/* Social interactions (Share) */}
        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            id="settings-share-btn"
            onClick={handleShareApp}
            className={`flex items-center justify-between p-4 active:scale-[0.99] border rounded-2xl transition-all text-left ${
              isDark
                ? 'bg-violet-600/10 hover:bg-violet-600/15 border-violet-500/20 hover:border-violet-500/30 text-violet-300'
                : 'bg-violet-50 hover:bg-violet-100 border-violet-200 text-violet-950 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`p-2.5 rounded-xl ${
                isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600'
              }`}>
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <span className={`block text-sm font-semibold font-display ${isDark ? 'text-violet-100' : 'text-violet-900'}`}>
                  {t.shareApp}
                </span>
                <span className={`block text-xs mt-0.5 ${isDark ? 'text-violet-400/80' : 'text-violet-700/90'}`}>
                  {language === 'hi' ? 'मित्रों को साझा करें' : 'Click to send copyable promotional invite link'}
                </span>
              </div>
            </div>
            <div className={`text-xs px-2.5 py-1 rounded-md font-bold ${
              isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-750'
            }`}>
              {copiedLink ? <ClipboardCheck className="w-3.5 h-3.5 text-emerald-500" /> : 'SEND'}
            </div>
          </button>
        </div>

        {/* Description credit card */}
        <div className={`border rounded-2xl p-4 flex items-start gap-3 ${
          isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}>
          <Info className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.aboutDeveloper}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
export type { Language };
