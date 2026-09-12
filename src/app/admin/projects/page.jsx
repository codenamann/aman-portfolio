import { requireAdminPageAuth } from "@/lib/auth/pageGuard";
import { getProjects } from "@/services/projects/getProjects";
import ProjectsManager from "@/components/admin/projects/ProjectsManager";

export const metadata = {
  title: "Projects | Admin Console",
};

export default async function AdminProjectsListPage() {
  await requireAdminPageAuth();

  let initialProjects = null;
  try {
    initialProjects = await getProjects();
  } catch (err) {
    // If fetching fails on server, client manager will display error/loading state
  }

  return <ProjectsManager initialProjects={initialProjects} />;
}
