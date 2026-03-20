"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNav = [
  { href: "/admin/dashboard", label: "لوحة التحكم", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { href: "/admin/ads", label: "الإعلانات", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { href: "/admin/users", label: "المستخدمون", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { href: "/admin/influencers", label: "المؤثرون", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg> },
  { href: "/admin/strategies", label: "الاستراتيجيات", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { href: "/admin/blog", label: "إدارة المدونة", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  { href: "/admin/requests", label: "مركز الطلبات", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
  { href: "/admin/terms", label: "الشروط والأحكام", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { href: "/admin/analytics", label: "تحليلات متقدمة", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { href: "/admin/planner-settings", label: "إعدادات المخطط", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  { href: "/admin/appsflyer", label: "ربط AppsFlyer", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> },
  { href: "/admin/guide", label: "الدليل", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
];

function AdminSidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed top-0 right-0 h-full w-64 flex flex-col z-40 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
        style={{ background: "#ffffff", borderLeft: "1px solid #e5e7eb" }}
      >
        <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid #e5e7eb" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white" style={{ background: "#8957f6" }}>AV</div>
          <div>
            <p className="font-black text-sm leading-tight" style={{ color: "#1c1c1e" }}>AdVault</p>
            <p className="text-xs font-bold" style={{ color: "#ef4444" }}>Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          <ul className="space-y-0.5">
            {adminNav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: active ? "rgba(132,204,24,0.12)" : "transparent",
                      color: active ? "#84cc18" : "#6b7280",
                    }}>
                    <span style={{ color: active ? "#84cc18" : "#9ca3af" }}>{item.icon}</span>
                    <span className={active ? "font-semibold" : ""}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-3 py-3" style={{ borderTop: "1px solid #e5e7eb" }}>
          <Link href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors hover:bg-gray-50"
            style={{ color: "#9ca3af" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            العودة للموقع
          </Link>
        </div>
      </aside>
    </>
  );
}

function AdminNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="fixed top-0 right-0 lg:right-64 left-0 z-30 flex items-center gap-3 px-4 lg:px-6"
      style={{ background: "#ffffff", borderBottom: "1px solid #e5e7eb", height: "56px" }}>
      <button onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors" style={{ color: "#6b7280" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <p className="font-black text-sm" style={{ color: "#1c1c1e" }}>لوحة الإدارة</p>
    </header>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:mr-64 min-h-screen overflow-x-hidden min-w-0">
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="pt-14 min-w-0">{children}</main>
      </div>
    </div>
  );
}
