"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const mainNav = [
  { href: "/", label: "الرئيسية", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { href: "/library", label: "مكتبة", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { href: "/analysis", label: "الاستراتيجيات", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { href: "/influencers", label: "المؤثرون", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { href: "/planner", label: "مخطط الحملة", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, badge: "جديد" },
  { href: "/library?saved=true", label: "المحفوظات", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg> },
  { href: "/blog", label: "المدونة", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
];

const secondaryNav = [
  { href: "/pricing", label: "الاشتراكات", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { href: "/profile", label: "حسابي", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

const bottomNav = [
  { href: "/terms", label: "الشروط والأحكام" },
  { href: "/removal", label: "طلب إزالة محتوى" },
];

export default function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isPro = user?.plan === "pro" || user?.plan === "enterprise" || user?.plan === "admin";
  const isActive = (href: string) => {
    if (href === "/library?saved=true") return false;
    return pathname === href;
  };

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed top-0 right-0 h-full w-64 flex flex-col z-40 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
        style={{
          background: "rgba(220,225,235,0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderLeft: "1px solid rgba(209,209,214,0.5)",
        }}
      >
        {/* Logo */}
        <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(209,209,214,0.5)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black"
            style={{ background: "#84cc18", color: "#fff" }}>AV</div>
          <div>
            <p className="font-black text-sm leading-tight" style={{ color: "#1c1c1e" }}>AdVault</p>
            <p className="text-xs font-bold" style={{ color: "#84cc18" }}>MENA</p>
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          <ul className="space-y-0.5">
            {mainNav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: active ? "rgba(132,204,24,0.15)" : "transparent",
                      color: active ? "#84cc18" : "#6b7280",
                    }}>
                    <span style={{ color: active ? "#84cc18" : "#6b7280" }}>{item.icon}</span>
                    <span className={active ? "font-semibold" : ""}>{item.label}</span>
                    {"badge" in item && item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold mr-auto"
                        style={{ background: "#8957f6", color: "#fff" }}>{item.badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-3 border-t" style={{ borderColor: "rgba(209,209,214,0.5)" }} />

          <ul className="space-y-0.5">
            {secondaryNav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: active ? "rgba(132,204,24,0.15)" : "transparent",
                      color: active ? "#84cc18" : "#6b7280",
                    }}>
                    <span style={{ color: active ? "#84cc18" : "#6b7280" }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Welcome message */}
          {user && (
            <div className="mt-3 mx-1 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.5)" }}>
              <p className="text-xs font-semibold" style={{ color: "#1c1c1e" }}>
                مرحباً {user.name || "بك"} 👋
              </p>
            </div>
          )}

          {/* Pro upgrade card — only for free users */}
          {!isPro && (
            <div className="mt-3 mx-1 p-3 rounded-xl" style={{
              background: "rgba(132, 204, 24, 0.1)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(132, 204, 24, 0.25)",
              maxHeight: "110px",
            }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black" style={{ color: "#84cc18" }}>Pro</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: "#84cc18", color: "#fff" }}>جديد</span>
              </div>
              <p className="text-[11px] mb-2 leading-relaxed" style={{ color: "#6b7280" }}>
                تمتع بوصول كامل لجميع المزايا الحصرية
              </p>
              <Link href="/pricing"
                className="block w-full py-1.5 rounded-lg text-[11px] font-bold text-center text-white transition-all hover:opacity-90"
                style={{ background: "#84cc18" }}>
                ترقية الآن
              </Link>
            </div>
          )}
        </nav>

        {/* Bottom links */}
        <div className="px-3 py-3" style={{ borderTop: "1px solid rgba(209,209,214,0.5)" }}>
          {bottomNav.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center px-3 py-2 text-xs rounded-xl transition-colors"
              style={{ color: "#9ca3af" }}>
              {item.label}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
