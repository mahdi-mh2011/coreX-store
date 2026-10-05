import React, { useState } from 'react';
import { EthicalAd } from '../data/ethicalAds';
import { ShieldCheck, ExternalLink, Info, X } from 'lucide-react';

interface GentleAdBannerProps {
  ad: EthicalAd;
  onAdClick: (ad: EthicalAd) => void;
  onOpenCharter: () => void;
}

export const GentleAdBanner: React.FC<GentleAdBannerProps> = ({
  ad,
  onAdClick,
  onOpenCharter,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || !ad) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-950/70 via-[#1e293b] to-teal-950/70 border border-emerald-500/40 rounded-2xl p-3 shadow-md relative overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0 w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/40 shadow-sm">
            <img
              src={ad.imageUrl}
              alt={ad.sponsorName}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 bg-emerald-500 text-black text-[8px] font-black px-1 rounded-tl">
              🌿
            </span>
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                <span>إعلان لطيف</span>
              </span>
              <span className="text-[11px] font-bold text-white truncate">
                {ad.sponsorName}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {ad.headline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={ad.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onAdClick(ad)}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-sm"
          >
            <span>زيارة</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={onOpenCharter}
            className="p-1.5 rounded-lg bg-[#0f172a] text-slate-400 hover:text-emerald-300 border border-[#334155] transition text-xs"
            title="ميثاق الإعلانات الأخلاقية"
          >
            <Info className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
            title="إخفاء"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
