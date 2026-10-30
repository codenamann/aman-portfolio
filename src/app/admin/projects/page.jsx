import { requireAdminPageAuth } from "@/lib/auth/pageGuard";
import { getProjects } from "@/services/projects/getProjects";
import { getFeaturedShowcase } from "@/services/projects/getFeaturedShowcase";
import ProjectsManager from "@/components/admin/projects/ProjectsManager";

export const metadata = {
  title: "Projects & Curation | Admin Console",
};

export default async function AdminProjectsListPage() {
  await requireAdminPageAuth();

  let initialProjects = null;
  let initialShowcase = null;

  try {
    const [projects, showcase] = await Promise.all([
      getProjects(),
      getFeaturedShowcase().catch(() => null),
    ]);
    initialProjects = projects;
    initialShowcase = showcase;
  } catch (err) {
    // If fetching fails on server, client manager will display error/loading state
  }

  return (
    <ProjectsManager
      initialProjects={initialProjects}
      initialShowcase={initialShowcase}
    />
  );
}
