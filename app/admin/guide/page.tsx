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
        "أضف التحليل المتقدم (Pro Analysis): أفكار التطبيق والإجراء الموصى به",
        "ارفع صور الإعلان عبر نظام Signed URL (لا حدود لحجم الملف)",
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
        "أدخل مجال المؤثر (niche) والجمهور المستهدف (target_audience)",
        "أضف الاهتمامات (interests) كهاشتاقات مفصولة بفاصلة",
        "أضف الأداء التاريخي والتركيبة السكانية بصيغة JSON",
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
        { name: "الأزرق الأساسي", hex: "#1C4ED8", bg: "#1C4ED8" },
        { name: "أزرق الأزرار", hex: "#3b82f6", bg: "#3b82f6" },
        { name: "لون البطاقات", hex: "#ced3de", bg: "#ced3de" },
        { name: "الخلفية الداكنة", hex: "#0a0a2e", bg: "#0a0a2e" },
        { name: "نص أساسي", hex: "#0f172a", bg: "#0f172a" },
        { name: "أحمر تحذير", hex: "#b91c1c", bg: "#b91c1c" },
      ],
    },
    {
      icon: "📸",
      title: "إدارة الوسائط والبانرات",
      steps: [
        "اذهب إلى صفحة إدارة الوسائط من الشريط الجانبي",
        "ارفع صور البانر الإعلاني لكل قسم (إعلانات، استراتيجيات، مؤثرين، مدونة)",
        "ارفع صورة اللابتوب للهيرو الرئيسي",
        "ارفع صورة البانر الرئيسي للصفحة الرئيسية",
        "الصور المرفوعة تظهر تلقائياً في الأقسام المقابلة على الموقع",
      ],
    },
    {
      icon: "📋",
      title: "إدارة الشروط وسياسة الخصوصية",
      steps: [
        "اذهب إلى صفحة الشروط والأحكام من الشريط الجانبي",
        "الأقسام مقسمة إلى مجموعتين: الشروط والأحكام وسياسة الخصوصية",
        "يمكنك إضافة وتعديل وحذف وإعادة ترتيب الأقسام في كل مجموعة",
        "التغييرات تظهر فوراً على الموقع في صفحة /terms",
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
          <div key={i} className="bg-white rounded-2xl border border-[#dbeafe] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#dbeafe]" style={{ background: "#eff6ff" }}>
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
                        style={{ background: "#dbeafe", color: "#1d4ed8" }}>
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
                    <div key={j} className="flex items-center justify-between py-2 border-b border-[#dbeafe] last:border-0">
                      <span className="text-sm font-semibold text-[#1c1c1e]">{item.label}</span>
                      <span className="text-sm text-[#6b7280]">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {"colors" in section && section.colors && (
                <div className="grid grid-cols-2 gap-3">
                  {section.colors.map((c, j) => (
                    <div key={j} className="flex items-center gap-3 p-3 rounded-xl border border-[#dbeafe]">
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
      <div className="mt-8 p-4 rounded-xl border border-[#dbeafe] text-center">
        <p className="text-xs text-[#6b7280]">
          AdVault Admin Guide · v1.0 · آخر تحديث: مارس 2025
        </p>
      </div>
    </div>
  );
}
