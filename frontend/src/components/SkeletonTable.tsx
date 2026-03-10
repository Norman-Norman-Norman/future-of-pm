interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export default function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <div className="animate-pulse w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header row */}
      <div className="flex gap-4 px-4 py-3 bg-gray-100 dark:bg-gray-700">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-300 dark:bg-gray-500 rounded flex-1" />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex gap-4 px-4 py-3 border-t border-gray-200 dark:border-gray-700"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-4 bg-gray-200 dark:bg-gray-600 rounded flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
