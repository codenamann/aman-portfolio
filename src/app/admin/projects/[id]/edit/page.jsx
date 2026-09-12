import { notFound } from "next/navigation";
import { getProjectById } from "@/services/projects/getProjectById";
import AdminHeader from "@/components/admin/AdminHeader";
import ProjectForm from "@/components/admin/ProjectForm";
import { requireAdminPageAuth } from "@/lib/auth/pageGuard";

export default async function EditProjectPage(props) {
  await requireAdminPageAuth();

  const params = await props.params;
  const { id } = params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Edit Project: ${project.title}`}
        subtitle={`Updating document ID: ${project.id}`}
        breadcrumbs={[
          { label: "Projects", href: "/admin/projects" },
          { label: project.title },
        ]}
      />

      <ProjectForm initialData={project} isEdit={true} />
    </div>
  );
}
