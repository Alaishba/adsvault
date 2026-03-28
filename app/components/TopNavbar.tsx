"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import { getImageUrl } from "../lib/imageUrl";

type SearchResult = { id: string; title: string; type: "ad" | "strategy" | "influencer"; href: string };
type UserInfo = { name: string; plan: string; avatar?: string } | null;

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/library", label: "مكتبة" },
  { href: "/analysis", label: "الاستراتيجيات" },
  { href: "/influencers", label: "المؤثرون" },
  { href: "/saved", label: "المحفوظات" },
  { href: "/blog", label: "المدونة" },
];

export default function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteLogo, setSiteLogo] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Navbar fade on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch site logo — null = loading, then resolve to URL or fallback
  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", "site_logo").single()
      .then(({ data }: { data: { value: string } | null }) => { setSiteLogo(data?.value || "/logo.svg"); })
      .catch(() => { setSiteLogo("/logo.svg"); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load user on mount with mounted guard to prevent lock errors
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted) return;
        if (user) {
          const { data: profile } = await supabase
            .from("users").select("full_name,plan,avatar_url").eq("id", user.id).single();
          if (!mounted) return;
          setUserInfo({ name: profile?.full_name ?? user.email ?? "", plan: profile?.plan ?? "free", avatar: profile?.avatar_url ?? undefined });
        }
      } catch {
        // silently ignore lock errors on unmount
      }
      if (mounted) setAuthLoading(false);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: { user: { id: string; email?: string } } | null) => {
      if (!mounted) return;
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from("users").select("full_name,plan,avatar_url").eq("id", session.user.id).single();
          if (!mounted) return;
          setUserInfo({ name: profile?.full_name ?? session.user.email ?? "", plan: profile?.plan ?? "free", avatar: profile?.avatar_url ?? undefined });
        } catch {
          // ignore
        }
      } else {
        setUserInfo(null);
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults([]); setShowSearch(false); return; }
    const results: SearchResult[] = [];
    const { data: ads } = await supabase.from("ads").select("id,title").ilike("title", `%${q}%`).limit(5);
    if (ads) ads.forEach((a: { id: string; title: string }) => results.push({ id: a.id, title: a.title, type: "ad", href: "/library" }));
    const { data: strats } = await supabase.from("strategies").select("id,title").ilike("title", `%${q}%`).limit(3);
    if (strats) strats.forEach((s: { id: string; title: string }) => results.push({ id: s.id, title: s.title, type: "strategy", href: "/analysis" }));
    const { data: infs } = await supabase.from("influencers").select("id,name").ilike("name", `%${q}%`).limit(3);
    if (infs) infs.forEach((i: { id: string; name: string }) => results.push({ id: i.id, title: i.name, type: "influencer", href: "/influencers" }));
    setSearchResults(results);
    setShowSearch(results.length > 0);
  }, [supabase]);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search, doSearch]);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    } finally {
      window.location.href = '/';
    }
  };

  const initials = userInfo?.name
    ? userInfo.name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "؟";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-opacity duration-300 ${scrolled ? "opacity-25" : "opacity-100"}`}>
      <div className="relative flex items-center gap-3 px-4 lg:px-8 py-5">
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '50px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 100%)',
            zIndex: -1
          }}
        />
        {/* Mobile hamburger */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* RIGHT side: Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          {siteLogo ? (
            <img src={siteLogo} alt="Molhm" className="h-16 w-16 rounded-xl object-contain" />
          ) : (
            <div style={{width: 64, height: 64}} />
          )}
          <div className="hidden sm:block">
            <p className="font-black text-base leading-tight text-white">Molhm</p>
          </div>
        </Link>

        {/* CENTER: Single pill nav container (desktop) */}
        <nav className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-1 rounded-full backdrop-blur-md bg-white/10 border border-white/20 px-4 py-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}
                  className={`px-4 py-2 rounded-full text-base font-semibold transition-all ${
                    active
                      ? "bg-white/30 text-white"
                      : "text-slate-800 hover:bg-white/15 hover:text-white"
                  }`}>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Search (compact, hidden on desktop nav) */}
        <div className="relative flex lg:hidden flex-1 mx-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/15">
            <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#94a3b8" }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              placeholder="ابحث..."
              className="bg-transparent outline-none w-full min-w-0 text-sm placeholder:text-slate-400 text-white" dir="rtl" />
          </div>
          {showSearch && searchResults.length > 0 && (
            <div className="absolute top-full mt-1 right-0 left-0 rounded-xl border shadow-lg overflow-hidden"
              style={{ background: "rgba(15,23,42,0.95)", borderColor: "rgba(255,255,255,0.1)", zIndex: 9999, backdropFilter: "blur(12px)" }}>
              {searchResults.map((r) => (
                <Link key={r.id} href={r.href}
                  onClick={() => { setShowSearch(false); setSearch(""); }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/10 transition-colors text-white">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                    style={{ background: r.type === "ad" ? "rgba(37,99,235,0.2)" : r.type === "strategy" ? "rgba(51,65,85,0.5)" : "rgba(37,99,235,0.15)",
                      color: r.type === "ad" ? "#60a5fa" : r.type === "strategy" ? "#cbd5e1" : "#60a5fa" }}>
                    {r.type === "ad" ? "إعلان" : r.type === "strategy" ? "استراتيجية" : "مؤثر"}
                  </span>
                  <span className="truncate">{r.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* LEFT side: Auth */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Loading skeleton */}
          {authLoading && (
            <div className="flex items-center gap-2">
              <div className="w-16 h-8 rounded-full bg-white/10 animate-pulse" />
              <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
            </div>
          )}

          {!authLoading && !userInfo && (
            <div className="flex items-center gap-2">
              <Link href="/login"
                className="px-5 py-2.5 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 text-base font-semibold text-white hover:bg-white/20 transition-all">
                دخول
              </Link>
              <Link href="/register"
                className="px-5 py-2.5 rounded-full text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all">
                تسجيل
              </Link>
            </div>
          )}

          {!authLoading && userInfo && (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-all">
                <span className="hidden sm:inline text-base text-slate-200 font-medium">مرحباً {userInfo.name}</span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 overflow-hidden bg-blue-600">
                  {userInfo.avatar ? (
                    <img src={getImageUrl("user-avatars", userInfo.avatar)} alt="" className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = "/fallback.png"; e.currentTarget.style.display = "block"; }} />
                  ) : (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-slate-800">
                      <img
                        src="/logo.png"
                        alt="avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </button>
              {dropdownOpen && (
                <div className="absolute top-full mt-2 left-0 w-48 rounded-xl border shadow-lg overflow-hidden z-50"
                  style={{ background: "rgba(15,23,42,0.95)", borderColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
                  <Link href="/profile" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-white/10 transition-colors text-white">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    حسابي
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-white/10 transition-colors text-right"
                    style={{ color: "#ef4444" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-full left-4 right-4 z-50 lg:hidden rounded-xl shadow-xl mt-2 bg-[#ced3de] border border-[#ced3de]">
            <nav className="flex flex-col px-3 py-3 gap-0.5">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      active ? "bg-blue-600 text-white" : "text-slate-900 hover:bg-slate-200"
                    }`}>
                    {link.label}
                  </Link>
                );
              })}
              <div className="border-t border-slate-300 mt-2 pt-2">
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm text-slate-700 block font-medium">حسابي</Link>
                <Link href="/terms" onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-xs text-slate-500 block">الشروط والأحكام</Link>
                <Link href="/removal" onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-xs text-slate-500 block">طلب إزالة محتوى</Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
