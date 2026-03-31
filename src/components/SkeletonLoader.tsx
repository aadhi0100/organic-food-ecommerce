export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800">
      <div className="h-52 animate-pulse bg-gray-200 dark:bg-gray-700" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-3 w-3 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="h-7 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonList({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
