/**
 * Contextual Skeleton for Admin Content & Bio Management
 * Matches exact structure: Header, Section Tabs, and Form Fields.
 */
export default function AdminContentLoading() {
  return (
    <div className="space-y-6 w-full min-w-0 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#262628]/60">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-[#1f1f22] rounded-lg" />
          <div className="h-4 w-96 bg-[#18181a] rounded-md" />
        </div>
      </div>

      {/* Section Tabs Skeleton */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#151517] border border-[#262628] w-full overflow-x-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-24 bg-[#1f1f22] rounded-lg shrink-0"
          />
        ))}
      </div>

      {/* Editor Form Card Skeleton */}
      <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] space-y-6 max-w-4xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#262628]">
          <div className="h-4 w-40 bg-[#1f1f22] rounded" />
          <div className="h-8 w-28 bg-[#1f1f22] rounded-lg" />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-[#1f1f22] rounded" />
            <div className="h-10 w-full bg-[#18181a] rounded-lg border border-[#222225]" />
          </div>

          <div className="space-y-1.5">
            <div className="h-3 w-36 bg-[#1f1f22] rounded" />
            <div className="h-24 w-full bg-[#18181a] rounded-lg border border-[#222225]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-3 w-24 bg-[#1f1f22] rounded" />
              <div className="h-10 w-full bg-[#18181a] rounded-lg border border-[#222225]" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-28 bg-[#1f1f22] rounded" />
              <div className="h-10 w-full bg-[#18181a] rounded-lg border border-[#222225]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
