import React, { useEffect } from 'react';

interface AdBannerProps {
  isPremium: boolean;
  themeMode: 'light' | 'dark';
  language: 'en' | 'hi';
}

export const AdBanner: React.FC<AdBannerProps> = ({ isPremium, themeMode, language }) => {
  // If user has subscribed to premium, completely skip showing any ads!
  if (isPremium) {
    return null;
  }

  useEffect(() => {
    try {
      // Call adsbygoogle push when the component mounts to trigger the ad load
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn('Google AdSense script is loading or is blocked by browser:', err);
    }
  }, []);

  return (
    <div 
      id="adsense-banner-container" 
      className="my-3 mx-auto text-center overflow-hidden max-w-lg w-full px-4 select-none"
    >
      <div className={`p-1.5 rounded-2xl border transition-all ${
        themeMode === 'dark' 
          ? 'bg-slate-900/60 border-slate-800/80 text-slate-500' 
          : 'bg-slate-50/60 border-slate-200 text-slate-400'
      }`}>
        <p className="text-[8px] font-black tracking-wider uppercase mb-1 opacity-60">
          {language === 'hi' ? 'विज्ञापन (Advertisement)' : 'ADVERTISEMENT'}
        </p>
        <div className={`min-h-[100px] flex items-center justify-center rounded-xl relative overflow-hidden ${
          themeMode === 'dark' ? 'bg-slate-950/20' : 'bg-slate-100/40'
        }`}>
          {/* Real Google AdSense Banner code */}
          <ins 
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '100px' }}
            data-ad-client="ca-pub-5108052030711331"
            data-ad-slot="vyapar_taraju_banner_ad"
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
          {/* Helpful indicator text so user knows where it is located */}
          <span className={`absolute inset-0 flex flex-col items-center justify-center text-[10px] pointer-events-none p-4 text-center leading-normal font-bold ${
            themeMode === 'dark' ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <span>{language === 'hi' ? 'गूगल विज्ञापन (Google AdSense)' : 'Google AdSense Banner Area'}</span>
            <span className="text-[9px] font-normal opacity-75 mt-0.5">
              {language === 'hi' ? '(वेबसाइट रिव्यू पास होने के बाद यहाँ विज्ञापन दिखेंगे)' : '(Ads will show here once site review is complete)'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
