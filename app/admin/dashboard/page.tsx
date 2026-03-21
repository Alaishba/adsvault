"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchUsers } from "../../lib/db";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

type User = { id: string; email: string; full_name: string; plan: string; created_at: string };

const mockUsers: User[] = [
  { id: "1", email: "ahmed@example.com", full_name: "أحمد محمد", plan: "pro", created_at: "2024-03-15" },
  { id: "2", email: "fatima@example.com", full_name: "فاطمة العلي", plan: "free", created_at: "2024-03-14" },
  { id: "3", email: "khalid@example.com", full_name: "خالد المنصور", plan: "pro", created_at: "2024-03-13" },
  { id: "4", email: "nour@example.com", full_name: "نور الهاشمي", plan: "enterprise", created_at: "2024-03-12" },
  { id: "5", email: "sara@example.com", full_name: "سارة البلوشي", plan: "free", created_at: "2024-03-11" },
  { id: "6", email: "fahad@example.com", full_name: "فهد الدوسري", plan: "pro", created_at: "2024-03-10" },
  { id: "7", email: "layla@example.com", full_name: "ليلى السالم", plan: "free", created_at: "2024-03-09" },
  { id: "8", email: "omar@example.com", full_name: "عمر الحربي", plan: "pro", created_at: "2024-03-08" },
  { id: "9", email: "mariam@example.com", full_name: "مريم الشمري", plan: "free", created_at: "2024-03-07" },
  { id: "10", email: "youssef@example.com", full_name: "يوسف القحطاني", plan: "enterprise", created_at: "2024-03-06" },
];

const planStyle: Record<string, { bg: string; color: string }> = {
  pro:        { bg: "#f3eeff", color: "#8957f6" },
  enterprise: { bg: "#eff6ff", color: "#2563eb" },
  free:       { bg: "#f3f5f9", color: "#6b7280" },
  admin:      { bg: "#fef2f2", color: "#ef4444" },
};

const kpiIcons = [
  <svg key="0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84cc18" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8957f6" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  <svg key="2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84cc18" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  <svg key="3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84cc18" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  <svg key="4" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8957f6" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  <svg key="5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84cc18" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>,
];

const defaultKpis = [
  { label: "إجمالي المستخدمين", value: "1,247", change: "+12%", up: true },
  { label: "المشتركون Pro", value: "423", change: "+8%", up: true },
  { label: "الإيراد الشهري (MRR)", value: "12,450 ر.س", change: "+8.3%", up: true },
  { label: "إعلانات مضافة", value: "38", change: "+5", up: true },
  { label: "استراتيجيات", value: "24", change: "+3", up: true },
  { label: "مؤثرون", value: "156", change: "+12", up: true },
];

/* Simple bar chart */
const revenueData = [
  { month: "أكتوبر", value: 8200 }, { month: "نوفمبر", value: 9100 },
  { month: "ديسمبر", value: 10800 }, { month: "يناير", value: 9500 },
  { month: "فبراير", value: 11200 }, { month: "مارس", value: 12450 },
];
const maxRevenue = Math.max(...revenueData.map((d) => d.value));

/* User growth mock */
const growthData = [320, 340, 380, 420, 390, 450, 480, 520, 490, 560, 580, 620, 610, 650, 680, 720, 700, 750, 780, 810, 790, 840, 870, 900, 920, 960, 980, 1020, 1100, 1247];

/* Platform distribution */
const platformData = [
  { name: "Meta", pct: 35, color: "#3b82f6" },
  { name: "TikTok", pct: 28, color: "#ef4444" },
  { name: "Snap", pct: 18, color: "#eab308" },
  { name: "YouTube", pct: 12, color: "#ef4444" },
  { name: "Instagram", pct: 7, color: "#a855f7" },
];

const quickActions = [
  { href: "/admin/ads", label: "إضافة إعلان", icon: "📢" },
  { href: "/admin/influencers", label: "إضافة مؤثر", icon: "🌟" },
  { href: "/admin/strategies", label: "إضافة استراتيجية", icon: "📊" },
  { href: "/admin/blog", label: "إضافة مقال", icon: "📝" },
  { href: "/admin/planner-settings", label: "إعدادات مخطط الحملة", icon: "⚙️" },
  { href: "/admin/appsflyer", label: "إعدادات AppsFlyer", icon: "🔗" },
];

const mockRecentAds = [
  { title: "عرض رمضان الخاص", brand: "جرير", date: "2024-03-15" },
  { title: "تخفيضات الصيف", brand: "نمشي", date: "2024-03-14" },
  { title: "إطلاق المنتج الجديد", brand: "STC", date: "2024-03-13" },
  { title: "حملة العودة للمدرسة", brand: "إكسترا", date: "2024-03-12" },
  { title: "يوم التأسيس", brand: "الراجحي", date: "2024-03-11" },
];

const mockContactRequests = [
  { name: "محمد أحمد", email: "m@example.com", message: "استفسار عن الباقات", date: "2024-03-15" },
  { name: "سارة خالد", email: "s@example.com", message: "طلب عرض سعر Enterprise", date: "2024-03-14" },
  { name: "فهد العتيبي", email: "f@example.com", message: "مشكلة في تسجيل الدخول", date: "2024-03-13" },
];

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [kpis, setKpis] = useState(defaultKpis);

  useEffect(() => {
    fetchUsers().then((u) => { if (u.length) setUsers(u); });
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    async function loadCounts() {
      const [adsRes, strategiesRes, influencersRes, usersRes, proRes] = await Promise.all([
        supabase.from("ads").select("id", { count: "exact", head: true }),
        supabase.from("strategies").select("id", { count: "exact", head: true }),
        supabase.from("influencers").select("id", { count: "exact", head: true }),
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("users").select("id", { count: "exact", head: true }).eq("plan", "pro"),
      ]);
      const totalUsers = usersRes.count ?? 0;
      const proUsers = proRes.count ?? 0;
      const adsCount = adsRes.count ?? 0;
      const strategiesCount = strategiesRes.count ?? 0;
      const influencersCount = influencersRes.count ?? 0;
      setKpis((prev) => prev.map((k, i) => {
        if (i === 0) return { ...k, value: totalUsers.toLocaleString() };
        if (i === 1) return { ...k, value: proUsers.toLocaleString() };
        if (i === 3) return { ...k, value: adsCount.toLocaleString() };
        if (i === 4) return { ...k, value: strategiesCount.toLocaleString() };
        if (i === 5) return { ...k, value: influencersCount.toLocaleString() };
        return k;
      }));
    }
    loadCounts();
  }, []);

  return (
    <div className="px-6 lg:px-10 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1c1c1e]">لوحة التحكم</h1>
          <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>مرحباً — هذا ملخص المنصة</p>
        </div>
      </div>

      {/* Row 1: KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-2xl border p-4" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#f7fee7" }}>{kpiIcons[i]}</div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: k.up ? "#f7fee7" : "#fef2f2", color: k.up ? "#84cc18" : "#ef4444" }}>{k.change}</span>
            </div>
            <p className="text-xl font-extrabold text-[#1c1c1e] mb-0.5">{k.value}</p>
            <p className="text-[10px]" style={{ color: "#6b7280" }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* User growth */}
        <div className="rounded-2xl border p-5" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
          <h3 className="font-bold text-sm text-[#1c1c1e] mb-4">نمو المستخدمين (آخر 30 يوم)</h3>
          <div className="flex items-end gap-[2px] h-24">
            {growthData.map((v, i) => (
              <div key={i} className="flex-1 rounded-t-sm transition-all" style={{
                height: `${(v / 1300) * 100}%`,
                background: i === growthData.length - 1 ? "#84cc18" : "#e5e7eb",
              }} />
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: "#6b7280" }}>اليوم: <span className="text-[#1c1c1e] font-bold">1,247</span></p>
        </div>

        {/* Revenue */}
        <div className="rounded-2xl border p-5" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
          <h3 className="font-bold text-sm text-[#1c1c1e] mb-4">الإيراد الشهري (آخر 6 أشهر)</h3>
          <div className="space-y-2">
            {revenueData.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[10px] w-12 text-left" style={{ color: "#6b7280" }}>{d.month}</span>
                <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: "#e5e7eb" }}>
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${(d.value / maxRevenue) * 100}%`,
                    background: i === revenueData.length - 1 ? "#84cc18" : "#8957f6",
                  }} />
                </div>
                <span className="text-[10px] text-[#1c1c1e] font-bold w-14 text-left">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform distribution */}
        <div className="rounded-2xl border p-5" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
          <h3 className="font-bold text-sm text-[#1c1c1e] mb-4">توزيع المنصات</h3>
          <div className="space-y-3">
            {platformData.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-xs w-16" style={{ color: "#6b7280" }}>{p.name}</span>
                <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "#e5e7eb" }}>
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                </div>
                <span className="text-xs font-bold text-[#1c1c1e] w-8 text-left">{p.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {quickActions.map((a) => (
          <Link key={a.href} href={a.href}
            className="rounded-xl border p-3 text-center transition-all hover:border-[#8957f6]/40 group"
            style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
            <span className="text-lg">{a.icon}</span>
            <p className="text-[11px] font-semibold text-[#1c1c1e] mt-1 group-hover:text-[#84cc18] transition-colors">{a.label}</p>
          </Link>
        ))}
      </div>

      {/* Row 4: Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Users */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
          <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "#e5e7eb" }}>
            <h3 className="font-bold text-sm text-[#1c1c1e]">أحدث المستخدمين</h3>
            <Link href="/admin/users" className="text-[10px] font-bold" style={{ color: "#84cc18" }}>عرض الكل</Link>
          </div>
          <div className="divide-y" style={{ borderColor: "#e5e7eb" }}>
            {users.slice(0, 10).map((u) => {
              const ps = planStyle[u.plan] ?? planStyle.free;
              return (
                <div key={u.id} className="px-5 py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#1c1c1e]">{u.full_name}</p>
                    <p className="text-[10px]" style={{ color: "#6b7280" }}>{u.email}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: ps.bg, color: ps.color }}>{u.plan}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Ads */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
          <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "#e5e7eb" }}>
            <h3 className="font-bold text-sm text-[#1c1c1e]">آخر الإعلانات</h3>
            <Link href="/admin/ads" className="text-[10px] font-bold" style={{ color: "#84cc18" }}>عرض الكل</Link>
          </div>
          <div className="divide-y" style={{ borderColor: "#e5e7eb" }}>
            {mockRecentAds.map((ad, i) => (
              <div key={i} className="px-5 py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#1c1c1e]">{ad.title}</p>
                  <p className="text-[10px]" style={{ color: "#8957f6" }}>{ad.brand}</p>
                </div>
                <span className="text-[10px]" style={{ color: "#6b7280" }}>{ad.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Requests */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: "#e5e7eb" }}>
            <h3 className="font-bold text-sm text-[#1c1c1e]">طلبات التواصل</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "#e5e7eb" }}>
            {mockContactRequests.map((r, i) => (
              <div key={i} className="px-5 py-2.5">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-xs font-semibold text-[#1c1c1e]">{r.name}</p>
                  <span className="text-[10px]" style={{ color: "#6b7280" }}>{r.date}</span>
                </div>
                <p className="text-[10px]" style={{ color: "#6b7280" }}>{r.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
