import React from 'react';
import { EthicalAd } from '../data/ethicalAds';
import { ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

interface MobileSponsorCardProps {
  ad: EthicalAd;
  onAdClick: (ad: EthicalAd) => void;
}

export const MobileSponsorCard: React.FC<MobileSponsorCardProps> = ({
  ad,
  onAdClick,
}) => {
  return (
    <div className="bg-gradient-to-br from-emerald-950/60 via-[#1e293b] to-teal-950/60 rounded-2xl border border-emerald-500/40 overflow-hidden shadow-lg flex flex-col justify-between col-span-full sm:col-span-1 p-3.5 space-y-3 relative">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>إعلان لطيف معتمد 🌿</span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono">رعاية معتمدة</span>
      </div>

      <div className="flex gap-3 items-center">
        <img
          src={ad.imageUrl}
          alt={ad.headline}
          className="w-16 h-16 rounded-xl object-cover border border-emerald-500/30 shrink-0"
        />
        <div className="min-w-0 space-y-0.5">
          <span className="text-[11px] font-bold text-emerald-300 block truncate">
            {ad.sponsorName}
          </span>
          <h4 className="font-bold text-xs text-white line-clamp-1">
            {ad.headline}
          </h4>
          <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">
            {ad.description}
          </p>
        </div>
      </div>

      <a
        href={ad.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onAdClick(ad)}
        className="w-full py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
      >
        <span>تعرف على المبادرة</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
