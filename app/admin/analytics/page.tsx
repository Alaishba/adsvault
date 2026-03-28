import { createAdminClient } from "../../lib/supabase/admin";

async function fetchAnalyticsData() {
  const supabase = createAdminClient();

  const [
    adsCountRes,
    influencersCountRes,
    strategiesCountRes,
    blogCountRes,
    usersCountRes,
    proUsersCountRes,
    topAdsRes,
    recentUsersRes,
    latestAdRes,
    latestInfluencerRes,
    latestBlogRes,
  ] = await Promise.all([
    supabase.from("ads").select("id", { count: "exact", head: true }),
    supabase.from("influencers").select("id", { count: "exact", head: true }),
    supabase.from("strategies").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("users").select("id", { count: "exact", head: true }).eq("plan", "pro"),
    supabase.from("ads").select("title,brand,saved").order("saved", { ascending: false }).limit(10),
    supabase.from("users").select("full_name,email,plan,created_at").order("created_at", { ascending: false }).limit(10),
    supabase.from("ads").select("title,created_at").order("created_at", { ascending: false }).limit(1),
    supabase.from("influencers").select("name,created_at").order("created_at", { ascending: false }).limit(1),
    supabase.from("blog_posts").select("title,created_at").order("created_at", { ascending: false }).limit(1),
  ]);

  return {
    counts: {
      ads: adsCountRes.count ?? 0,
      influencers: influencersCountRes.count ?? 0,
      strategies: strategiesCountRes.count ?? 0,
      blog: blogCountRes.count ?? 0,
      users: usersCountRes.count ?? 0,
      proUsers: proUsersCountRes.count ?? 0,
    },
    topAds: (topAdsRes.data ?? []) as { title: string; brand: string; saved: number }[],
    recentUsers: (recentUsersRes.data ?? []) as { full_name: string; email: string; plan: string; created_at: string }[],
    latestAd: (latestAdRes.data?.[0] ?? null) as { title: string; created_at: string } | null,
    latestInfluencer: (latestInfluencerRes.data?.[0] ?? null) as { name: string; created_at: string } | null,
    latestBlog: (latestBlogRes.data?.[0] ?? null) as { title: string; created_at: string } | null,
  };
}

export default async function AdminAnalyticsPage() {
  const data = await fetchAnalyticsData();

  const kpis = [
    { label: "إجمالي الإعلانات", value: data.counts.ads },
    { label: "إجمالي المؤثرين", value: data.counts.influencers },
    { label: "إجمالي الاستراتيجيات", value: data.counts.strategies },
    { label: "إجمالي المقالات", value: data.counts.blog },
    { label: "إجمالي المستخدمين", value: data.counts.users },
    { label: "مستخدمو Pro", value: data.counts.proUsers },
  ];

  return (
    <div dir="rtl" className="min-h-screen p-6 space-y-8" style={{ background: "#eff6ff", color: "#1c1c1e" }}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">تحليلات متقدمة</h1>
        <p className="mt-1" style={{ color: "#6b7280" }}>
          نظرة شاملة على بيانات المنصة الحقيقية
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl p-4"
            style={{ background: "#ffffff", border: "1px solid #dbeafe" }}
          >
            <p className="text-2xl font-bold">{kpi.value.toLocaleString()}</p>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              {kpi.label}
            </p>
          </div>
        ))}
      </div>

      {/* Top Ads by Saves + Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Ads */}
        <div className="rounded-xl p-5" style={{ background: "#ffffff", border: "1px solid #dbeafe" }}>
          <h2 className="text-lg font-bold mb-4">أكثر الإعلانات حفظاً</h2>
          {data.topAds.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: "#6b7280", borderBottom: "1px solid #dbeafe" }}>
                    <th className="pb-2 text-right font-medium">#</th>
                    <th className="pb-2 text-right font-medium">العنوان</th>
                    <th className="pb-2 text-right font-medium">البراند</th>
                    <th className="pb-2 text-right font-medium">المحفوظات</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topAds.map((ad, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #dbeafe" }}>
                      <td className="py-2" style={{ color: "#6b7280" }}>{i + 1}</td>
                      <td className="py-2">{ad.title}</td>
                      <td className="py-2" style={{ color: "#3b82f6" }}>{ad.brand}</td>
                      <td className="py-2" style={{ color: "#3b82f6" }}>{ad.saved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm" style={{ color: "#6b7280" }}>لا توجد إعلانات بعد</p>
          )}
        </div>

        {/* Recent Users */}
        <div className="rounded-xl p-5" style={{ background: "#ffffff", border: "1px solid #dbeafe" }}>
          <h2 className="text-lg font-bold mb-4">أحدث المستخدمين</h2>
          {data.recentUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: "#6b7280", borderBottom: "1px solid #dbeafe" }}>
                    <th className="pb-2 text-right font-medium">الاسم</th>
                    <th className="pb-2 text-right font-medium">البريد</th>
                    <th className="pb-2 text-right font-medium">الخطة</th>
                    <th className="pb-2 text-right font-medium">تاريخ التسجيل</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentUsers.map((user, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #dbeafe" }}>
                      <td className="py-2">{user.full_name || "—"}</td>
                      <td className="py-2" style={{ color: "#6b7280" }}>{user.email}</td>
                      <td className="py-2">
                        <span
                          className="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            background: user.plan === "pro" ? "#dbeafe" : user.plan === "admin" ? "#fef9c3" : "#f3f4f6",
                            color: user.plan === "pro" ? "#1d4ed8" : user.plan === "admin" ? "#854d0e" : "#6b7280",
                          }}
                        >
                          {user.plan}
                        </span>
                      </td>
                      <td className="py-2" style={{ color: "#6b7280" }}>{(user.created_at ?? "").slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm" style={{ color: "#6b7280" }}>لا يوجد مستخدمون بعد</p>
          )}
        </div>
      </div>

      {/* Latest Content */}
      <div>
        <h2 className="text-lg font-bold mb-4">آخر المحتوى المضاف</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Latest Ad */}
          <div className="rounded-xl p-4" style={{ background: "#ffffff", border: "1px solid #dbeafe" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "#6b7280" }}>آخر إعلان</p>
            {data.latestAd ? (
              <>
                <p className="text-sm font-bold">{data.latestAd.title}</p>
                <p className="text-xs mt-1" style={{ color: "#6b7280" }}>{(data.latestAd.created_at ?? "").slice(0, 10)}</p>
              </>
            ) : (
              <p className="text-sm" style={{ color: "#6b7280" }}>—</p>
            )}
          </div>

          {/* Latest Influencer */}
          <div className="rounded-xl p-4" style={{ background: "#ffffff", border: "1px solid #dbeafe" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "#6b7280" }}>آخر مؤثر</p>
            {data.latestInfluencer ? (
              <>
                <p className="text-sm font-bold">{data.latestInfluencer.name}</p>
                <p className="text-xs mt-1" style={{ color: "#6b7280" }}>{(data.latestInfluencer.created_at ?? "").slice(0, 10)}</p>
              </>
            ) : (
              <p className="text-sm" style={{ color: "#6b7280" }}>—</p>
            )}
          </div>

          {/* Latest Blog Post */}
          <div className="rounded-xl p-4" style={{ background: "#ffffff", border: "1px solid #dbeafe" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "#6b7280" }}>آخر مقال</p>
            {data.latestBlog ? (
              <>
                <p className="text-sm font-bold">{data.latestBlog.title}</p>
                <p className="text-xs mt-1" style={{ color: "#6b7280" }}>{(data.latestBlog.created_at ?? "").slice(0, 10)}</p>
              </>
            ) : (
              <p className="text-sm" style={{ color: "#6b7280" }}>—</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
