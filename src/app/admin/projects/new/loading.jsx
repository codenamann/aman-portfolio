/**
 * Contextual Skeleton for New Project Creation Page
 */
export default function AdminNewProjectLoading() {
  return (
    <div className="space-y-6 max-w-4xl min-w-0 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#262628]/60">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-[#1f1f22] rounded-lg" />
          <div className="h-4 w-80 bg-[#18181a] rounded-md" />
        </div>
      </div>

      {/* Source Step Card Skeleton */}
      <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] space-y-5">
        <div className="h-4 w-32 bg-[#1f1f22] rounded" />

        <div className="space-y-2">
          <div className="h-3 w-40 bg-[#1f1f22] rounded" />
          <div className="h-10 w-full bg-[#18181a] rounded-lg border border-[#222225]" />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-28 bg-[#1f1f22] rounded" />
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <div className="h-10 rounded-xl bg-[#18181a] border border-[#222225]" />
            <div className="h-10 rounded-xl bg-[#18181a] border border-[#222225]" />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <div className="h-10 w-44 rounded-xl bg-[#1f1f22]" />
        </div>
      </div>
    </div>
  );
}
