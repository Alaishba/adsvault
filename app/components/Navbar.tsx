"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import { getImageUrl } from "../lib/imageUrl";

type SearchResult = { id: string; title: string; type: "ad" | "strategy" | "influencer"; href: string };
type UserInfo = { name: string; plan: string; avatar?: string } | null;

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const supabase = createClient();
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load user on mount
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("users").select("full_name,plan,avatar_url").eq("id", user.id).single();
        setUserInfo({ name: profile?.full_name ?? user.email ?? "", plan: profile?.plan ?? "free", avatar: profile?.avatar_url ?? undefined });
      }
      setAuthLoading(false);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: { user: { id: string; email?: string } } | null) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("users").select("full_name,plan,avatar_url").eq("id", session.user.id).single();
        setUserInfo({ name: profile?.full_name ?? session.user.email ?? "", plan: profile?.plan ?? "free", avatar: profile?.avatar_url ?? undefined });
      } else {
        setUserInfo(null);
      }
    });

    return () => subscription.unsubscribe();
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
    await supabase.auth.signOut();
    setUserInfo(null);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const initials = userInfo?.name
    ? userInfo.name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "؟";
  const isPro = userInfo?.plan === "pro" || userInfo?.plan === "enterprise" || userInfo?.plan === "admin";

  return (
    <header className="fixed top-0 right-0 lg:right-64 left-0 z-30 flex items-center gap-3 px-4 lg:px-6"
      style={{ background: "rgba(137,87,246,0.07)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(137,87,246,0.15)", height: "64px" }}>

      {/* Mobile hamburger */}
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg transition-colors" style={{ color: "#6b7280" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Logo mobile */}
      <Link href="/" className="lg:hidden flex items-center gap-2 shrink-0">
        <img src="/logo.svg" alt="Mulhem" className="h-8 w-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <span className="font-black text-sm" style={{ color: "#1c1c1e" }}>Mulhem</span>
      </Link>

      {/* Logo desktop */}
      <Link href="/" className="hidden lg:flex items-center gap-3 shrink-0 min-w-0">
        <img src="/logo.svg" alt="Mulhem" className="h-8 w-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div className="min-w-0">
          <p className="font-black text-base leading-tight whitespace-nowrap" style={{ color: "#1c1c1e" }}>
            Mulhem <span style={{ color: "#84cc18" }}>MENA</span>
          </p>
          <p className="text-xs whitespace-nowrap" style={{ color: "#6b7280" }}>ذكاء إعلاني استراتيجي</p>
        </div>
      </Link>

      {/* Search */}
      <div className="flex-1 min-w-0 mx-2 relative">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl w-full"
          style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(137,87,246,0.15)" }}>
          <svg className="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#9ca3af" }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            placeholder="ابحث عن استراتيجية أو قطاع أو براند..."
            className="bg-transparent outline-none w-full min-w-0 text-sm placeholder:text-[#9ca3af]"
            style={{ color: "#1c1c1e" }} dir="rtl" />
        </div>
        {showSearch && searchResults.length > 0 && (
          <div className="absolute top-full mt-1 right-0 left-0 rounded-xl border shadow-lg overflow-hidden"
            style={{ background: "#ffffff", borderColor: "#e5e7eb", zIndex: 9999 }}>
            {searchResults.map((r) => (
              <Link key={r.id} href={r.href}
                onClick={() => { setShowSearch(false); setSearch(""); }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                style={{ color: "#1c1c1e" }}>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                  style={{ background: r.type === "ad" ? "#f7fee7" : r.type === "strategy" ? "#f3eeff" : "#eff6ff",
                    color: r.type === "ad" ? "#84cc18" : r.type === "strategy" ? "#8957f6" : "#2563eb" }}>
                  {r.type === "ad" ? "إعلان" : r.type === "strategy" ? "استراتيجية" : "مؤثر"}
                </span>
                <span className="truncate">{r.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Not logged in */}
        {!authLoading && !userInfo && (
          <div className="flex items-center gap-2">
            <Link href="/login"
              className="hidden sm:flex px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:border-[#84cc18]/40"
              style={{ borderColor: "#e5e7eb", color: "#1c1c1e" }}>دخول</Link>
            <Link href="/register"
              className="hidden sm:flex px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "#84cc18" }}>حساب جديد</Link>
          </div>
        )}

        {/* Free user → upgrade */}
        {!authLoading && userInfo && !isPro && (
          <Link href="/pricing"
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ background: "#8957f6", color: "#fff" }}>ترقية Pro +</Link>
        )}

        {/* Logged in → avatar + dropdown */}
        {!authLoading && userInfo && (
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer shrink-0 hover:opacity-90 transition-all overflow-hidden"
              style={{ background: "#8957f6" }}>
              {userInfo.avatar ? (
                <img src={getImageUrl("user-avatars", userInfo.avatar)} alt="" className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/fallback.png"; e.currentTarget.style.display = "block"; }} />
              ) : initials}
            </button>
            {dropdownOpen && (
              <div className="absolute top-full mt-2 left-0 w-48 rounded-xl border shadow-lg overflow-hidden z-50"
                style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
                <Link href="/profile" onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                  style={{ color: "#1c1c1e" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  حسابي
                </Link>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-gray-50 transition-colors text-right"
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
    </header>
  );
}
