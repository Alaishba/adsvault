export function SkeletonCard() {
  return (
    <div className="card-base p-4 animate-pulse">
      <div className="w-full h-36 rounded-lg bg-gray-200 dark:bg-[#222] mb-4" />
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-[#222] shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-[#222] rounded w-24" />
          <div className="h-2.5 bg-gray-200 dark:bg-[#222] rounded w-16" />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-gray-200 dark:bg-[#222] rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-[#222] rounded w-4/5" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-14 bg-gray-200 dark:bg-[#222] rounded-md" />
        <div className="h-5 w-10 bg-gray-200 dark:bg-[#222] rounded-md" />
      </div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
