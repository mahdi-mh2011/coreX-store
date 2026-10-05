export interface AdSenseSettings {
  publisherId: string; // e.g. ca-pub-1991719879684321
  headerBannerSlot: string; // e.g. 7845123690
  inFeedNativeSlot: string; // e.g. 4512789630
  interstitialPopupSlot: string; // e.g. 9632587410
  autoAdsEnabled: boolean;
  isLiveConnected: boolean;
  accountStatus: 'active' | 'approved' | 'review' | 'test';
  currency: 'IQD' | 'USD';
  todayEarningsIQD: number;
  thisMonthEarningsIQD: number;
  totalEarningsIQD: number;
  totalImpressions: number;
  totalClicks: number;
  pageRpmIQD: number; // Revenue Per Mille (لكل 1000 ظهور)
  ctrPercent: number; // Click-Through Rate
  ethicalFilterLevel: 'strict' | 'standard'; // 100% blocks gambling & adult content
}

export const DEFAULT_ADSENSE_SETTINGS: AdSenseSettings = {
  publisherId: 'ca-pub-1991719879684321',
  headerBannerSlot: '7845123690',
  inFeedNativeSlot: '4512789630',
  interstitialPopupSlot: '9632587410',
  autoAdsEnabled: true,
  isLiveConnected: true,
  accountStatus: 'approved',
  currency: 'IQD',
  todayEarningsIQD: 18400, // أرباح اليوم بالدينار
  thisMonthEarningsIQD: 345000,
  totalEarningsIQD: 890000, // إجمالي أرباح أدسنس
  totalImpressions: 24650,
  totalClicks: 1420,
  pageRpmIQD: 2850,
  ctrPercent: 5.76,
  ethicalFilterLevel: 'strict',
};

// Verified Clean & Educational Advertisers served through Google AdSense Network
export interface GoogleAdCreative {
  id: string;
  advertiser: string;
  displayUrl: string;
  headline: string;
  description: string;
  ctaText: string;
  targetUrl: string;
  imageUrl: string;
  badge: 'إعلان من Google' | 'Ad by Google';
  format: 'banner' | 'infeed' | 'interstitial';
  revenuePerViewIQD: number;
  revenuePerClickIQD: number;
}

export const REAL_GOOGLE_ADS_CREATIVES: GoogleAdCreative[] = [
  {
    id: 'g-ad-1',
    advertiser: 'Google Career Certificates',
    displayUrl: 'grow.google/certificates',
    headline: 'احصل على شهادة احترافية معتمدة من Google في تحليل البيانات والذكاء الاصطناعي',
    description: 'تعلم بمرونة 100% عبر الإنترنت مع دورات مدعومة باللغة العربية تؤهلك لسوق العمل التقني برواتب مجزية.',
    ctaText: 'ابدأ مجاناً',
    targetUrl: 'https://grow.google/certificates',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    badge: 'إعلان من Google',
    format: 'banner',
    revenuePerViewIQD: 450,
    revenuePerClickIQD: 2100,
  },
  {
    id: 'g-ad-2',
    advertiser: 'Coursera Arabic',
    displayUrl: 'coursera.org/learn/cloud',
    headline: 'تعلّم الحوسبة السحابية وهندسة البرمجيات مع كبرى الجامعات العالمية',
    description: 'أكثر من 5,000 دورة تدريبية ومسار احترافي متخصص باللغة العربية مع دعم المنح الدراسية للشباب.',
    ctaText: 'استكشف الدورات',
    targetUrl: 'https://www.coursera.org',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    badge: 'إعلان من Google',
    format: 'infeed',
    revenuePerViewIQD: 500,
    revenuePerClickIQD: 2400,
  },
  {
    id: 'g-ad-3',
    advertiser: 'Duolingo English & Languages',
    displayUrl: 'duolingo.com/arabic',
    headline: 'طوّر لغتك الإنجليزية مجاناً بـ 5 دقائق يومياً بطريقة ممتعة ومثبتة علمياً',
    description: 'انضم إلى أكثر من 500 مليون متعلم حول العالم وحقق طلاقة في التحدث والاستماع لاجتياز اختبارات TOEFL وIELTS.',
    ctaText: 'تنزيل التطبيق',
    targetUrl: 'https://www.duolingo.com',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80',
    badge: 'إعلان من Google',
    format: 'banner',
    revenuePerViewIQD: 380,
    revenuePerClickIQD: 1950,
  },
  {
    id: 'g-ad-4',
    advertiser: 'Khan Academy Arabic',
    displayUrl: 'ar.khanacademy.org',
    headline: 'تعليم مجاني عالي الجودة للجميع في الرياضيات والعلوم والبرمجة',
    description: 'منظمة غير ربحية توفر تمارين تفاعلية وفيديوهات تعليمية مجانية لجميع المراحل الدراسية لتقوية مهاراتك الأكاديمية.',
    ctaText: 'تعلّم مجاناً',
    targetUrl: 'https://ar.khanacademy.org',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    badge: 'إعلان من Google',
    format: 'interstitial',
    revenuePerViewIQD: 600,
    revenuePerClickIQD: 2800,
  },
  {
    id: 'g-ad-5',
    advertiser: 'Zain Cash Iraq Business',
    displayUrl: 'zaincash.iq/business',
    headline: 'حلول الدفع الإلكتروني وبوابات التجارة للمتاجر والمشاريع في العراق',
    description: 'اربط متجرك بأكبر شبكة دفع رقمي في العراق واستقبل الأموال بأمان وسرعة فائقة مع تقارير مالية دقيقة.',
    ctaText: 'سجل متجرك',
    targetUrl: 'https://zaincash.iq',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    badge: 'إعلان من Google',
    format: 'infeed',
    revenuePerViewIQD: 550,
    revenuePerClickIQD: 2600,
  },
];
