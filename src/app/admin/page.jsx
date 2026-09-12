import Link from "next/link";
import { Plus, AlertTriangle } from "lucide-react";
import { requireAdminPageAuth } from "@/lib/auth/pageGuard";
import { getProjects } from "@/services/projects/getProjects";
import { getFeaturedProjects } from "@/services/projects/getFeaturedProjects";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import DashboardKpiGrid from "@/components/admin/dashboard/DashboardKpiGrid";
import DashboardQuickNav from "@/components/admin/dashboard/DashboardQuickNav";
import DashboardRecentProjects from "@/components/admin/dashboard/DashboardRecentProjects";

export const metadata = {
  title: "Dashboard | Admin Console",
};

export default async function AdminDashboardPage() {
  await requireAdminPageAuth();

  const [allProjects, featured] = await Promise.all([
    getProjects(),
    getFeaturedProjects(),
  ]);

  const isAdminConfigured = isFirebaseAdminConfigured();

  return (
    <div className="space-y-6 sm:space-y-8 w-full min-w-0">
      {/* Top Header */}
      <AdminHeader
        title="Portfolio CMS Dashboard"
        subtitle="Manage your video projects, featured homepage slots, and content singletons."
        actions={
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/admin/projects/new"
              className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 bg-[#e90c47] hover:bg-[#d00a3e] active:bg-[#ba0938] text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus size={16} />
              <span>Add Video Project</span>
            </Link>
          </div>
        }
      />

      {/* Firebase Status Warning if Unset */}
      {!isAdminConfigured && (
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <AlertTriangle size={18} className="shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-semibold block">
                Static Data Fallback Active
              </span>
              <span className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed">
                Firestore credentials are not fully configured in your environment.
              </span>
            </div>
          </div>
          <Link
            href="/admin/settings"
            className="min-h-[40px] px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-xs shrink-0 transition flex items-center justify-center"
          >
            Configure Firebase ➔
          </Link>
        </div>
      )}

      {/* KPI Metric Cards */}
      <DashboardKpiGrid
        allProjects={allProjects}
        featured={featured}
        isAdminConfigured={isAdminConfigured}
      />

      {/* Quick Navigation Cards */}
      <DashboardQuickNav />

      {/* Recent Projects Showcase */}
      <DashboardRecentProjects projects={allProjects} />
    </div>
  );
}
