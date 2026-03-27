"use client";

import { useState, useEffect } from "react";
import type { Ad } from "../lib/mockData";
import PlatformBadge from "./PlatformBadge";
import { getImageUrl } from "../lib/imageUrl";

function BookmarkButton({ adId }: { adId: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem("savedAds") ?? "[]");
      setSaved(ids.includes(adId));
    } catch { /* */ }
  }, [adId]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const ids: string[] = JSON.parse(localStorage.getItem("savedAds") ?? "[]");
      const next = ids.includes(adId) ? ids.filter((id) => id !== adId) : [...ids, adId];
      localStorage.setItem("savedAds", JSON.stringify(next));
      setSaved(next.includes(adId));
    } catch { /* */ }
  };

  return (
    <button
      onClick={toggle}
      className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
      style={{
        background: saved ? "#2563eb" : "rgba(0,0,0,0.35)",
        backdropFilter: "blur(4px)",
      }}
      title={saved ? "إزالة من المحفوظات" : "حفظ"}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill={saved ? "#fff" : "none"}
        stroke="#fff"
        strokeWidth="2"
      >
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </svg>
    </button>
  );
}

export default function AdCard({ ad, onClick }: { ad: Ad; onClick: (ad: Ad) => void }) {
  return (
    <article
      onClick={() => onClick(ad)}
      className="rounded-xl cursor-pointer group p-0 overflow-hidden transition-all duration-200 hover:shadow-md hover:scale-[1.02] bg-[#ced3de] border border-[#ced3de]"
      style={{ height: 360 }}
    >
      {/* Thumbnail */}
      <div
        className="w-full h-52 flex items-center justify-center relative overflow-hidden"
        style={{ background: `${ad.brandColor ?? "#2563eb"}18` }}
      >
        {(ad.images ?? []).length > 0 ? (
          <img src={getImageUrl("ads-images", (ad.images ?? [])[0])} alt={ad.title}
            className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/fallback.png"; e.currentTarget.style.display = "block"; }} />
        ) : (
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white"
            style={{ background: ad.brandColor ?? "#2563eb" }}>
            {ad.brandInitial ?? (ad.brand ?? "?")[0]}
          </div>
        )}
        <div className="absolute top-3 left-3">
          <PlatformBadge platform={ad.platform} />
        </div>
        <BookmarkButton adId={ad.id} />
      </div>

      {/* Content */}
      <div className="p-4 overflow-hidden">
        <p className="text-xs font-extrabold mb-1 truncate text-slate-700">
          {ad.brand}
        </p>
        <h3 className="text-sm font-bold leading-snug mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors text-slate-900">
          {ad.title}
        </h3>
        <p className="text-xs leading-relaxed line-clamp-2 mb-3 text-slate-700">
          {ad.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#ced3de]/50 min-w-0">
          <div className="flex items-center gap-3 text-xs min-w-0 overflow-hidden text-slate-700">
            <span className="flex items-center gap-1 shrink-0">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {ad.views}
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
              </svg>
              {ad.saved}
            </span>
          </div>
          <span className="text-xs shrink-0 mr-2 truncate text-slate-700">
            {ad.country}
          </span>
        </div>
      </div>
    </article>
  );
}
