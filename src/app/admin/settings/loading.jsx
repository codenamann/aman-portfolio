/**
 * Contextual Skeleton for Admin Settings
 * Matches exact structure: Header, Environment Checklist, and Security Guarantees.
 */
export default function AdminSettingsLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl min-w-0 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#262628]/60">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-[#1f1f22] rounded-lg" />
          <div className="h-4 w-96 bg-[#18181a] rounded-md" />
        </div>
      </div>

      {/* Environment Health Check Card Skeleton */}
      <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-48 bg-[#1f1f22] rounded" />
          <div className="h-5 w-24 bg-[#1f1f22] rounded-full" />
        </div>

        <div className="space-y-3 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-3.5 rounded-lg bg-[#18181a] border border-[#222225] flex items-center justify-between gap-3"
            >
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-36 bg-[#1f1f22] rounded" />
                <div className="h-2.5 w-64 bg-[#141416] rounded" />
              </div>
              <div className="w-5 h-5 bg-[#1f1f22] rounded-full shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Security Architecture Card Skeleton */}
      <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] space-y-4">
        <div className="h-4 w-40 bg-[#1f1f22] rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-[#18181a] border border-[#222225] space-y-1.5"
            >
              <div className="h-3.5 w-32 bg-[#1f1f22] rounded" />
              <div className="h-2.5 w-full bg-[#141416] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
