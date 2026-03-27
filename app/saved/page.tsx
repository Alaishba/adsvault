"use client";

import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import AdCard from "../components/AdCard";
import AdModal from "../components/AdModal";
import { createClient } from "../lib/supabase/client";
import { type Ad } from "../lib/mockData";
import Link from "next/link";

export default function SavedAdsPage() {
  const supabase = createClient();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted) return;
        if (!user) { setLoading(false); return; }
        setLoggedIn(true);

        // Fetch saved ad IDs
        const { data: savedRows } = await supabase
          .from("saved_ads")
          .select("ad_id")
          .eq("user_id", user.id);

        if (!mounted) return;
        if (!savedRows || savedRows.length === 0) { setLoading(false); return; }

        const adIds = savedRows.map((r: { ad_id: string }) => r.ad_id);

        // Fetch the actual ads
        const { data: adsData } = await supabase
          .from("ads")
          .select("*")
          .in("id", adIds);

        if (!mounted) return;
        if (adsData) setAds(adsData as Ad[]);
        setLoading(false);
      } catch {
        // silently ignore lock errors on unmount
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout>
      <div className="px-6 lg:px-10 py-8">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold" style={{ color: "#ffffff" }}>المحفوظات</h1>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>الإعلانات التي قمت بحفظها</p>
        </div>

        {loading ? (
          <div className="text-center py-20" style={{ color: "#94a3b8" }}>جارٍ التحميل...</div>
        ) : !loggedIn ? (
          <div className="text-center py-20 rounded-2xl" style={{ background: "rgba(206,211,222,0.3)", border: "1px solid rgba(206,211,222,0.5)" }}>
            <div className="text-4xl mb-3">🔒</div>
            <p className="font-bold mb-2" style={{ color: "#ffffff" }}>سجّل دخولك لعرض المحفوظات</p>
            <Link href="/login" className="inline-block px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "#2563eb" }}>
              تسجيل الدخول
            </Link>
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-20 rounded-2xl" style={{ background: "rgba(206,211,222,0.3)", border: "1px solid rgba(206,211,222,0.5)" }}>
            <div className="text-4xl mb-3">📌</div>
            <p className="font-bold" style={{ color: "#ffffff" }}>لم تحفظ أي إعلان بعد</p>
            <p className="text-sm mt-1 mb-4" style={{ color: "#94a3b8" }}>احفظ الإعلانات من المكتبة لتعود إليها لاحقاً</p>
            <Link href="/library" className="inline-block px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "#2563eb" }}>
              استعرض المكتبة
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} onClick={setSelectedAd} />
            ))}
          </div>
        )}
      </div>

      <AdModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
    </AppLayout>
  );
}
