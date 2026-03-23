"use client";

import { useState, useMemo, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import AdCard from "../components/AdCard";
import AdModal from "../components/AdModal";
import FilterBar from "../components/FilterBar";
import { SkeletonList } from "../components/Skeleton";
import { type Ad } from "../lib/mockData";
import { fetchAds } from "../lib/db";

const filterConfigs = [
  { key: "sector", label: "القطاع", options: ["تجزئة", "اتصالات", "تجارة إلكترونية", "مواد استهلاكية"] },
  { key: "platform", label: "المنصة", options: ["Meta", "TikTok", "Snap", "YouTube", "Instagram"] },
  { key: "country", label: "الدولة", options: ["السعودية", "الإمارات", "الكويت", "مصر"] },
  { key: "funnel_stage", label: "مرحلة القمع", options: ["awareness", "interest", "conversion"] },
];

const sortOptions = [
  { value: "newest", label: "الأحدث" },
  { value: "most_saved", label: "الأكثر حفظاً" },
  { value: "most_viewed", label: "الأكثر مشاهدة" },
];

export default function LibraryPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds().then((data) => { setAds(data); setLoading(false); });
  }, []);

  const handleFilterChange = (key: string, value: string | null) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (value === null) delete next[key];
      else next[key] = value;
      return next;
    });
  };

  const filtered = useMemo(() => {
    return ads.filter((ad) => {
      if (activeFilters.sector && ad.sector !== activeFilters.sector) return false;
      if (activeFilters.platform && ad.platform !== activeFilters.platform) return false;
      if (activeFilters.country && ad.country !== activeFilters.country) return false;
      if (activeFilters.funnel_stage && ad.funnel_stage !== activeFilters.funnel_stage) return false;
      return true;
    });
  }, [ads, activeFilters]);

  return (
    <AppLayout>
      <FilterBar
        filters={filterConfigs}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        sortOptions={sortOptions}
        sortValue={sort}
        onSortChange={setSort}
        resultCount={filtered.length}
      />

      <div className="px-6 lg:px-10 py-6 min-w-0 overflow-hidden">
        <div className="mb-5">
          <h1 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>مكتبة الإعلانات</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>{filtered.length} إعلان</p>
        </div>

        {loading ? (
          <SkeletonList />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: "var(--text-secondary)" }}>
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold">لا توجد نتائج مطابقة</p>
            <p className="text-sm mt-1">جرّب تعديل الفلاتر</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((ad) => (
              <AdCard key={ad.id} ad={ad} onClick={setSelectedAd} />
            ))}
          </div>
        )}
      </div>

      <AdModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
    </AppLayout>
  );
}
