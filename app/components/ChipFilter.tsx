"use client";

export interface FilterConfig {
  key: string;
  label: string;
  options: string[];
}

export interface SortOption {
  value: string;
  label: string;
}

interface ChipFilterProps {
  filters: FilterConfig[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string | null) => void;
  sortOptions?: SortOption[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
  resultCount?: number;
}

export default function ChipFilter({
  filters,
  activeFilters,
  onFilterChange,
  sortOptions,
  sortValue,
  onSortChange,
  resultCount,
}: ChipFilterProps) {
  const hasActive = Object.values(activeFilters).some(Boolean);

  return (
    <div className="px-4 lg:px-10 py-4 mx-auto max-w-4xl" style={{ position: "relative", zIndex: 20 }}>
      <div className="flex flex-wrap gap-3 items-center">
        {/* Filter dropdowns */}
        {filters.map((filter) => (
          <select
            key={filter.key}
            value={activeFilters[filter.key] ?? ""}
            onChange={(e) => onFilterChange(filter.key, e.target.value || null)}
            className="bg-[#ced3de] border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 cursor-pointer outline-none font-medium"
          >
            <option value="">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ))}

        {/* Sort dropdown */}
        {sortOptions && onSortChange && (
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[#ced3de] border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 cursor-pointer outline-none font-medium"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>ترتيب: {o.label}</option>
            ))}
          </select>
        )}

        {/* Result count */}
        {resultCount !== undefined && (
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {resultCount} نتيجة
          </span>
        )}

        {/* Clear all */}
        {hasActive && (
          <button
            onClick={() => filters.forEach((f) => onFilterChange(f.key, null))}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 border border-red-400/20 hover:bg-red-500/20 transition-all"
          >
            مسح الكل
          </button>
        )}
      </div>
    </div>
  );
}
