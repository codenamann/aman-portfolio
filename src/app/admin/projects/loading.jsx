/**
 * Contextual Skeleton for Admin Projects Manager
 * Matches exact structure: Header, Curation Tabs, Toolbar, and 7-Column Table.
 */
export default function AdminProjectsLoading() {
  return (
    <div className="space-y-5 sm:space-y-6 w-full min-w-0 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#262628]/60">
        <div className="space-y-2">
          <div className="h-7 w-60 bg-[#1f1f22] rounded-lg" />
          <div className="h-4 w-96 bg-[#18181a] rounded-md" />
        </div>
        <div className="h-10 w-32 bg-[#1f1f22] rounded-lg shrink-0" />
      </div>

      {/* Segmented Curation Tabs Skeleton */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#151517] border border-[#262628] w-full sm:w-fit overflow-x-auto">
        <div className="h-8 w-28 bg-[#1f1f22] rounded-lg shrink-0" />
        <div className="h-8 w-44 bg-[#18181a] rounded-lg shrink-0" />
        <div className="h-8 w-36 bg-[#18181a] rounded-lg shrink-0" />
      </div>

      {/* Toolbar Skeleton */}
      <div className="p-3 sm:p-4 rounded-xl bg-[#151517] border border-[#262628] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="h-9 flex-1 max-w-sm bg-[#18181a] rounded-lg" />
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 bg-[#18181a] rounded-lg" />
          <div className="h-9 w-24 bg-[#18181a] rounded-lg" />
          <div className="h-9 w-28 bg-[#18181a] rounded-lg" />
        </div>
      </div>

      {/* Table Skeleton (Matching Standardized 7-Column Layout) */}
      <div className="rounded-xl border border-[#262628] bg-[#151517] overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[800px] table-fixed">
            <thead>
              <tr className="border-b border-[#262628] bg-[#18181a]">
                <th className="py-3 px-4 font-medium"><div className="h-3 w-16 bg-[#222226] rounded" /></th>
                <th className="py-3 px-2 text-center w-16"><div className="h-3 w-10 bg-[#222226] rounded mx-auto" /></th>
                <th className="py-3 px-2 text-center w-32"><div className="h-3 w-12 bg-[#222226] rounded mx-auto" /></th>
                <th className="py-3 px-2 text-center w-28"><div className="h-3 w-16 bg-[#222226] rounded mx-auto" /></th>
                <th className="py-3 px-2 text-center w-20"><div className="h-3 w-14 bg-[#222226] rounded mx-auto" /></th>
                <th className="py-3 px-2 text-center w-28"><div className="h-3 w-14 bg-[#222226] rounded mx-auto" /></th>
                <th className="py-3 px-4 text-right w-32"><div className="h-3 w-12 bg-[#222226] rounded ml-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262628]">
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="h-[60px]">
                  {/* Project: Thumbnail + Title */}
                  <td className="py-3 px-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-9 rounded-lg bg-[#111113] border border-[#262628] shrink-0" />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="h-3.5 w-3/4 bg-[#1f1f22] rounded" />
                        <div className="h-2.5 w-20 bg-[#18181a] rounded" />
                      </div>
                    </div>
                  </td>
                  {/* Format icon */}
                  <td className="py-3 px-2 text-center w-16 align-middle">
                    <div className="w-4 h-4 bg-[#1f1f22] rounded mx-auto" />
                  </td>
                  {/* Status badge */}
                  <td className="py-3 px-2 text-center w-32 align-middle">
                    <div className="w-[88px] h-7 bg-[#1f1f22] rounded-md mx-auto" />
                  </td>
                  {/* Year / Length */}
                  <td className="py-3 px-2 text-center w-28 align-middle">
                    <div className="h-3 w-16 bg-[#1f1f22] rounded mx-auto" />
                  </td>
                  {/* Home page pin button */}
                  <td className="py-3 px-2 text-center w-20 align-middle">
                    <div className="w-7 h-7 bg-[#1f1f22] rounded-md mx-auto" />
                  </td>
                  {/* Carousel slot button */}
                  <td className="py-3 px-2 text-center w-28 align-middle">
                    <div className="w-[74px] h-7 bg-[#1f1f22] rounded-md mx-auto" />
                  </td>
                  {/* Actions buttons */}
                  <td className="py-3 px-4 text-right w-32 align-middle">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-7 h-7 bg-[#1f1f22] rounded-lg" />
                      <div className="w-7 h-7 bg-[#1f1f22] rounded-lg" />
                      <div className="w-7 h-7 bg-[#1f1f22] rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
