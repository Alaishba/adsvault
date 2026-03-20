export type Platform = "Meta" | "TikTok" | "Snap" | "YouTube" | "Instagram";
export type FunnelStage = "awareness" | "interest" | "conversion";

export interface Ad {
  id: string;
  brand: string;
  brandInitial: string;
  brandColor: string;
  title: string;
  description: string;
  platform: Platform;
  sector: string;
  country: string;
  date: string;
  tags: string[];
  views: string;
  saved: number;
  // Extended fields
  images?: string[];          // placeholder color(s) or real URLs
  source_url?: string;
  basic_analysis?: string[];
  apply_idea?: string[];
  recommended_action?: string;
  ad_goal?: string;
  funnel_stage?: FunnelStage;
  season?: string;
}

export interface Influencer {
  id: string;
  name: string;
  initial: string;
  color: string;
  platforms: Platform[];
  followers: string;
  engagement: string;
  category: string;
  country: string;
  bio: string;
  strengths: string[];
  weaknesses: string[];
  audienceAge: { label: string; pct: number }[];
  audienceCountry?: { label: string; pct: number }[];
}

export interface Strategy {
  id: string;
  brand: string;
  brandInitial: string;
  brandColor: string;
  title: string;
  preview: string;
  insights: string[];
  sector: string;
  tags: string[];
  date: string;
  thumbnail?: string;
  is_pro_only?: boolean;
}

export const mockAds: Ad[] = [
  {
    id: "1",
    brand: "جرير",
    brandInitial: "ج",
    brandColor: "#22c55e",
    title: "حملة العودة للمدرسة 2024",
    description:
      "إعلان عاطفي يستهدف الأسر في موسم بدء العام الدراسي. يعتمد على قصة طفل يستعد للمدرسة مع والديه في أجواء دافئة تعكس قيمة التعليم وحب الأهل.",
    platform: "Meta",
    sector: "تجزئة",
    country: "السعودية",
    date: "2024-08-15",
    tags: ["عاطفي", "موسمي", "أسري"],
    views: "2.3M",
    saved: 847,
    images: ["#22c55e", "#16a34a", "#bbf7d0"],
    source_url: "https://example.com",
    basic_analysis: [
      "استخدم الإعلان الارتباط العاطفي بين الأبناء والأهل كمحرّك رئيسي لقرار الشراء",
      "التوقيت قبل بداية الدراسة بأسبوعين رفع التحويل 3x مقارنة بنفس الإعلان في غير موسمه",
      "الألوان الدافئة والموسيقى الهادئة أسهمت في تعزيز نسبة المشاهدة الكاملة 68%",
    ],
    apply_idea: [
      "حدّد موسماً واضحاً لمنتجك (دراسة، رمضان، صيف) واربط الإعلان به",
      "ابنِ قصة مدتها 15-30 ثانية تُظهر مشكلة وحلاً بدلاً من عرض المنتج مباشرة",
      "استخدم وجوه حقيقية غير معروفة لرفع الأصالة وتقليل تكلفة الإنتاج",
      "اختبر النسخة العاطفية مقابل نسخة المنتج-فقط على 20% من الميزانية قبل التوسع",
    ],
    recommended_action:
      "ابدأ بتصوير إعلان 20 ثانية يحكي قصة عميلك قبل وبعد استخدام منتجك — القصص تُباع.",
    ad_goal: "تعزيز الوعي",
    funnel_stage: "awareness",
    season: "العودة للمدرسة",
  },
  {
    id: "2",
    brand: "STC",
    brandInitial: "S",
    brandColor: "#7c3aed",
    title: "رامي للإنترنت الفائق",
    description:
      "حملة كوميدية ترويجية لخدمة الإنترنت المنزلي عالي السرعة. تعتمد على شخصية رامي الكوميدية للتعريف بمزايا الاتصال السريع بأسلوب خفيف الظل يستهدف الشباب.",
    platform: "YouTube",
    sector: "اتصالات",
    country: "السعودية",
    date: "2024-07-01",
    tags: ["كوميدي", "شباب", "تقني"],
    views: "5.1M",
    saved: 1203,
    images: ["#7c3aed", "#6d28d9"],
    source_url: "https://example.com",
    basic_analysis: [
      "الإعلان الكوميدي حقق معدل مشاهدة كاملة أعلى بـ 2.3x من نظيره الجاد",
      "استخدام شخصية متكررة (رامي) بنى ارتباطاً عاطفياً عبر سلسلة إعلانات",
      "انتشار عضوي عبر TikTok بعد قص المشاهد الكوميدية بلغ 800K مشاهدة إضافية",
    ],
    apply_idea: [
      "اختر شخصية واحدة تمثّل عميلك المثالي وأعِد استخدامها في حملات متعددة",
      "اصنع لحظة واحدة كوميدية قوية في أول 5 ثوانٍ لمنع تخطي الإعلان",
      "خطط لسلسلة 3-5 إعلانات بنفس الشخصية لبناء ارتباط متزايد",
    ],
    recommended_action:
      "ابتكر 'وجه' لعلامتك التجارية — شخصية أو ماسكوت يتعرف عليه جمهورك فوراً.",
    ad_goal: "زيادة المبيعات",
    funnel_stage: "interest",
    season: "صيف",
  },
  {
    id: "3",
    brand: "أمازون",
    brandInitial: "A",
    brandColor: "#f59e0b",
    title: "ماجيك ديل – اليوم الواحد",
    description:
      "إعلان مباشر بعروض لحظية يعتمد على الإلحاح والعد التنازلي. يستخدم تقنية العروض المحدودة لتحفيز قرار الشراء الفوري مع تسليط الضوء على خصومات تصل 70%.",
    platform: "Snap",
    sector: "تجارة إلكترونية",
    country: "السعودية",
    date: "2024-11-11",
    tags: ["عروض", "إلحاح", "تخفيضات"],
    views: "8.7M",
    saved: 2104,
    images: ["#f59e0b", "#d97706", "#fef3c7"],
    source_url: "https://example.com",
    basic_analysis: [
      "العد التنازلي رفع معدل النقر (CTR) بنسبة 340% مقارنة بالإعلانات الثابتة",
      "استهداف المستخدمين الذين تخلوا عن سلة الشراء خلال 24 ساعة أعطى ROAS 9.4x",
      "الإعلانات الليلية (10 مساءً - 2 فجراً) حققت أعلى معدلات تحويل بفارق كبير",
    ],
    apply_idea: [
      "أضف عداداً تنازلياً حقيقياً في الإعلان — حتى 24 ساعة تكفي لخلق الإلحاح",
      "استهدف بالتحديد من أضاف المنتج للسلة ولم يكمل الشراء",
      "خصّص ميزانية 30% من حملتك للإعادة التسويقية (retargeting)",
    ],
    recommended_action:
      "اختبر إعلاناً بعرض محدود 24 ساعة هذا الأسبوع — ستفاجأ بالنتائج.",
    ad_goal: "تحويل مباشر",
    funnel_stage: "conversion",
    season: "بلاك فرايدي",
  },
  {
    id: "4",
    brand: "نون",
    brandInitial: "N",
    brandColor: "#facc15",
    title: "رمضان مع نون",
    description:
      "حملة رمضانية بأسلوب درامي يربط المنتج بقيم العائلة والمحبة خلال شهر رمضان المبارك. تعتمد على مشاهد عائلية دافئة وموسيقى هادئة.",
    platform: "TikTok",
    sector: "تجارة إلكترونية",
    country: "الإمارات",
    date: "2024-03-10",
    tags: ["رمضان", "عاطفي", "عائلي"],
    views: "3.8M",
    saved: 932,
    images: ["#facc15", "#eab308"],
    source_url: "https://example.com",
    basic_analysis: [
      "الربط القيمي بين المنتج ومناسبة دينية رفع الارتباط العاطفي بالعلامة 4.2x",
      "المشاهدات الليلية في رمضان (بعد التراويح) كانت أعلى بـ 3x من النهارية",
      "المحتوى العائلي الشامل (كل أعمار الأسرة) حقق أوسع وصول ديموغرافي",
    ],
    apply_idea: [
      "اربط حملتك بقيمة ثقافية أو دينية أصيلة — لا تتصنّع",
      "خطط لجدول نشر رمضاني: ما قبل الإفطار / بعد التراويح / السحور",
      "أنتج نسختين: إعلان طويل (60 ثانية) للوعي + قصير (15 ثانية) للتحويل",
    ],
    recommended_action:
      "ابدأ التخطيط لحملة رمضان قبل 6 أسابيع على الأقل من بداية الشهر.",
    ad_goal: "تعزيز الوعي",
    funnel_stage: "awareness",
    season: "رمضان",
  },
  {
    id: "5",
    brand: "اتصالات",
    brandInitial: "E",
    brandColor: "#06b6d4",
    title: "خطط 5G الجديدة",
    description:
      "إعلان تقني يبرز سرعة شبكة الجيل الخامس مع نجوم تكنولوجيا إماراتيين. يركز على إمكانيات اللعب والبث المباشر وتجربة المستخدم الفائقة.",
    platform: "YouTube",
    sector: "اتصالات",
    country: "الإمارات",
    date: "2024-09-20",
    tags: ["5G", "تقني", "مؤثرون"],
    views: "1.9M",
    saved: 541,
    images: ["#06b6d4", "#0891b2"],
    source_url: "https://example.com",
    basic_analysis: [
      "المؤثرون التقنيون المحليون حققوا CTR أعلى بـ 2.4x من المشاهير الدوليين",
      "المحتوى الوثائقي القصير عن تقنية 5G رفع الوعي بالعلامة 67%",
      "التظاهر بـ 'اليوم في حياة' مستخدم 5G زاد وقت المشاهدة 58%",
    ],
    apply_idea: [
      "وثّق تجربة مستخدم حقيقي مع منتجك بدلاً من الإعلان التقليدي",
      "اختر مؤثراً محلياً متخصصاً وليس مشهوراً عاماً",
      "أظهر 'قبل وبعد' واضحاً للتقنية/المنتج في 30 ثانية",
    ],
    recommended_action:
      "شاركِ تجربة عميل حقيقي مع منتجك — الأصالة تتفوق على الإنتاج الضخم.",
    ad_goal: "تعزيز الوعي",
    funnel_stage: "interest",
    season: "عام",
  },
  {
    id: "6",
    brand: "أكواتيل",
    brandInitial: "Q",
    brandColor: "#10b981",
    title: "الصيف مع أكواتيل",
    description:
      "حملة موسمية للمياه المعبأة تعتمد على الرياضة والطبيعة والمغامرات الصيفية. تستهدف الشباب الفعّال وتربط المنتج بالنشاط والحيوية.",
    platform: "Snap",
    sector: "مواد استهلاكية",
    country: "الكويت",
    date: "2024-06-01",
    tags: ["صيفي", "رياضة", "شباب"],
    views: "1.1M",
    saved: 318,
    images: ["#10b981", "#059669"],
    source_url: "https://example.com",
    basic_analysis: [
      "إعلانات Snap في الصيف حققت CPM أقل بـ 40% مع معدل تفاعل مماثل",
      "ربط المنتج بالرياضة رفع تصوّر الجودة (brand quality perception) بشكل ملموس",
      "UGC (محتوى المستخدمين) الذي أنتجه المؤثرون الصغار حقق 2x الوصول العضوي",
    ],
    apply_idea: [
      "ادفع لمؤثرين صغار (micro-influencers) لإنشاء محتوى أصيل بتكلفة أقل",
      "وثّق لحظات استخدام المنتج في سياقات طبيعية وليس في استوديو",
      "أطلق تحدياً (challenge) على Snap أو TikTok مرتبطاً بموسم الصيف",
    ],
    recommended_action:
      "استثمر في 5-10 مؤثرين صغار هذا الموسم — التأثير الحقيقي في الأعداد الصغيرة.",
    ad_goal: "تعزيز الوعي",
    funnel_stage: "awareness",
    season: "صيف",
  },
];

export const mockInfluencers: Influencer[] = [
  {
    id: "1",
    name: "ريم الفيصل",
    initial: "ر",
    color: "#ec4899",
    platforms: ["Instagram", "TikTok"],
    followers: "2.4M",
    engagement: "4.8%",
    category: "نمط الحياة",
    country: "السعودية",
    bio: "مؤثرة في مجال نمط الحياة والجمال، تشارك محتوى أصيلاً يعكس الحياة اليومية للمرأة العربية بأسلوب عصري.",
    strengths: ["وصول واسع", "محتوى أصيل", "تفاعل عالٍ"],
    weaknesses: ["محدودة في B2B"],
    audienceAge: [
      { label: "18-24", pct: 42 },
      { label: "25-34", pct: 35 },
      { label: "35+", pct: 23 },
    ],
    audienceCountry: [
      { label: "السعودية", pct: 55 },
      { label: "الإمارات", pct: 20 },
      { label: "مصر", pct: 15 },
      { label: "غيرها", pct: 10 },
    ],
  },
  {
    id: "2",
    name: "خالد المنصور",
    initial: "خ",
    color: "#3b82f6",
    platforms: ["YouTube", "TikTok"],
    followers: "1.8M",
    engagement: "6.2%",
    category: "تقنية",
    country: "الإمارات",
    bio: "مراجع تقني متخصص في أجهزة الجوال والإلكترونيات. يقدم محتوى تفصيلياً يساعد المستهلك على اتخاذ قرار الشراء.",
    strengths: ["خبرة تقنية", "ثقة الجمهور", "محتوى تعليمي"],
    weaknesses: ["جمهور متخصص", "مكلف"],
    audienceAge: [
      { label: "18-24", pct: 38 },
      { label: "25-34", pct: 45 },
      { label: "35+", pct: 17 },
    ],
    audienceCountry: [
      { label: "السعودية", pct: 40 },
      { label: "الإمارات", pct: 35 },
      { label: "مصر", pct: 15 },
      { label: "غيرها", pct: 10 },
    ],
  },
  {
    id: "3",
    name: "نور الهاشمي",
    initial: "ن",
    color: "#f59e0b",
    platforms: ["Instagram", "Snap"],
    followers: "950K",
    engagement: "7.1%",
    category: "طعام",
    country: "الكويت",
    bio: "شيف ومؤثرة غذائية تقدم وصفات خليجية أصيلة بأسلوب بصري جذاب. تتميز بتفاعل جمهورها العالي.",
    strengths: ["تفاعل عالٍ جداً", "محتوى مرئي مميز"],
    weaknesses: ["وصول محلي فقط", "تخصص ضيق"],
    audienceAge: [
      { label: "18-24", pct: 28 },
      { label: "25-34", pct: 48 },
      { label: "35+", pct: 24 },
    ],
    audienceCountry: [
      { label: "السعودية", pct: 30 },
      { label: "الإمارات", pct: 25 },
      { label: "مصر", pct: 25 },
      { label: "غيرها", pct: 20 },
    ],
  },
  {
    id: "4",
    name: "عمر الرشيدي",
    initial: "ع",
    color: "#22c55e",
    platforms: ["TikTok", "YouTube"],
    followers: "3.1M",
    engagement: "3.4%",
    category: "رياضة",
    country: "السعودية",
    bio: "رياضي ومؤثر في مجال اللياقة البدنية، يشارك برامج التمرين والتغذية الرياضية لجمهور عربي واسع.",
    strengths: ["وصول ضخم", "محتوى منتظم", "جمهور ذكوري"],
    weaknesses: ["انخفاض نسبي في التفاعل"],
    audienceAge: [
      { label: "18-24", pct: 55 },
      { label: "25-34", pct: 32 },
      { label: "35+", pct: 13 },
    ],
    audienceCountry: [
      { label: "السعودية", pct: 60 },
      { label: "الإمارات", pct: 15 },
      { label: "مصر", pct: 15 },
      { label: "غيرها", pct: 10 },
    ],
  },
  {
    id: "5",
    name: "سارة البلوشي",
    initial: "س",
    color: "#a855f7",
    platforms: ["Instagram", "TikTok", "Snap"],
    followers: "780K",
    engagement: "8.9%",
    category: "موضة",
    country: "عُمان",
    bio: "مصممة أزياء ومؤثرة في الموضة العمانية، تدمج التراث بالمعاصرة في محتوى بصري فريد.",
    strengths: ["تفاعل استثنائي", "محتوى ثقافي مميز"],
    weaknesses: ["جمهور أصغر نسبياً"],
    audienceAge: [
      { label: "18-24", pct: 50 },
      { label: "25-34", pct: 38 },
      { label: "35+", pct: 12 },
    ],
    audienceCountry: [
      { label: "السعودية", pct: 35 },
      { label: "الإمارات", pct: 30 },
      { label: "مصر", pct: 20 },
      { label: "غيرها", pct: 15 },
    ],
  },
  {
    id: "6",
    name: "فهد الدوسري",
    initial: "ف",
    color: "#ef4444",
    platforms: ["YouTube", "Meta"],
    followers: "4.2M",
    engagement: "2.8%",
    category: "ترفيه",
    country: "السعودية",
    bio: "منتج محتوى ترفيهي وكوميدي بأسلوب عربي خليجي. من أبرز المؤثرين في قطاع الترفيه بالمنطقة.",
    strengths: ["أكبر وصول", "شهرة واسعة", "تنوع المحتوى"],
    weaknesses: ["تفاعل أقل نسبياً", "مكلف جداً"],
    audienceAge: [
      { label: "18-24", pct: 45 },
      { label: "25-34", pct: 35 },
      { label: "35+", pct: 20 },
    ],
    audienceCountry: [
      { label: "السعودية", pct: 50 },
      { label: "الإمارات", pct: 20 },
      { label: "مصر", pct: 20 },
      { label: "غيرها", pct: 10 },
    ],
  },
];

export const mockStrategies: Strategy[] = [
  {
    id: "1",
    brand: "ماكدونالدز السعودية",
    brandInitial: "M",
    brandColor: "#f59e0b",
    title: "استراتيجية الإلحاح الموسمي في رمضان",
    preview:
      "كيف وظّف ماكدونالدز الإلحاح الزمني وربط منتجاته بالتجربة الرمضانية لتحقيق أعلى مبيعات موسمية في تاريخ المنطقة.",
    insights: [
      "استخدام العد التنازلي رفع معدل التحويل 340%",
      "الإعلانات الليلية (بعد السحور) حققت ROAS 8.2x",
      "المحتوى العائلي تجاوز أداء المنتج-فقط بـ 3 مرات",
    ],
    sector: "مطاعم",
    tags: ["رمضان", "إلحاح", "موسمي", "عائلي"],
    date: "2024-03-01",
  },
  {
    id: "2",
    brand: "أديداس العربية",
    brandInitial: "A",
    brandColor: "#000000",
    title: "بناء هوية علامة تجارية في سوق الرياضة",
    preview:
      "استراتيجية أديداس لترسيخ مكانتها في سوق الرياضة العربي من خلال التعاون مع الرياضيين المحليين وربط المنتج بالطموح الشبابي.",
    insights: [
      "المؤثرون المحليون حققوا CTR أعلى بـ 2.4x من المشاهير الدوليين",
      "المحتوى الوثائقي القصير رفع الوعي بالعلامة 67%",
      "حملات UGC خفّضت تكلفة الاستحواذ 45%",
    ],
    sector: "أزياء رياضية",
    tags: ["هوية العلامة", "مؤثرون", "UGC"],
    date: "2024-01-15",
  },
  {
    id: "3",
    brand: "بنك الراجحي",
    brandInitial: "R",
    brandColor: "#15803d",
    title: "تحويل الخدمات المصرفية لتجربة رقمية",
    preview:
      "كيف أعاد بنك الراجحي تأطير خدماته المصرفية كتجربة رقمية شاملة لاستهداف جيل Z العربي عبر المنصات الاجتماعية.",
    insights: [
      "الفيديوهات القصيرة (<30ث) حققت وصولاً 5x أعلى",
      "تبسيط الرسائل المالية رفع معدل التحميل 230%",
      "تكتيك الشهادات الواقعية رفع الثقة 89%",
    ],
    sector: "خدمات مالية",
    tags: ["رقمي", "جيل Z", "ثقة", "تبسيط"],
    date: "2023-11-20",
  },
];
