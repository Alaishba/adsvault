export default function AdminGuidePage() {
  const sections = [
    {
      icon: "📢",
      title: "كيف تضيف إعلاناً جديداً",
      steps: [
        "اذهب إلى صفحة الإعلانات من الشريط الجانبي",
        'اضغط على زر \"+ إضافة إعلان\" في أعلى يمين الصفحة',
        "أدخل اسم العلامة التجارية والحرف الأول ولون العلامة",
        "أضف عنوان الإعلان والوصف التفصيلي",
        "اختر المنصة والقطاع والبلد والموسم وهدف الإعلان",
        "أضف التاغات مفصولة بفاصلة (مثال: رمضان, موسمي, عاطفي)",
        "أدخل التحليل الأساسي وأفكار التطبيق والإجراء الموصى به",
        'اضغط \"إضافة الإعلان\" لحفظ البيانات',
      ],
    },
    {
      icon: "🌟",
      title: "كيف تضيف مؤثراً",
      steps: [
        "اذهب إلى صفحة المؤثرون من الشريط الجانبي",
        'اضغط على زر \"+ إضافة مؤثر\"',
        "أدخل اسم المؤثر والحرف الأول ولون الأفاتار",
        "اختر المنصات التي يستخدمها المؤثر (يمكن اختيار أكثر من منصة)",
        "أدخل عدد المتابعين ونسبة التفاعل والتصنيف والبلد",
        "اكتب نبذة مختصرة عن المؤثر وتخصصه",
        "أضف نقاط القوة والضعف مفصولة بفاصلة",
        'اضغط \"إضافة المؤثر\" لحفظ البيانات',
      ],
    },
    {
      icon: "📊",
      title: "كيف تضيف استراتيجية",
      steps: [
        "اذهب إلى صفحة الاستراتيجيات من الشريط الجانبي",
        'اضغط على زر \"+ إضافة استراتيجية\"',
        "أدخل اسم العلامة التجارية والحرف الأول",
        "أدخل عنوان الاستراتيجية والوصف المختصر",
        "أضف الإحصائيات الرئيسية — كل إحصائية في سطر منفصل",
        "اختر القطاع وأضف التاغات مفصولة بفاصلة",
        'اضغط \"إضافة الاستراتيجية\" لحفظ البيانات',
      ],
    },
    {
      icon: "🖼️",
      title: "مقاسات الصور الموصى بها",
      items: [
        { label: "صور الإعلانات", value: "1200 × 628 بكسل (نسبة 1.91:1)" },
        { label: "صور المربعة", value: "1080 × 1080 بكسل (نسبة 1:1)" },
        { label: "صور القصص (Stories)", value: "1080 × 1920 بكسل (نسبة 9:16)" },
        { label: "صور الشعار (Logo)", value: "200 × 200 بكسل على الأقل" },
        { label: "الحجم الأقصى للصورة", value: "5 ميجابايت" },
        { label: "الصيغ المدعومة", value: "JPG, PNG, WebP" },
      ],
    },
    {
      icon: "🎨",
      title: "الألوان المستخدمة في المنصة",
      colors: [
        { name: "اللون الأساسي", hex: "#22c55e", bg: "#22c55e" },
        { name: "اللون الأساسي الداكن", hex: "#16a34a", bg: "#16a34a" },
        { name: "أزرق Enterprise", hex: "#1d4ed8", bg: "#1d4ed8" },
        { name: "بنفسجي TikTok", hex: "#9d174d", bg: "#9d174d" },
        { name: "أحمر تحذير", hex: "#b91c1c", bg: "#b91c1c" },
        { name: "رمادي نص ثانوي", hex: "#6b7280", bg: "#6b7280" },
      ],
    },
    {
      icon: "💳",
      title: "كيف تدير الاشتراكات",
      steps: [
        "اذهب إلى صفحة المستخدمون من الشريط الجانبي",
        "ابحث عن المستخدم باستخدام خانة البحث",
        "في عمود الخطة، اختر الخطة الجديدة من القائمة المنسدلة",
        "الخيارات المتاحة: free (مجاني)، pro (احترافي)، enterprise (مؤسسي)، admin (مدير)",
        "يتم حفظ التغيير تلقائياً بمجرد الاختيار",
        "يمكنك أيضاً تعليق المستخدم مؤقتاً باستخدام زر التعليق/التفعيل",
      ],
    },
    {
      icon: "🔓",
      title: "كيف يعمل نظام Free / Pro",
      items: [
        { label: "خطة Free", value: "عرض بطاقات الإعلانات فقط — بدون تفاصيل التحليل" },
        { label: "خطة Pro", value: "الوصول الكامل لجميع التحليلات والاستراتيجيات والمؤثرين" },
        { label: "خطة Enterprise", value: "كل مزايا Pro + دعم مخصص وتقارير مخصصة" },
        { label: "الترقية", value: "يتم عبر صفحة الاشتراكات /pricing أو من لوحة التحكم" },
        { label: "المدفوعات", value: "تدار عبر Stripe — تحقق من الداشبورد الخاص بـ Stripe" },
      ],
    },
    {
      icon: "👥",
      title: "كيف تدير بيانات المستخدمين",
      steps: [
        "جميع بيانات المستخدمين محفوظة في Supabase (جدول profiles)",
        "لا تحذف مستخدمين مباشرة من Supabase — استخدم خيار التعليق أولاً",
        "يمكن تصدير بيانات المستخدمين من Supabase Dashboard → Table Editor",
        "كلمات المرور مشفرة ولا يمكن الاطلاع عليها — استخدم خيار إعادة تعيين كلمة المرور",
        "لمنح صلاحيات أدمن لمستخدم: غيّر خطته إلى admin من صفحة المستخدمين",
        "راجع سجلات Supabase Logs للتحقق من أي نشاط مشبوه",
      ],
    },
  ];

  return (
    <div className="px-6 lg:px-10 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1c1c1e]">دليل الإدارة</h1>
        <p className="text-sm mt-0.5 text-[#6b7280]">كل ما تحتاج معرفته لإدارة منصة AdVault</p>
      </div>

      <div className="space-y-6">
        {sections.map((section, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e5e7eb]" style={{ background: "#f3f5f9" }}>
              <h2 className="font-extrabold text-base flex items-center gap-2 text-[#1c1c1e]">
                <span>{section.icon}</span>
                <span>{section.title}</span>
              </h2>
            </div>
            <div className="px-6 py-5">
              {"steps" in section && section.steps && (
                <ol className="space-y-2.5">
                  {section.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                        style={{ background: "#f0faf0", color: "#15803d" }}>
                        {j + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-[#1c1c1e]">{step}</span>
                    </li>
                  ))}
                </ol>
              )}
              {"items" in section && section.items && (
                <div className="space-y-2.5">
                  {section.items.map((item, j) => (
                    <div key={j} className="flex items-center justify-between py-2 border-b border-[#e5e7eb] last:border-0">
                      <span className="text-sm font-semibold text-[#1c1c1e]">{item.label}</span>
                      <span className="text-sm text-[#6b7280]">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {"colors" in section && section.colors && (
                <div className="grid grid-cols-2 gap-3">
                  {section.colors.map((c, j) => (
                    <div key={j} className="flex items-center gap-3 p-3 rounded-xl border border-[#e5e7eb]">
                      <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: c.bg }} />
                      <div>
                        <p className="text-xs font-bold text-[#1c1c1e]">{c.name}</p>
                        <p className="text-xs font-mono text-[#6b7280]">{c.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Version note */}
      <div className="mt-8 p-4 rounded-xl border border-[#e5e7eb] text-center">
        <p className="text-xs text-[#6b7280]">
          AdVault Admin Guide · v1.0 · آخر تحديث: مارس 2025
        </p>
      </div>
    </div>
  );
}
