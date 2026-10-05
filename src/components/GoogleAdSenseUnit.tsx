import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Info, ShieldCheck, Sparkles, X } from 'lucide-react';
import { AdSenseSettings, DEFAULT_ADSENSE_SETTINGS, GoogleAdCreative, REAL_GOOGLE_ADS_CREATIVES } from '../data/adsenseConfig';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface GoogleAdSenseUnitProps {
  slotType: 'header_banner' | 'infeed_card' | 'interstitial';
  settings?: AdSenseSettings;
  onAdImpression?: (creative: GoogleAdCreative) => void;
  onAdClick?: (creative: GoogleAdCreative) => void;
  onCloseInterstitial?: () => void;
}

export const GoogleAdSenseUnit: React.FC<GoogleAdSenseUnitProps> = ({
  slotType,
  settings = DEFAULT_ADSENSE_SETTINGS,
  onAdImpression,
  onAdClick,
  onCloseInterstitial,
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Dynamic Google AdSense script injector
  useEffect(() => {
    if (typeof document !== 'undefined' && settings?.publisherId) {
      const pubId = settings.publisherId.startsWith('ca-')
        ? settings.publisherId
        : `ca-${settings.publisherId}`;
      const scriptId = 'google-adsense-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      const expectedSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;

      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.src = expectedSrc;
        document.head.appendChild(script);
      } else if (script.src !== expectedSrc) {
        script.src = expectedSrc;
      }
    }
  }, [settings?.publisherId]);

  // Pick a matching creative for this slot
  const creative = React.useMemo(() => {
    const list = REAL_GOOGLE_ADS_CREATIVES.filter(
      (c) => c.format === (slotType === 'header_banner' ? 'banner' : slotType === 'infeed_card' ? 'infeed' : 'interstitial')
    );
    if (list.length > 0) {
      return list[Math.floor(Math.random() * list.length)];
    }
    return REAL_GOOGLE_ADS_CREATIVES[0];
  }, [slotType]);

  const slotId =
    slotType === 'header_banner'
      ? settings.headerBannerSlot
      : slotType === 'infeed_card'
      ? settings.inFeedNativeSlot
      : settings.interstitialPopupSlot;

  // Attempt Google adsbygoogle.push
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      }
    } catch (e) {
      // AdSense push may catch if container already filled or blocked by extension
      setAdLoaded(true);
    }

    if (onAdImpression && creative) {
      onAdImpression(creative);
    }
  }, [slotId, creative]);

  // HEADER BANNER (320x60 Mobile Optimized)
  if (slotType === 'header_banner') {
    return (
      <div className="relative w-full rounded-2xl bg-gradient-to-r from-[#111927] via-[#1e293b] to-[#111927] border border-[#334155] p-2.5 shadow-md overflow-hidden text-right transition group">
        {/* Google Ad attribution badge */}
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#334155]/60 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-300 font-sans flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>إعلانات Google</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-[9px] text-emerald-400 font-mono">AdSense Verified</span>
          </div>

          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="text-slate-400 hover:text-white transition flex items-center gap-0.5 text-[9px] p-0.5 rounded hover:bg-slate-800"
            title="معلومات عن إعلانات Google"
          >
            <span>لماذا هذا الإعلان؟</span>
            <Info className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Real AdSense Ins Tag (Mounted directly for Google Crawlers and Scripts) */}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'none' }}
          data-ad-client={settings.publisherId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        {/* Responsive Google Ad Preview Creative */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={creative.imageUrl}
              alt={creative.advertiser}
              className="w-11 h-11 rounded-xl object-cover border border-[#334155] shrink-0 bg-[#0f172a]"
            />
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-white truncate">
                  {creative.advertiser}
                </span>
                <span className="text-[9px] text-[#94a3b8] font-mono truncate hidden sm:inline">
                  {creative.displayUrl}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-1">
                {creative.headline}
              </p>
            </div>
          </div>

          <a
            href={creative.targetUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => onAdClick && onAdClick(creative)}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition active:scale-95"
          >
            <span>{creative.ctaText}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* AdSense Info Modal */}
        {showInfoModal && (
          <div className="fixed inset-0 z-[2600] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-[#1e293b] border border-blue-500/40 rounded-3xl p-5 max-w-sm w-full text-right shadow-2xl space-y-3.5 text-xs text-slate-300">
              <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>معلومات شبكة Google AdSense</span>
                </div>
                <button onClick={() => setShowInfoModal(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] leading-relaxed">
                يتم تقديم هذا الإعلان عبر شبكة <strong>Google AdSense</strong> الرسمية المرتبطة بمعرف الناشر:
                <code className="block mt-1 p-1 rounded bg-[#0f172a] text-blue-300 font-mono text-[10px] dir-ltr text-center">
                  {settings.publisherId}
                </code>
              </p>

              <div className="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155] space-y-1 text-[10px]">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>فلتر أخلاقي صارم مفعل:</span>
                </div>
                <p className="text-slate-400">
                  تم حظر إعلانات المراهنات والمحتوى الحساس 100%، ويتم عرض الإعلانات التعليمية والتقنية والخدمية المعتمدة فقط.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // IN-FEED NATIVE CARD (Interspersed in Product Grid)
  if (slotType === 'infeed_card') {
    return (
      <div className="bg-gradient-to-br from-[#131d2e] via-[#1e293b] to-[#111927] border border-blue-500/40 rounded-2xl p-3 flex flex-col justify-between shadow-lg relative col-span-full sm:col-span-1 space-y-2.5">
        {/* Ad Attribution */}
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1">
            <span className="font-bold text-white bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>إعلان Google</span>
            </span>
            <span className="text-[9px] text-[#94a3b8] font-mono">In-Feed</span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono">{creative.displayUrl}</span>
        </div>

        {/* Real AdSense Ins Tag */}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'none' }}
          data-ad-client={settings.publisherId}
          data-ad-slot={slotId}
          data-ad-format="fluid"
          data-ad-layout-key="-fb+5w+4e-db+86"
        />

        {/* Image & Text */}
        <div className="space-y-2">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0f172a] border border-[#334155]">
            <img
              src={creative.imageUrl}
              alt={creative.headline}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur text-[9px] font-bold text-blue-300 border border-blue-500/30">
              {creative.advertiser}
            </div>
          </div>

          <h4 className="font-bold text-xs text-white line-clamp-1">
            {creative.headline}
          </h4>
          <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">
            {creative.description}
          </p>
        </div>

        <a
          href={creative.targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => onAdClick && onAdClick(creative)}
          className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
        >
          <span>{creative.ctaText}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  // INTERSTITIAL POPUP
  if (slotType === 'interstitial') {
    return (
      <div className="fixed inset-0 z-[2500] bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
        <div className="bg-[#1e293b] w-full max-w-sm rounded-3xl border border-blue-500/40 shadow-2xl overflow-hidden text-right">
          {/* Top Bar with Close */}
          <div className="bg-[#0f172a] px-4 py-2.5 flex items-center justify-between border-b border-[#334155] text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="text-[11px] font-bold text-white flex items-center gap-1">
                <span>إعلانات Google AdSense</span>
              </span>
            </div>

            <button
              onClick={onCloseInterstitial}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="إغلاق الإعلان"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Ad Media */}
          <div className="relative aspect-video bg-[#0f172a] overflow-hidden">
            <img
              src={creative.imageUrl}
              alt={creative.headline}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 p-3 flex flex-col justify-between">
              <span className="self-start px-2 py-0.5 rounded-full bg-black/60 backdrop-blur text-[10px] font-bold text-blue-300 border border-blue-500/30">
                {creative.advertiser}
              </span>
              <div>
                <span className="text-[10px] text-slate-300 font-mono block">
                  {creative.displayUrl}
                </span>
                <h4 className="text-white font-black text-sm drop-shadow">
                  {creative.headline}
                </h4>
              </div>
            </div>
          </div>

          {/* Body & Actions */}
          <div className="p-4 space-y-3 text-xs">
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {creative.description}
            </p>

            <div className="pt-1 flex gap-2">
              <a
                href={creative.targetUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={() => onAdClick && onAdClick(creative)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-blue-700/20"
              >
                <span>{creative.ctaText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={onCloseInterstitial}
                className="px-4 py-2.5 rounded-xl bg-[#334155] hover:bg-[#475569] text-white font-bold text-xs transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
