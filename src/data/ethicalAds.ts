export interface EthicalAd {
  id: string;
  sponsorName: string;
  category: 'تعليم وتقنية' | 'عمل خيري وبيئة' | 'صحة وغذاء طبيعي' | 'ثقافة وكتب' | 'مشاريع وطنية';
  headline: string;
  description: string;
  longBenefit: string;
  adminRevenuePerViewIQD: number; // Profit generated for the OWNER per view (e.g. 350 or 500 IQD)
  adminRevenuePerClickIQD: number; // Profit generated for the OWNER per click (e.g. 1500 IQD)
  imageUrl: string;
  websiteUrl: string;
  ethicalGuarantee: string;
  viewsCount: number;
  clicksCount: number;
  isActive: boolean;
}

export interface AdSystemStats {
  totalAdminAdProfitIQD: number; // Total profits made by the site owner/admin ("وانا اربح ليس الناس")
  todayAdminProfitIQD: number;
  totalImpressions: number;
  totalClicks: number;
  totalCleanAdsFiltered: number; // Blocked offensive/unethical ads count (e.g. 1,420 blocked)
}

export const INITIAL_ETHICAL_ADS: EthicalAd[] = [
  {
    id: 'ad-code-iq',
    sponsorName: 'مبادرة علمني كود العراقية 💻',
    category: 'تعليم وتقنية',
    headline: 'تعلم البرمجة والذكاء الاصطناعي مجاناً للشباب',
    description: 'دورات تفاعلية مجانية باللغة العربية تبدأ من الصفر حتى الاحتراف لتمكين الشباب العراقي من سوق العمل التقني العالمي.',
    longBenefit: 'تم تدريب أكثر من 15,000 شاب وفتاة على تطوير المواقع وتطبيقات الهواتف مع شهادات معتمدة وفرص توظيف.',
    adminRevenuePerViewIQD: 400,
    adminRevenuePerClickIQD: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    websiteUrl: 'https://code-iraq.org',
    ethicalGuarantee: 'مبادرة تعليمية تطوعية 100%، خالية تماماً من أي تسويق مضلل.',
    viewsCount: 4210,
    clicksCount: 312,
    isActive: true,
  },
  {
    id: 'ad-green-iraq',
    sponsorName: 'مشروع غرس دجلة والفرات الأخضر 🌴',
    category: 'عمل خيري وبيئة',
    headline: 'معاً لزراعة 100 ألف شجرة ونخلة في ربوع العراق',
    description: 'حملة بيئية وطنية لمكافحة التصحر وزيادة المساحات الخضراء، بزراعة أشجار ونخيل مستدامة تلطف الأجواء وتحمي البيئة.',
    longBenefit: 'تساهم الرعايات في غرس شتلات جديدة بأيدي متطوعين في المدارس والأحياء الشعبية.',
    adminRevenuePerViewIQD: 350,
    adminRevenuePerClickIQD: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    websiteUrl: 'https://green-iraq-trees.org',
    ethicalGuarantee: 'عمل بيئي خيري معتمد ومرخص يهدف للصالح العام فقط.',
    viewsCount: 3820,
    clicksCount: 245,
    isActive: true,
  },
  {
    id: 'ad-iqraa-books',
    sponsorName: 'مكتبة اقرأ للكتب الصوتية والمعرفة 📚',
    category: 'ثقافة وكتب',
    headline: 'آلاف الكتب والملخصات الثقافية بأصوات نخبة المعلقين',
    description: 'استمع لأفضل الكتب والروايات العالمية والمؤلفات العربية أثناء القيادة أو العمل لتغذي عقلك وتطور مهاراتك بلطف وبدون إزعاج.',
    longBenefit: 'محتوى ثقافي وتاريخي وعلمي منتقى بعناية تامة ليناسب جميع أفراد الأسرة دون أي ابتذال.',
    adminRevenuePerViewIQD: 450,
    adminRevenuePerClickIQD: 1600,
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80',
    websiteUrl: 'https://iqraa-audiobooks.net',
    ethicalGuarantee: 'محتوى عائلي هادف ورزين يخضع لمراجعة أخلاقية دقيقة.',
    viewsCount: 5120,
    clicksCount: 410,
    isActive: true,
  },
  {
    id: 'ad-pure-honey',
    sponsorName: 'عسل سدر الأهوار وريف الفرات 🍯',
    category: 'صحة وغذاء طبيعي',
    headline: 'عسل طبيعي أصلي ومفحوص مخبرياً 100%',
    description: 'منتجات غذائية طبيعية مستخرجة مباشرة من مناحل الأهوار والسهول الخصبة، خالية من السكريات المضافة لصحتك وصحة عائلتك.',
    longBenefit: 'يدعم النحالين المحليين ويضمن لك جودة غذائية موثوقة مع ضمان الاسترجاع الفوري.',
    adminRevenuePerViewIQD: 500,
    adminRevenuePerClickIQD: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
    websiteUrl: 'https://pure-iraq-honey.com',
    ethicalGuarantee: 'منتج غذائي وطني أصلي ومطابق للمواصفات الصحية القياسية.',
    viewsCount: 2950,
    clicksCount: 280,
    isActive: true,
  },
  {
    id: 'ad-orphan-aid',
    sponsorName: 'حملة حقيبة الأمل للأطفال واليتامى 🎒',
    category: 'عمل خيري وبيئة',
    headline: 'تأمين الحقائب والقرطاسية المدرسية للأطفال المتعففين',
    description: 'ساعد في رسم البسمة على وجوه أطفالنا في بداية العام الدراسي بتوفير مستلزمات التعليم لمن يحتاجها في كافة المحافظات.',
    longBenefit: 'وصلت الحملة حتى الآن لأكثر من 8,000 طالب وطالبة لمساعدتهم في مواصلة مسيرتهم الدراسية.',
    adminRevenuePerViewIQD: 350,
    adminRevenuePerClickIQD: 1400,
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    websiteUrl: 'https://hope-bag-children.org',
    ethicalGuarantee: 'جمعية إنسانية مسجلة رسمياً بنسبة نزاهة 100%.',
    viewsCount: 3640,
    clicksCount: 195,
    isActive: true,
  },
  {
    id: 'ad-crafts-heritage',
    sponsorName: 'دار الحرفيين والتراث العراقي 🏺',
    category: 'مشاريع وطنية',
    headline: 'أعمال يدوية فخارية ونحاسية أصيلة بأيدي فنانين محليين',
    description: 'اقتنِ قطعاً فنية مستوحاة من حضارة وادي الرافدين تضفي على بيتك رونقاً أصيلاً، وتدعم أسر الحرفيين المبدعين في شارع المتنبي والقشلة.',
    longBenefit: 'كل قطعة تصنع يدوياً بحب وعناية فائقة، محيية التراث العراقي الأصيل.',
    adminRevenuePerViewIQD: 300,
    adminRevenuePerClickIQD: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    websiteUrl: 'https://iraq-heritage-crafts.iq',
    ethicalGuarantee: 'دعم الاقتصاد المحلي وحماية المهن التراثية من الاندثار.',
    viewsCount: 2890,
    clicksCount: 160,
    isActive: true,
  },
];
