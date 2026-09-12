import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Film, Edit } from "lucide-react";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";

/**
 * Dashboard Recent Projects Table/List Component
 */
export default function DashboardRecentProjects({ projects = [] }) {
  const recentProjects = projects.slice(0, 5);

  return (
    <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-[#f2f2f2]">
            Recent Video Projects
          </h3>
          <p className="text-xs text-[#a1a1a6]">
            Quick access to your most recently updated portfolio items
          </p>
        </div>
        <Link
          href="/admin/projects"
          className="text-xs text-[#e90c47] hover:underline inline-flex items-center gap-1 font-semibold self-start sm:self-auto py-1"
        >
          <span>View All ({projects.length})</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {recentProjects.length === 0 ? (
        <div className="py-8 text-center text-[#6f6f76] text-xs">
          No projects found in database.
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead>
              <tr className="border-b border-[#262628] text-[#a1a1a6] uppercase font-mono text-[10px]">
                <th className="py-2.5 px-4 sm:px-0 font-medium">Project</th>
                <th className="py-2.5 px-3 font-medium">Format</th>
                <th className="py-2.5 px-3 font-medium">Status</th>
                <th className="py-2.5 px-3 font-medium">Year / Length</th>
                <th className="py-2.5 px-4 sm:px-0 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262628]">
              {recentProjects.map((p) => (
                <tr key={p.id} className="hover:bg-[#18181a] transition-colors">
                  <td className="py-3 px-4 sm:px-0 font-medium text-[#f2f2f2] max-w-[200px] truncate">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-6 rounded bg-[#111113] overflow-hidden shrink-0 relative border border-[#262628]">
                        {p.thumbnail ? (
                          <Image
                            src={p.thumbnail}
                            alt=""
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#6f6f76]">
                            <Film size={12} />
                          </div>
                        )}
                      </div>
                      <span className="truncate">{p.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <AdminStatusBadge type={p.format}>
                      {p.format}
                    </AdminStatusBadge>
                  </td>
                  <td className="py-3 px-3">
                    <AdminStatusBadge type={p.status || "published"}>
                      {p.status || "published"}
                    </AdminStatusBadge>
                  </td>
                  <td className="py-3 px-3 text-[#a1a1a6] font-mono text-[11px] truncate">
                    {p.year || "—"} {p.duration ? `• ${p.duration}` : ""}
                  </td>
                  <td className="py-3 px-4 sm:px-0 text-right">
                    <Link
                      href={`/admin/projects/${encodeURIComponent(p.id)}/edit`}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#a1a1a6] hover:text-white hover:underline"
                    >
                      <Edit size={12} />
                      <span>Edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
