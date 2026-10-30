/**
 * Contextual Skeleton for Admin Dashboard
 * Mimics exact structure of Dashboard: Header, KPI Grid, Quick Nav, and Recent Projects.
 */
export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 w-full min-w-0 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#262628]/60">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-[#1f1f22] rounded-lg" />
          <div className="h-4 w-80 bg-[#18181a] rounded-md" />
        </div>
        <div className="h-10 w-36 bg-[#1f1f22] rounded-lg shrink-0" />
      </div>

      {/* KPI Metric Cards Skeleton (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 rounded-xl bg-[#151517] border border-[#262628] flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-[#1f1f22] rounded" />
              <div className="w-5 h-5 bg-[#1f1f22] rounded" />
            </div>
            <div className="mt-4 space-y-1.5">
              <div className="h-7 w-16 bg-[#1f1f22] rounded" />
              <div className="h-3 w-32 bg-[#18181a] rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Nav Cards Skeleton (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-[#151517] border border-[#262628] space-y-2"
          >
            <div className="h-4 w-32 bg-[#1f1f22] rounded" />
            <div className="h-3 w-48 bg-[#18181a] rounded" />
          </div>
        ))}
      </div>

      {/* Recent Projects Table / Cards Skeleton */}
      <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-36 bg-[#1f1f22] rounded" />
          <div className="h-3 w-20 bg-[#18181a] rounded" />
        </div>
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-[#18181a] border border-[#222225]"
            >
              <div className="w-14 h-9 rounded-md bg-[#1f1f22] shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-48 bg-[#1f1f22] rounded" />
                <div className="h-2.5 w-24 bg-[#222226] rounded" />
              </div>
              <div className="h-6 w-16 bg-[#1f1f22] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
