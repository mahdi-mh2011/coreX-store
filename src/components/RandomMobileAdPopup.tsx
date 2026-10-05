import React from 'react';
import { EthicalAd } from '../data/ethicalAds';
import { ShieldCheck, ExternalLink, X, Sparkles } from 'lucide-react';

interface RandomMobileAdPopupProps {
  ad: EthicalAd | null;
  onClose: () => void;
  onAdClick: (ad: EthicalAd) => void;
}

export const RandomMobileAdPopup: React.FC<RandomMobileAdPopupProps> = ({
  ad,
  onClose,
  onAdClick,
}) => {
  if (!ad) return null;

  return (
    <div className="fixed inset-0 z-[1900] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-[#1e293b] w-full max-w-sm rounded-3xl border border-emerald-500/40 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200 text-right">
        {/* Ad Header */}
        <div className="bg-[#0f172a] px-4 py-2.5 flex items-center justify-between border-b border-[#334155] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>إعلان لطيف ومعتمد 🌿</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="إغلاق الإعلان"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ad Media */}
        <div className="relative aspect-video bg-[#0f172a] overflow-hidden">
          <img
            src={ad.imageUrl}
            alt={ad.headline}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 p-3 flex flex-col justify-between">
            <span className="self-start px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
              {ad.category}
            </span>

            <div>
              <span className="text-[11px] text-emerald-300 font-bold block">
                {ad.sponsorName}
              </span>
              <h4 className="text-white font-black text-sm drop-shadow">
                {ad.headline}
              </h4>
            </div>
          </div>
        </div>

        {/* Ad Body */}
        <div className="p-4 space-y-3 text-xs">
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {ad.description}
          </p>

          <div className="p-2.5 rounded-xl bg-[#0f172a] border border-emerald-500/20 text-[10px] text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="line-clamp-1">{ad.ethicalGuarantee}</span>
          </div>

          {/* Action Button */}
          <div className="pt-1 flex gap-2">
            <a
              href={ad.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onAdClick(ad)}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-700/20"
            >
              <span>زيارة صفحة الراعي</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#334155] hover:bg-[#475569] text-white font-bold text-xs transition"
            >
              متابعة التصفح
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
