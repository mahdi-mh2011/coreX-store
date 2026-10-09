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

  // Dynamic Google AdSense script injector (only if enabled by the owner)
  useEffect(() => {
    if (!settings?.isAdsEnabled) return;
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
  }, [settings?.publisherId, settings?.isAdsEnabled]);

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
    if (!settings?.isAdsEnabled) return;

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
  }, [slotId, creative, settings?.isAdsEnabled]);

  // Return null if ads are disabled (per owner request until they activate Google AdSense)
  if (!settings?.isAdsEnabled) {
    return null;
  }

  // HEADER BANNER (Google AdSense Official Container)
  if (slotType === 'header_banner') {
    return (
      <div className="relative w-full rounded-2xl bg-[#0f172a] border border-[#334155] p-2 text-right transition group overflow-hidden">
        <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#334155]/60 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>Google AdSense</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-[9px] text-blue-400 font-mono">ca-pub-{settings.publisherId.replace('ca-pub-', '')}</span>
          </div>
          <span className="text-[9px] text-slate-400">إعلان رسمي</span>
        </div>

        {/* Real AdSense Ins Tag */}
        <div className="w-full min-h-[60px] flex items-center justify-center bg-[#1e293b]/50 rounded-xl overflow-hidden">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '60px' }}
            data-ad-client={settings.publisherId.startsWith('ca-') ? settings.publisherId : `ca-${settings.publisherId}`}
            data-ad-slot={slotId}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    );
  }

  // IN-FEED NATIVE CARD (Official Google AdSense Container)
  if (slotType === 'infeed_card') {
    return (
      <div className="bg-[#0f172a] border border-blue-500/30 rounded-2xl p-3 flex flex-col justify-between shadow-lg relative col-span-full sm:col-span-1 space-y-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-full">
            Google AdSense In-Feed
          </span>
          <span className="text-[9px] text-slate-400 font-mono">فتحة: {slotId}</span>
        </div>

        {/* Real AdSense Ins Tag */}
        <div className="w-full min-h-[140px] flex items-center justify-center bg-[#1e293b]/40 rounded-xl overflow-hidden">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '140px' }}
            data-ad-client={settings.publisherId.startsWith('ca-') ? settings.publisherId : `ca-${settings.publisherId}`}
            data-ad-slot={slotId}
            data-ad-format="fluid"
            data-ad-layout-key="-fb+5w+4e-db+86"
          />
        </div>
      </div>
    );
  }

  // INTERSTITIAL POPUP (Only when active and explicitly requested)
  if (slotType === 'interstitial') {
    return (
      <div className="fixed inset-0 z-[2500] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
        <div className="bg-[#1e293b] w-full max-w-sm rounded-3xl border border-blue-500/40 shadow-2xl overflow-hidden text-right p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#334155] text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>Google AdSense</span>
            </span>
            <button
              onClick={onCloseInterstitial}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="min-h-[200px] flex items-center justify-center bg-[#0f172a] rounded-xl overflow-hidden">
            <ins
              ref={adRef}
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', minHeight: '200px' }}
              data-ad-client={settings.publisherId.startsWith('ca-') ? settings.publisherId : `ca-${settings.publisherId}`}
              data-ad-slot={slotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>

          <button
            type="button"
            onClick={onCloseInterstitial}
            className="w-full py-2 rounded-xl bg-[#334155] hover:bg-[#475569] text-white font-bold text-xs transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  return null;
};
