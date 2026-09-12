import AdminHeader from "@/components/admin/AdminHeader";
import ProjectCreationFlow from "@/components/admin/ProjectCreationFlow";
import { requireAdminPageAuth } from "@/lib/auth/pageGuard";

export default async function NewProjectPage() {
  await requireAdminPageAuth();
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Add New Video Project"
        subtitle="Create a new project manually or ingest metadata directly from YouTube."
        breadcrumbs={[
          { label: "Projects", href: "/admin/projects" },
          { label: "New Project" },
        ]}
      />

      <ProjectCreationFlow />
    </div>
  );
}
