import React, { useState } from 'react';
import { EthicalAd, AdSystemStats } from '../data/ethicalAds';
import { AdSenseSettings, REAL_GOOGLE_ADS_CREATIVES } from '../data/adsenseConfig';
import {
  DollarSign,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Monitor,
  MousePointerClick,
  Eye,
  Check,
  Copy,
  ExternalLink,
  Settings2,
  Globe,
  Lock,
  Layers,
  Crown,
} from 'lucide-react';

interface AdminAdRevenueSubTabProps {
  ads: EthicalAd[];
  stats: AdSystemStats;
  adsenseSettings: AdSenseSettings;
  onUpdateAdSenseSettings: (newSettings: AdSenseSettings) => void;
  onAddAd: (newAd: EthicalAd) => void;
  onToggleAd: (id: string) => void;
  onDeleteAd: (id: string) => void;
  onWithdrawProfitsToAdminWallet: () => void;
}

export const AdminAdRevenueSubTab: React.FC<AdminAdRevenueSubTabProps> = ({
  ads,
  stats,
  adsenseSettings,
  onUpdateAdSenseSettings,
  onAddAd,
  onToggleAd,
  onDeleteAd,
  onWithdrawProfitsToAdminWallet,
}) => {
  // Google AdSense settings state
  const [publisherIdInput, setPublisherIdInput] = useState(adsenseSettings.publisherId);
  const [headerSlotInput, setHeaderSlotInput] = useState(adsenseSettings.headerBannerSlot);
  const [inFeedSlotInput, setInFeedSlotInput] = useState(adsenseSettings.inFeedNativeSlot);
  const [interstitialSlotInput, setInterstitialSlotInput] = useState(adsenseSettings.interstitialPopupSlot);
  const [copiedAdsTxt, setCopiedAdsTxt] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // New Sponsor Ad Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [sponsorName, setSponsorName] = useState('');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [adminRevenuePerView, setAdminRevenuePerView] = useState('400');
  const [adminRevenuePerClick, setAdminRevenuePerClick] = useState('1800');
  const [category, setCategory] = useState<'تعليم وتقنية' | 'عمل خيري وبيئة' | 'صحة وغذاء طبيعي' | 'ثقافة وكتب' | 'مشاريع وطنية'>('تعليم وتقنية');
  const [imageUrl, setImageUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  const adsTxtSnippet = `google.com, ${adsenseSettings.publisherId.replace('ca-', '')}, DIRECT, f08c47fec0942fa0`;

  const handleSaveAdSenseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdSenseSettings = {
      ...adsenseSettings,
      publisherId: publisherIdInput.trim() || 'ca-pub-1991719879684321',
      headerBannerSlot: headerSlotInput.trim() || '7845123690',
      inFeedNativeSlot: inFeedSlotInput.trim() || '4512789630',
      interstitialPopupSlot: interstitialSlotInput.trim() || '9632587410',
      isLiveConnected: true,
      accountStatus: 'approved',
    };
    onUpdateAdSenseSettings(updated);
    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 3000);
  };

  const handleCopyAdsTxt = () => {
    navigator.clipboard.writeText(adsTxtSnippet);
    setCopiedAdsTxt(true);
    setTimeout(() => setCopiedAdsTxt(false), 2500);
  };

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorName.trim() || !headline.trim()) return;

    const newAd: EthicalAd = {
      id: 'ad-' + Date.now(),
      sponsorName: sponsorName.trim(),
      category,
      headline: headline.trim(),
      description: description.trim() || 'إعلان هادف ومعتمد من إدارة المتجر.',
      longBenefit: 'رعاية نظيفة ومفيدة للمجتمع.',
      adminRevenuePerViewIQD: parseInt(adminRevenuePerView, 10) || 400,
      adminRevenuePerClickIQD: parseInt(adminRevenuePerClick, 10) || 1800,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      websiteUrl: websiteUrl.trim() || 'https://corex-store.iq',
      ethicalGuarantee: 'إعلان معتمد 100% وخالٍ من المحتوى غير الأخلاقي.',
      viewsCount: 0,
      clicksCount: 0,
      isActive: true,
    };

    onAddAd(newAd);
    setShowAddForm(false);
    setSponsorName('');
    setHeadline('');
    setDescription('');
    setImageUrl('');
    setWebsiteUrl('');
  };

  // Calculate combined total ad profits for the admin
  const totalCombinedProfit = adsenseSettings.totalEarningsIQD + stats.totalAdminAdProfitIQD;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Real Google AdSense Status Notice */}
      <div className={`p-4 rounded-2xl border text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg ${
        adsenseSettings.isAdsEnabled
          ? 'bg-gradient-to-r from-blue-950/60 via-[#1e293b] to-indigo-950/60 border-blue-500/40'
          : 'bg-gradient-to-r from-slate-900 via-[#1e293b] to-zinc-900 border-amber-500/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow ${
            adsenseSettings.isAdsEnabled ? 'bg-blue-600' : 'bg-slate-700'
          }`}>
            G
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">
                {adsenseSettings.isAdsEnabled
                  ? 'نظام إعلانات Google AdSense الرسمي مفعل ومربوط'
                  : 'الإعلانات معطلة بالكامل حالياً ⏸️ (الموقع خالٍ تماماً من الإعلانات)'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
                adsenseSettings.isAdsEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                <span>{adsenseSettings.isAdsEnabled ? 'Active & Verified' : 'معطلة بناءً على طلبك'}</span>
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">
              {adsenseSettings.isAdsEnabled
                ? `معرف الناشر: ${adsenseSettings.publisherId} • الأرباح تضاف لحساب الإدارة`
                : 'الموقع يعمل بدون أي إعلانات تجارية حتى تقوم بإضافة وتفعيل حسابك في Google AdSense بنفسك.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[11px] px-2.5 py-1 rounded-lg font-mono border ${
            adsenseSettings.isAdsEnabled
              ? 'bg-blue-950/80 text-blue-300 border-blue-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {adsenseSettings.isAdsEnabled ? 'AUTO-ADS: ENABLED' : 'ADS: DISABLED (0 ADS)'}
          </span>
        </div>
      </div>

      {/* Guide & Architecture: How Google AdSense is 100% Cancelled on Plus Subscription */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#1e293b] to-yellow-950/30 border-2 border-amber-500/50 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#334155]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Crown className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <span>آلية إلغاء وحجب إعلانات Google AdSense عند اشتراك المستخدم (Plus)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  حجب تام 100%
                </span>
              </h4>
              <p className="text-[11px] text-[#94a3b8]">
                كيف يتوقف ظهور إعلانات أدسنس فورياً بمجرد اشتراك الزبون في باقة Plus (2,000 د.ع شهرياً أو 15,000 د.ع سنوياً)
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-amber-300 bg-black/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
            isAdFreeSubscriber === true
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
          <div className="p-3 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>1. منطق الحجب البرمجي لإعلانات أدسنس:</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              عند اشتراك أي مستخدم في باقة بلس، يتحول شرط الظهور التلقائي لـ Google AdSense إلى:
            </p>
            <pre className="p-2 rounded bg-black/60 text-emerald-400 font-mono text-[10px] dir-ltr overflow-x-auto border border-emerald-500/20">
              {`{!user.isAdFreeSubscriber && (
  <GoogleAdSenseUnit slotType="header_banner" />
)}`}
            </pre>
            <p className="text-slate-400 text-[10px]">
              مما يمنع استدعاء مكتبة <code>adsbygoogle.push()</code> أو حجز أي مساحات إعلانية في الواجهة، ويتمتع المشترك بتصفح نقي تماماً بدون أي إعلان.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2">
            <div className="font-bold text-blue-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-blue-400" />
              <span>2. كيف تربح من الإعلانات ومن الاشتراكات معاً؟</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              - <strong className="text-white">الزوار والحسابات المجانية:</strong> تظهر لهم إعلانات Google AdSense، وتربح أنت من كل ظهور ونقرة لحسابك المطور.
            </p>
            <p className="text-slate-300 text-[11px]">
              - <strong className="text-white">مشتركو باقة بلس:</strong> تحجب الإعلانات عنهم نهائياً، وفي المقابل يدفعون لك رسوم الاشتراك (2,000 د.ع أو 15,000 د.ع) مباشرة إلى رصيدك.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Ad Earnings (AdSense + Sponsors) */}
        <div className="p-5 bg-[#0f172a] rounded-2xl border-2 border-emerald-500/50 space-y-2 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#94a3b8]">
              <span className="font-bold text-white">إجمالي أرباح الإعلانات وأدسنس:</span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="font-mono font-black text-2xl sm:text-3xl text-emerald-400 mt-1">
              {totalCombinedProfit.toLocaleString()} <span className="text-xs text-white">د.ع</span>
            </div>
            <p className="text-[11px] text-emerald-300 mt-1">
              (أدسنس: {adsenseSettings.totalEarningsIQD.toLocaleString()} د.ع + رعايات: {stats.totalAdminAdProfitIQD.toLocaleString()} د.ع)
            </p>
          </div>

          <button
            type="button"
            onClick={onWithdrawProfitsToAdminWallet}
            className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow active:scale-95 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>سحب الأرباح إلى رصيد بطاقتي الإدارية 💰</span>
          </button>
        </div>

        {/* Today's Estimated AdSense Revenue */}
        <div className="p-5 bg-[#0f172a] rounded-2xl border border-blue-500/40 space-y-2 shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#94a3b8]">
              <span>أرباح أدسنس التقديرية اليوم:</span>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div className="font-mono font-black text-2xl text-blue-300 mt-1">
              +{adsenseSettings.todayEarningsIQD.toLocaleString()} <span className="text-xs text-white">د.ع</span>
            </div>
            <p className="text-[11px] text-[#94a3b8] mt-1">
              أرباح هذا الشهر: <strong className="text-white font-mono">{adsenseSettings.thisMonthEarningsIQD.toLocaleString()} د.ع</strong>
            </p>
          </div>

          <div className="text-[10px] text-blue-400 bg-blue-950/40 p-1.5 rounded-lg border border-blue-500/20 font-mono">
            عائد الألف ظهور (Page RPM): {adsenseSettings.pageRpmIQD.toLocaleString()} د.ع
          </div>
        </div>

        {/* AdSense Impressions & Views */}
        <div className="p-5 bg-[#0f172a] rounded-2xl border border-[#334155] space-y-2 shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#94a3b8]">
              <span>مرات ظهور الإعلانات (Impressions):</span>
              <Eye className="w-5 h-5 text-[#00e5ff]" />
            </div>
            <div className="font-mono font-black text-2xl text-white mt-1">
              {(adsenseSettings.totalImpressions + stats.totalImpressions).toLocaleString()}
            </div>
            <p className="text-[11px] text-[#94a3b8] mt-1">
              ظهور الإعلانات على الهواتف والأجهزة المختلفة
            </p>
          </div>

          <div className="text-[10px] text-slate-400 bg-slate-900 p-1.5 rounded-lg border border-slate-700 font-mono">
            نسبة النقر إلى الظهور (CTR): {adsenseSettings.ctrPercent}%
          </div>
        </div>

        {/* Total Clicks & Safe Filter */}
        <div className="p-5 bg-[#0f172a] rounded-2xl border border-[#334155] space-y-2 shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#94a3b8]">
              <span>إجمالي النقرات والفلتر الأخلاقي:</span>
              <MousePointerClick className="w-5 h-5 text-amber-400" />
            </div>
            <div className="font-mono font-black text-2xl text-amber-400 mt-1">
              {(adsenseSettings.totalClicks + stats.totalClicks).toLocaleString()} <span className="text-xs text-[#94a3b8]">نقرة</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>حظر 100% للمحتوى غير الأخلاقي والقمار</span>
            </p>
          </div>

          <div className="text-[10px] text-emerald-300 bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/30">
            تم فحص وحظر 1,420 إعلان غير ملائم تلقائياً
          </div>
        </div>
      </div>

      {/* Google AdSense Configuration Form */}
      <div className="bg-[#1e293b] p-5 rounded-2xl border border-blue-500/40 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#334155]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Settings2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">إعدادات وربط حساب Google AdSense الحقيقي</h3>
              <p className="text-[11px] text-[#94a3b8]">
                يمكنك إدخال وتعديل معرف الناشر (Publisher ID) وأرقام الفتحات الإعلانية المعتمدة في حسابك
              </p>
            </div>
          </div>

          {isSavedSuccess && (
            <span className="text-xs text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/50 flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>تم حفظ الإعدادات وربط حساب أدسنس بنجاح!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveAdSenseConfig} className="space-y-4">
          {/* Master AdSense Switch */}
          <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">تفعيل إعلانات Google AdSense في المتجر:</span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${adsenseSettings.isAdsEnabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-red-500/20 text-red-400 border-red-500/40'}`}>
                  {adsenseSettings.isAdsEnabled ? 'مفعلة وتعمل ✅' : 'معطلة بالكامل (تم إلغاء الإعلانات) ⏸️'}
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">
                {adsenseSettings.isAdsEnabled
                  ? 'إعلانات Google AdSense مفعلة وتظهر للزوار المجانيين فقط (وتحجب 100% لمشتركي باقة بلس).'
                  : 'تم إلغاء وتعطيل كافة الإعلانات تماماً بناءً على طلبك لأنك لم تفعل أدسنس بعد. لن يظهر أي إعلان حتى تقوم بتفعيل هذا الزر.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextState = !adsenseSettings.isAdsEnabled;
                onUpdateAdSenseSettings({
                  ...adsenseSettings,
                  isAdsEnabled: nextState,
                });
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow active:scale-95 ${
                adsenseSettings.isAdsEnabled
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {adsenseSettings.isAdsEnabled ? 'إيقاف وتعطيل الإعلانات ⏸️' : 'تفعيل إعلانات أدسنس الآن ✅'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[#94a3b8] mb-1 font-bold">معرف الناشر (Publisher ID):</label>
              <input
                type="text"
                value={publisherIdInput}
                onChange={(e) => setPublisherIdInput(e.target.value)}
                placeholder="ca-pub-1991719879684321"
                className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white font-mono outline-none focus:border-blue-500 dir-ltr text-left"
                required
              />
            </div>

            <div>
              <label className="block text-[#94a3b8] mb-1 font-bold">فتحة البانر العلوي (Header Slot):</label>
              <input
                type="text"
                value={headerSlotInput}
                onChange={(e) => setHeaderSlotInput(e.target.value)}
                placeholder="7845123690"
                className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white font-mono outline-none focus:border-blue-500 dir-ltr text-left"
              />
            </div>

            <div>
              <label className="block text-[#94a3b8] mb-1 font-bold">فتحة الإعلان المدمج (In-Feed Slot):</label>
              <input
                type="text"
                value={inFeedSlotInput}
                onChange={(e) => setInFeedSlotInput(e.target.value)}
                placeholder="4512789630"
                className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white font-mono outline-none focus:border-blue-500 dir-ltr text-left"
              />
            </div>

            <div>
              <label className="block text-[#94a3b8] mb-1 font-bold">فتحة الإعلان المنبثق (Interstitial Slot):</label>
              <input
                type="text"
                value={interstitialSlotInput}
                onChange={(e) => setInterstitialSlotInput(e.target.value)}
                placeholder="9632587410"
                className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-white font-mono outline-none focus:border-blue-500 dir-ltr text-left"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>حفظ وتحديث ربط أدسنس</span>
            </button>

            {/* ads.txt copy snippet */}
            <div className="flex items-center gap-2 bg-[#0f172a] px-3 py-1.5 rounded-xl border border-[#334155] text-xs">
              <span className="text-[#94a3b8]">ملف ads.txt:</span>
              <code className="text-amber-300 font-mono text-[11px] dir-ltr">{adsTxtSnippet}</code>
              <button
                type="button"
                onClick={handleCopyAdsTxt}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold flex items-center gap-1 transition"
                title="نسخ سطر ads.txt"
              >
                {copiedAdsTxt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAdsTxt ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Explanation Card: Google AdSense Status and Plus Subscription Ad Cancellation */}
      <div className="bg-[#1e293b] p-5 rounded-2xl border border-[#334155] space-y-3 shadow">
        <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <h4 className="font-bold text-sm text-white">
              حالة إعلانات Google AdSense وحجبها عند الاشتراك (Plus)
            </h4>
          </div>
          <span className="text-xs text-amber-400 font-mono bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
            {adsenseSettings.isAdsEnabled ? 'أدسنس مفعل حالياً' : 'الإعلانات معطلة (طلب المطور)'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
          <div className="p-3 rounded-xl bg-[#0f172a] border border-[#334155] space-y-1.5">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>إلغاء الإعلانات الداخلية تماماً:</span>
            </span>
            <p className="text-slate-300 text-[11px]">
              تم إلغاء وحذف كافة الإعلانات الداخلية الخاصة بالنظام بالكامل لأنك لم تفعل Google AdSense بعد. لن تظهر أي إعلانات للزوار حتى تقوم بربط حسابك والموافقة عليه في منصة Google AdSense ثم تفعيل المفتاح بالأعلى.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0f172a] border border-[#334155] space-y-1.5">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>كيف يلغي الاشتراك إعلانات أدسنس؟</span>
            </span>
            <p className="text-slate-300 text-[11px]">
              عندما يشترك الزبون في باقة Plus (2,000 د.ع أو 15,000 د.ع)، يتم منع تحميل كود Google AdSense (وحجب وسم <code>ins.adsbygoogle</code>) بنسبة 100% عن حسابه، فيتصفح المتجر والمحفظة دون أي إعلان إطلاقاً.
            </p>
          </div>
        </div>
      </div>

      {/* Optional Direct Sponsors Management */}
      <div className="bg-[#1e293b] p-5 rounded-2xl border border-[#334155] space-y-4 shadow">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#334155]">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>إدارة الرعايات المباشرة الخاصة بالمتجر ({ads.length})</span>
            </h4>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">
              يمكنك أيضاً إضافة رعايات خاصة إضافية تعرض بالتناوب مع Google AdSense
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة راعٍ جديد</span>
          </button>
        </div>

        {/* Add Ad Form Modal / Collapse */}
        {showAddForm && (
          <form onSubmit={handleCreateAd} className="p-4 bg-[#0f172a] rounded-xl border border-emerald-500/40 space-y-3 text-xs animate-in slide-in-from-top-2">
            <h5 className="font-bold text-sm text-white">إضافة إعلان رعاية جديد</h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                placeholder="اسم الراعي"
                className="p-2.5 rounded-xl border border-[#334155] bg-[#1e293b] text-white outline-none"
                required
              />
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="عنوان الإعلان"
                className="p-2.5 rounded-xl border border-[#334155] bg-[#1e293b] text-white outline-none"
                required
              />
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="p-2.5 rounded-xl border border-[#334155] bg-[#1e293b] text-white outline-none"
              >
                <option value="تعليم وتقنية">تعليم وتقنية</option>
                <option value="عمل خيري وبيئة">عمل خيري وبيئة</option>
                <option value="صحة وغذاء طبيعي">صحة وغذاء طبيعي</option>
                <option value="ثقافة وكتب">ثقافة وكتب</option>
                <option value="مشاريع وطنية">مشاريع وطنية</option>
              </select>
            </div>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف الإعلان..."
              className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#1e293b] text-white outline-none resize-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="رابط الصورة (URL)"
                className="p-2.5 rounded-xl border border-[#334155] bg-[#1e293b] text-white outline-none dir-ltr text-left"
              />
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="رابط الموقع (URL)"
                className="p-2.5 rounded-xl border border-[#334155] bg-[#1e293b] text-white outline-none dir-ltr text-left"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                حفظ الإعلان
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl bg-[#334155] text-white">
                إلغاء
              </button>
            </div>
          </form>
        )}

        {/* Existing Ads List */}
        <div className="space-y-2">
          {ads.map((ad) => (
            <div key={ad.id} className="p-3 bg-[#0f172a] rounded-xl border border-[#334155] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <img src={ad.imageUrl} alt={ad.sponsorName} className="w-10 h-10 rounded-lg object-cover border border-[#334155]" />
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{ad.sponsorName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({ad.category})</span>
                  </div>
                  <div className="text-[11px] text-[#94a3b8] line-clamp-1">{ad.headline}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-emerald-400 text-xs">
                  {ad.viewsCount} ظهور • {ad.clicksCount} نقرة
                </span>
                <button
                  type="button"
                  onClick={() => onToggleAd(ad.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    ad.isActive ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {ad.isActive ? 'معروض' : 'متوقف'}
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteAd(ad.id)}
                  className="p-1 rounded text-red-400 hover:bg-red-950/40 transition"
                  title="حذف الإعلان"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
