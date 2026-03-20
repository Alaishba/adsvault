"use client";

import { useState } from "react";

export interface FilterConfig {
  key: string;
  label: string;
  options: string[];
}

export interface SortOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  filters: FilterConfig[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string | null) => void;
  sortOptions?: SortOption[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
  resultCount?: number;
}

export default function FilterBar({
  filters,
  activeFilters,
  onFilterChange,
  sortOptions,
  sortValue,
  onSortChange,
  resultCount,
}: FilterBarProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const hasActive = Object.values(activeFilters).some(Boolean);

  const clearAll = () => {
    filters.forEach((f) => onFilterChange(f.key, null));
    setOpenFilter(null);
  };

  return (
    <div className="border-b border-[--border] px-4 lg:px-10 py-3 overflow-visible"
      style={{ background: "var(--card)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", position: "relative", zIndex: 20 }}>
      <div className="flex items-center gap-2 min-w-max lg:min-w-0 lg:flex-wrap overflow-x-auto overflow-y-visible">
        {filters.map((filter) => {
          const active = activeFilters[filter.key];
          return (
            <div key={filter.key} className="relative shrink-0">
              <button
                onClick={() => setOpenFilter(openFilter === filter.key ? null : filter.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap"
                style={active
                  ? { background: "#84cc18", color: "#fff", borderColor: "#84cc18" }
                  : { background: "var(--surface2)", color: "var(--text-secondary)", borderColor: "var(--border)" }
                }>
                {active ? active : filter.label}
                {active ? (
                  <span
                    onClick={(e) => { e.stopPropagation(); onFilterChange(filter.key, null); }}
                    className="font-bold opacity-80 hover:opacity-100 mr-0.5 cursor-pointer">×</span>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-60">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                )}
              </button>

              {openFilter === filter.key && (
                <>
                  <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={() => setOpenFilter(null)} />
                  <div className="absolute top-full mt-1.5 right-0 min-w-[150px] rounded-xl border border-[--border] shadow-xl overflow-hidden"
                    style={{ zIndex: 9999, background: "var(--card)" }}>
                    {filter.options.map((opt) => (
                      <button key={opt}
                        onClick={() => { onFilterChange(filter.key, opt); setOpenFilter(null); }}
                        className="w-full text-right px-4 py-2.5 text-xs hover:bg-[--surface2] transition-colors flex items-center justify-between gap-3"
                        style={{
                          color: active === opt ? "#84cc18" : "var(--text-primary)",
                          background: active === opt ? "var(--accent-light)" : undefined,
                          fontWeight: active === opt ? 600 : 400,
                        }}>
                        {opt}
                        {active === opt && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#84cc18" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {hasActive && (
          <button onClick={clearAll}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 whitespace-nowrap"
            style={{ color: "#b91c1c", background: "#fef2f2" }}>
            مسح الكل
          </button>
        )}

        <div className="flex-1" />

        {resultCount !== undefined && (
          <span className="text-xs shrink-0 whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
            {resultCount} نتيجة
          </span>
        )}

        {sortOptions && onSortChange && (
          <select value={sortValue} onChange={(e) => onSortChange(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-[--border] outline-none cursor-pointer shrink-0"
            style={{ background: "var(--surface2)", color: "var(--text-primary)" }}>
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
