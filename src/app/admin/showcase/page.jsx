import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { requireAdminPageAuth } from "@/lib/auth/pageGuard";
import { getProjects } from "@/services/projects/getProjects";
import { getFeaturedShowcase } from "@/services/projects/getFeaturedShowcase";
import AdminHeader from "@/components/admin/AdminHeader";
import ArchiveShowcaseManager from "@/components/admin/ArchiveShowcaseManager";

export const metadata = {
  title: "Featured Showcase (Projects Archive) | Admin",
};

export default async function AdminArchiveShowcasePage() {
  await requireAdminPageAuth();

  const [allProjects, showcase] = await Promise.all([
    getProjects(),
    getFeaturedShowcase(),
  ]);

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Featured Showcase"
        subtitle="Control the five projects displayed at the top of your public Projects Archive. Automatic slots use the newest published project matching the required format. Choosing a project manually overrides that slot."
        breadcrumbs={[{ label: "Archive Showcase" }]}
        actions={
          <Link
            href="/projects"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 bg-white/[0.02] px-3 py-1.5 rounded transition-colors"
          >
            <span>View Live Archive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        }
      />

      <ArchiveShowcaseManager
        initialShowcase={showcase}
        allProjects={allProjects}
      />
    </div>
  );
}
