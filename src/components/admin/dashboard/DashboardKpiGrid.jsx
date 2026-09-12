import Link from "next/link";
import { Film, Sparkles, CheckCircle2, ArrowUpRight } from "lucide-react";
import {
  MAX_FEATURED_SHORT_FORM,
  MAX_FEATURED_LONG_FORM,
  PROJECT_FORMATS,
} from "@/lib/constants/limits";

/**
 * Dashboard KPI Metric Summary Grid
 */
export default function DashboardKpiGrid({
  allProjects = [],
  featured = { shortForm: [], longForm: [] },
  isAdminConfigured = true,
}) {
  const shortCount = allProjects.filter(
    (p) => p.format === PROJECT_FORMATS.SHORT_FORM
  ).length;
  const longCount = allProjects.filter(
    (p) => p.format === PROJECT_FORMATS.LONG_FORM
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Projects */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[120px]">
        <div className="flex items-center justify-between text-[#a1a1a6]">
          <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider font-mono">
            Total Projects
          </span>
          <Film size={18} className="text-[#6f6f76]" />
        </div>
        <div className="mt-3 sm:mt-4">
          <span className="text-2xl sm:text-3xl font-bold text-[#f2f2f2] tracking-tight">
            {allProjects.length}
          </span>
          <span className="text-[11px] sm:text-xs text-[#6f6f76] block mt-0.5">
            {shortCount} Shorts &bull; {longCount} Long-form
          </span>
        </div>
      </div>

      {/* Short-Form Featured Slots */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[120px]">
        <div className="flex items-center justify-between text-[#a1a1a6]">
          <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider font-mono">
            Shorts Slots
          </span>
          <Sparkles size={18} className="text-[#e90c47]" />
        </div>
        <div className="mt-3 sm:mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#f2f2f2] tracking-tight">
              {featured.shortForm.length}
            </span>
            <span className="text-[11px] sm:text-xs text-[#6f6f76]">
              / {MAX_FEATURED_SHORT_FORM} active
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#1f1f22] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-[#e90c47] rounded-full transition-all"
              style={{
                width: `${
                  (featured.shortForm.length / MAX_FEATURED_SHORT_FORM) * 100
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Long-Form Featured Slots */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[120px]">
        <div className="flex items-center justify-between text-[#a1a1a6]">
          <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider font-mono">
            Long-Form Slots
          </span>
          <Sparkles size={18} className="text-[#e90c47]" />
        </div>
        <div className="mt-3 sm:mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#f2f2f2] tracking-tight">
              {featured.longForm.length}
            </span>
            <span className="text-[11px] sm:text-xs text-[#6f6f76]">
              / {MAX_FEATURED_LONG_FORM} active
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#1f1f22] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{
                width: `${
                  (featured.longForm.length / MAX_FEATURED_LONG_FORM) * 100
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Backend Status */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[120px]">
        <div className="flex items-center justify-between text-[#a1a1a6]">
          <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider font-mono">
            Backend Status
          </span>
          <CheckCircle2
            size={18}
            className={isAdminConfigured ? "text-emerald-400" : "text-amber-400"}
          />
        </div>
        <div className="mt-3 sm:mt-4">
          <span className="text-base sm:text-lg font-bold text-[#f2f2f2] tracking-tight block truncate">
            {isAdminConfigured ? "Firestore Live" : "Unconfigured"}
          </span>
          <Link
            href="/admin/settings"
            className="text-xs text-[#e90c47] hover:underline inline-flex items-center gap-1 mt-0.5"
          >
            <span>Settings</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
