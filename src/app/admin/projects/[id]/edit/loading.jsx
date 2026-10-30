/**
 * Contextual Skeleton for Project Edit Page
 * Matches exact structure: Header, Form Cards (Basic, Media, Status, Tools, Actions).
 */
export default function AdminProjectEditLoading() {
  return (
    <div className="space-y-6 max-w-4xl min-w-0 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#262628]/60">
        <div className="space-y-2">
          <div className="h-7 w-72 bg-[#1f1f22] rounded-lg" />
          <div className="h-4 w-48 bg-[#18181a] rounded-md" />
        </div>
      </div>

      {/* Basic Info Card Skeleton */}
      <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] space-y-4">
        <div className="h-4 w-44 bg-[#1f1f22] rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="h-3 w-32 bg-[#1f1f22] rounded" />
            <div className="h-10 w-full bg-[#18181a] rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-[#1f1f22] rounded" />
            <div className="h-10 w-full bg-[#18181a] rounded-lg" />
          </div>
        </div>
      </div>

      {/* Media Fields Card Skeleton */}
      <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] space-y-4">
        <div className="h-4 w-48 bg-[#1f1f22] rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 w-full bg-[#18181a] rounded-lg" />
          <div className="h-10 w-full bg-[#18181a] rounded-lg" />
        </div>
        <div className="h-10 w-full bg-[#18181a] rounded-lg" />
      </div>

      {/* Form Action Buttons Skeleton */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <div className="h-10 w-24 bg-[#18181a] rounded-lg" />
        <div className="h-10 w-32 bg-[#1f1f22] rounded-lg" />
      </div>
    </div>
  );
}
