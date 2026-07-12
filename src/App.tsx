/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scale,
  IndianRupee,
  Calculator,
  Settings,
  History,
  TrendingUp,
  Award,
  BookOpen,
  Volume2,
  VolumeX,
  Crown,
  Sparkles,
} from 'lucide-react';

import { ActiveScreen, Language, ThemeMode, HistoryItem } from './types';
import { translations } from './translations';
import WeightCalculator from './components/WeightCalculator';
import AmountCalculator from './components/AmountCalculator';
import SmartCalculator from './components/SmartCalculator';
import HistoryList from './components/HistoryList';
import SettingsScreen from './components/SettingsScreen';
import { AdBanner } from './components/AdBanner';

export default function App() {
  // Persistence Loading
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('vt_language');
    return (saved === 'hi' || saved === 'en') ? saved : 'hi'; // Default to Hindi as specified for Kirana store users
  });

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('vt_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark'; // Dark theme default
  });

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem('vt_premium') === 'true';
  });

  const handleUpgradePremium = (status: boolean) => {
    setIsPremium(status);
    localStorage.setItem('vt_premium', String(status));
  };

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('vt_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const t = translations[language];

  // Helper to add log
  const handleAddHistory = (newItem: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const item: HistoryItem = {
      ...newItem,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      // Limit to 20 calculations as requested
      const updated = [item, ...prev].slice(0, 20);
      localStorage.setItem('vt_history', JSON.stringify(updated));
      return updated;
    });

    if (soundEnabled) {
      playClickSound();
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('vt_history');
  };

  const handleChangeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('vt_language', newLang);
  };

  const handleChangeTheme = (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
    localStorage.setItem('vt_theme', newTheme);
  };

  // Sound generator using Web Audio API to prevent heavy overhead or missing audio assets is extremely reliable & offline-safe!
  const playClickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime); // high click pitch
      oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // Ignored
    }
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 flex flex-col justify-between ${
        themeMode === 'dark' 
          ? 'bg-slate-950 text-slate-100' 
          : 'bg-slate-50 text-slate-900 light'
      }`}
    >
      {/* Visual background atmospheric effects for professional look */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0 opacity-40">
        <div className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] ${
          themeMode === 'dark' ? 'bg-indigo-600/10' : 'bg-indigo-500/5'
        }`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] ${
          themeMode === 'dark' ? 'bg-amber-500/5' : 'bg-amber-500/5'
        }`} />
      </div>

      {/* Main Frame Shell limiting wide screen stretch for desktop-first precision */}
      <main className="relative z-10 w-full max-w-lg mx-auto px-4 py-6 md:py-8 flex-1 flex flex-col justify-start">
        
        {/* APP HEADER */}
        <header id="main-app-header" className={`flex items-center justify-between mb-6 pb-4 border-b ${
          themeMode === 'dark' ? 'border-slate-800/40' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            {/* Custom vector weight scale logo */}
            <div className="bg-gradient-to-tr from-amber-500 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-600/10 shrink-0">
              <Scale className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className={`text-2xl font-display font-extrabold tracking-tight bg-clip-text text-transparent select-none drop-shadow-sm ${
                themeMode === 'dark' 
                  ? 'bg-gradient-to-r from-amber-400 via-indigo-200 to-white' 
                  : 'bg-gradient-to-r from-amber-600 via-indigo-600 to-slate-900'
              }`}>
                {t.appTitle}
              </h1>
              <p className={`text-[10px] font-bold tracking-wide ${
                themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {t.appSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick sound switch */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-colors ${
                themeMode === 'dark'
                  ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-800/50 text-slate-400'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
              }`}
              title="Sound FX Toggle"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Quick History Log view shortcut */}
            {activeScreen !== 'history' && (
              <button
                onClick={() => {
                  if (soundEnabled) playClickSound();
                  setActiveScreen(activeScreen === 'home' ? 'history' : 'home');
                }}
                id="header-btn-history"
                className={`p-2 rounded-xl border transition-all ${
                  activeScreen === 'home'
                    ? themeMode === 'dark'
                      ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-800/50 text-slate-300'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-750 shadow-sm'
                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-450 font-bold'
                }`}
                title="Ledger history"
              >
                <History className="w-4.5 h-4.5" />
              </button>
            )}

            {/* Quick home screen button when navigated */}
            {activeScreen !== 'home' && (
              <button
                onClick={() => {
                  if (soundEnabled) playClickSound();
                  setActiveScreen('home');
                }}
                id="header-btn-home"
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all uppercase tracking-wider ${
                  themeMode === 'dark'
                    ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-800/50 text-slate-300'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-750 shadow-sm'
                }`}
              >
                HOME
              </button>
            )}
          </div>
        </header>

        {/* SCREEN GATEWAY VIEWPORT */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            
            {/* SCREEN: HOME PANEL */}
            {activeScreen === 'home' && (
              <motion.div
                key="screen-home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* PREMIUM SUBSCRIPTION STATUS / PROMO BANNER */}
                <div 
                  onClick={() => {
                    if (soundEnabled) playClickSound();
                    setActiveScreen('settings');
                    // Scroll to settings premium section if possible after screen transition
                    setTimeout(() => {
                      document.getElementById('settings-premium-panel')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className={`p-4 rounded-3xl border flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] group ${
                    isPremium
                      ? 'bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-indigo-500/5 border-amber-500/30 hover:border-amber-500/40 shadow-lg shadow-amber-500/[0.02]'
                      : 'bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border-indigo-500/20 hover:border-indigo-500/30 shadow-lg shadow-indigo-500/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-2xl shrink-0 ${
                      isPremium 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20 animate-pulse' 
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      <Crown className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className={`text-xs font-black truncate ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>
                          {isPremium 
                            ? (language === 'hi' ? 'व्यापार प्रीमियम सदस्य सक्रिय है 👑' : 'Vyapar Premium Member Active 👑')
                            : (language === 'hi' ? 'प्रीमियम सक्रिय करें (No Ads & Pro Features)' : 'Upgrade to Premium (No Ads & Pro Features)')
                          }
                        </h4>
                      </div>
                      <p className={`text-[10px] leading-normal font-bold truncate ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'} mt-0.5`}>
                        {isPremium
                          ? (language === 'hi' ? 'सभी प्रीमियम टूल्स और नो-ऐड्स सक्रिय हैं' : 'All pro features unlocked')
                          : (language === 'hi' ? '🚫 कोई विज्ञापन नहीं • 📊 एक्सेल रिपोर्ट • ₹19/माह या ₹149/साल' : '🚫 Zero Ads • 📊 Excel Export • ₹19/mo or ₹149/yr')
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`px-3.5 py-2 text-[11px] font-black rounded-xl transition-all shrink-0 active:scale-95 flex items-center gap-1 ${
                      isPremium
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-slate-100 shadow-md shadow-indigo-500/10'
                    }`}
                  >
                    {isPremium 
                      ? (language === 'hi' ? 'प्रो देखें' : 'View Pro') 
                      : (language === 'hi' ? 'सक्रिय करें' : 'Unlock')
                    }
                  </button>
                </div>

                {/* 4 CARDS NAVIGATION GRID */}
                <div id="home-navigation-grid" className="grid grid-cols-2 gap-4">
                  
                  {/* CARD 1: Calculate Weight */}
                  <button
                    onClick={() => {
                      if (soundEnabled) playClickSound();
                      setActiveScreen('weight');
                    }}
                    id="card-nav-weight"
                    className={`group border p-5 rounded-3xl text-left transition-all active:scale-[0.98] flex flex-col justify-between min-h-[145px] hover:shadow-xl ${
                      themeMode === 'dark'
                        ? 'bg-slate-900 hover:bg-slate-850 border-slate-800/80 hover:border-amber-500/40 hover:shadow-amber-500/[0.02]'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-500/40 shadow-sm hover:shadow-amber-500/[0.04]'
                    }`}
                  >
                    <div className="p-3 bg-amber-500/10 border border-amber-500/15 text-amber-500 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors w-fit">
                      <Scale className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>
                    <div>
                      <h3 className={`text-base font-display font-extrabold transition-colors ${
                        themeMode === 'dark' ? 'text-slate-100 group-hover:text-amber-300' : 'text-slate-900 group-hover:text-amber-605'
                      }`}>
                        {t.weightCardTitle}
                      </h3>
                      <p className={`text-[11px] mt-1 leading-normal font-bold ${
                        themeMode === 'dark' ? 'text-slate-400' : 'text-slate-650'
                      }`}>
                        {t.weightCardDesc}
                      </p>
                    </div>
                  </button>

                  {/* CARD 2: Calculate Amount */}
                  <button
                    onClick={() => {
                      if (soundEnabled) playClickSound();
                      setActiveScreen('amount');
                    }}
                    id="card-nav-amount"
                    className={`group border p-5 rounded-3xl text-left transition-all active:scale-[0.98] flex flex-col justify-between min-h-[145px] hover:shadow-xl ${
                      themeMode === 'dark'
                        ? 'bg-slate-900 hover:bg-slate-850 border-slate-800/80 hover:border-emerald-500/40 hover:shadow-emerald-500/[0.02]'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-500/40 shadow-sm hover:shadow-emerald-500/[0.04]'
                    }`}
                  >
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 rounded-2xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors w-fit">
                      <IndianRupee className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>
                    <div>
                      <h3 className={`text-base font-display font-extrabold transition-colors ${
                        themeMode === 'dark' ? 'text-slate-100 group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-605'
                      }`}>
                        {t.amountCardTitle}
                      </h3>
                      <p className={`text-[11px] mt-1 leading-normal font-bold ${
                        themeMode === 'dark' ? 'text-slate-400' : 'text-slate-650'
                      }`}>
                        {t.amountCardDesc}
                      </p>
                    </div>
                  </button>

                  {/* CARD 3: Calculator */}
                  <button
                    onClick={() => {
                      if (soundEnabled) playClickSound();
                      setActiveScreen('calculator');
                    }}
                    id="card-nav-calc"
                    className={`group border p-5 rounded-3xl text-left transition-all active:scale-[0.98] flex flex-col justify-between min-h-[145px] hover:shadow-xl ${
                      themeMode === 'dark'
                        ? 'bg-slate-900 hover:bg-slate-850 border-slate-800/80 hover:border-indigo-500/40 hover:shadow-indigo-500/[0.02]'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-500/40 shadow-sm hover:shadow-indigo-500/[0.04]'
                    }`}
                  >
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 rounded-2xl group-hover:bg-indigo-50 group-hover:text-slate-950 transition-colors w-fit">
                      <Calculator className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>
                    <div>
                      <h3 className={`text-base font-display font-extrabold transition-colors ${
                        themeMode === 'dark' ? 'text-slate-100 group-hover:text-indigo-300' : 'text-slate-900 group-hover:text-indigo-605'
                      }`}>
                        {t.calcCardTitle}
                      </h3>
                      <p className={`text-[11px] mt-1 leading-normal font-bold ${
                        themeMode === 'dark' ? 'text-slate-400' : 'text-slate-650'
                      }`}>
                        {t.calcCardDesc}
                      </p>
                    </div>
                  </button>

                  {/* CARD 4: Settings */}
                  <button
                    onClick={() => {
                      if (soundEnabled) playClickSound();
                      setActiveScreen('settings');
                    }}
                    id="card-nav-settings"
                    className={`group border p-5 rounded-3xl text-left transition-all active:scale-[0.98] flex flex-col justify-between min-h-[145px] hover:shadow-xl ${
                      themeMode === 'dark'
                        ? 'bg-slate-900 hover:bg-slate-850 border-slate-800/80 hover:border-slate-600/40 hover:shadow-slate-500/[0.02]'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300/40 shadow-sm'
                    }`}
                  >
                    <div className="p-3 bg-slate-800 border border-slate-700 text-slate-400 rounded-2xl group-hover:bg-slate-100 group-hover:text-slate-950 transition-colors w-fit">
                      <Settings className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>
                    <div>
                      <h3 className={`text-base font-display font-extrabold transition-colors ${
                        themeMode === 'dark' ? 'text-slate-100 group-hover:text-slate-300' : 'text-slate-900 group-hover:text-slate-700'
                      }`}>
                        {t.settingsTitle}
                      </h3>
                      <p className={`text-[11px] mt-1 leading-normal font-bold ${
                        themeMode === 'dark' ? 'text-slate-400' : 'text-slate-650'
                      }`}>
                        {t.settingsDesc}
                      </p>
                    </div>
                  </button>

                </div>

                {/* HELPFUL KIRANA MERCHANT TIPS CAROUSEL */}
                <div className={`border p-5 rounded-3xl space-y-2 flex items-center gap-4 relative overflow-hidden select-none ${
                  themeMode === 'dark' 
                    ? 'bg-indigo-950/20 border-indigo-500/10' 
                    : 'bg-indigo-50/60 border-indigo-100 shadow-xs'
                }`}>
                  <div className="absolute right-[-10px] bottom-[-20px] pointer-events-none opacity-5">
                    <Scale className="w-32 h-32 text-indigo-400" />
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-black rounded uppercase tracking-wide mb-1.5 border border-indigo-500/10">
                      Merchant tip
                    </span>
                    <h4 className={`text-xs font-black ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>
                      {language === 'hi' 
                        ? 'तेज़ बिक्री के फायदे' 
                        : 'Speed up client queues'
                      }
                    </h4>
                    <p className={`text-[11px] leading-normal font-bold mt-1 ${
                      themeMode === 'dark' ? 'text-slate-450' : 'text-slate-650'
                    }`}>
                      {language === 'hi' 
                        ? 'भाव और वज़न कैलकुलेटर का इस्तेमाल करें। नतीजों को सीधा ख़रीद पर्ची में छापने या कॉपी करने के लिए "नतीजा कॉपी करें" सुविधा का उपयोग करें।' 
                        : 'Use instant Calculations. Double-tap results page icons to copy and dispatch quotes instantly to client bills or receipts.'
                      }
                    </p>
                  </div>
                </div>

                {/* QUICK RECENT LOGS SUMMARY */}
                <div id="logs-preview-panel" className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      themeMode === 'dark' ? 'text-slate-400' : 'text-slate-705'
                    }`}>
                      <TrendingUp className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      {language === 'hi' ? 'ताज़ा हिसाब' : 'Recent Ledger Logs'}
                    </span>
                    {history.length > 0 && (
                      <button
                        onClick={() => {
                          if (soundEnabled) playClickSound();
                          setActiveScreen('history');
                        }}
                        id="btn-see-all-history"
                        className="text-xs font-black text-indigo-500 hover:text-indigo-600 transition-colors hover:underline"
                      >
                        {language === 'hi' ? 'सभी देखें ›' : 'View All ›'}
                      </button>
                    )}
                  </div>

                  {history.length === 0 ? (
                    <div className={`border p-8 rounded-2xl text-center text-xs font-bold ${
                      themeMode === 'dark'
                        ? 'bg-slate-900/50 border-slate-800 text-slate-500'
                        : 'bg-white border-slate-200 text-slate-600 shadow-sm'
                    }`}>
                      {language === 'hi' ? 'हिसाब लगाते ही इतिहास यहाँ दिखाई देगा।' : 'Your calculation logs will build here.'}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {history.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-3.5 border rounded-2xl text-xs gap-3 ${
                            themeMode === 'dark'
                              ? 'bg-slate-900 border-slate-805 text-slate-300'
                              : 'bg-white border-slate-200 text-slate-850 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`block w-2.5 h-2.5 rounded-full ${
                              item.type === 'weight' ? 'bg-amber-505' : item.type === 'amount' ? 'bg-emerald-505' : 'bg-indigo-505'
                            }`} />
                            <p className="font-bold truncate max-w-[180px]">
                              {item.inputDescription}
                            </p>
                          </div>
                          <span className={`font-mono font-black shrink-0 text-sm ${
                            item.type === 'weight' 
                              ? 'text-amber-500' 
                              : item.type === 'amount' 
                                ? 'text-emerald-500' 
                                : 'text-indigo-500'
                          }`}>
                            {item.result}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* SCREEN: WEIGHT CALCULATOR */}
            {activeScreen === 'weight' && (
              <WeightCalculator
                key="screen-weight"
                t={t}
                language={language}
                onAddHistory={handleAddHistory}
                onBack={() => setActiveScreen('home')}
                themeMode={themeMode}
              />
            )}

            {/* SCREEN: AMOUNT CALCULATOR */}
            {activeScreen === 'amount' && (
              <AmountCalculator
                key="screen-amount"
                t={t}
                language={language}
                onAddHistory={handleAddHistory}
                onBack={() => setActiveScreen('home')}
                themeMode={themeMode}
              />
            )}

            {/* SCREEN: SMART CALCULATOR */}
            {activeScreen === 'calculator' && (
              <SmartCalculator
                key="screen-calc"
                t={t}
                language={language}
                onAddHistory={handleAddHistory}
                onBack={() => setActiveScreen('home')}
                themeMode={themeMode}
              />
            )}

            {/* SCREEN: LEDGER HISTORY */}
            {activeScreen === 'history' && (
              <HistoryList
                key="screen-history"
                t={t}
                history={history}
                onClearHistory={handleClearHistory}
                onBack={() => setActiveScreen('home')}
                themeMode={themeMode}
                language={language}
              />
            )}

            {/* SCREEN: SETTINGS */}
            {activeScreen === 'settings' && (
              <SettingsScreen
                key="screen-settings"
                t={t}
                language={language}
                themeMode={themeMode}
                onChangeLanguage={handleChangeLanguage}
                onChangeTheme={handleChangeTheme}
                onBack={() => setActiveScreen('home')}
                isPremium={isPremium}
                onUpgradePremium={handleUpgradePremium}
              />
            )}

          </AnimatePresence>
        </div>

      </main>

      {/* AD BLOCK FOR FREE PLAN USERS */}
      <AdBanner isPremium={isPremium} themeMode={themeMode} language={language} />

      {/* FOOTER COUNTER SERVICE NOTICE */}
      <footer className={`relative z-10 text-center py-4 text-[10px] tracking-wide select-none border-t ${
        themeMode === 'dark' ? 'border-slate-800/10 text-slate-500' : 'border-slate-200 text-slate-600'
      } max-w-lg mx-auto w-full`}>
        <p className={`inline-block px-3.5 py-1 rounded-full border font-bold ${
          themeMode === 'dark' 
            ? 'bg-slate-900/40 border-slate-800/20 text-slate-400' 
            : 'bg-white border-slate-200 text-slate-700 shadow-xs'
        }`}>
          🇮🇳 {language === 'hi' ? 'व्यापार तराजू - तेज़ और सुरक्षित ऑफलाइन हिसाब' : 'Vyapar Taraju - Secure & Offline Store Calculator'}
        </p>
      </footer>
    </div>
  );
}
