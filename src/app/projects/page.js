import Navbar from "@/components/layout/Navbar";
import ProjectsArchive from "@/components/projects/ProjectsArchive";
import Footer from "@/components/contact/Footer";
import { getProjects } from "@/services/projects/getProjects";
import { getFeaturedShowcase } from "@/services/projects/getFeaturedShowcase";
import { getContent } from "@/services/content/getContent";

export const metadata = {
  title: "Projects & Work Archive | Aman Shrivastava",
  description:
    "Explore long-form video editing, motion design, YouTube shorts, and creative packaging identity projects by Aman Shrivastava.",
};

export default async function ProjectsPage() {
  let publishedProjects = [];
  let featuredShowcase = null;
  let profile = null;
  let projectsError = null;

  try {
    const [projectsData, showcaseData, profileData] = await Promise.all([
      getProjects({ status: "published" }),
      getFeaturedShowcase(),
      getContent("profile"),
    ]);
    publishedProjects = projectsData;
    featuredShowcase = showcaseData;
    profile = profileData;
  } catch (err) {
    projectsError = "Unable to load projects from the database at this time.";
  }

  return (
    <>
      <Navbar brand={profile} />
      <main>
        <ProjectsArchive
          initialProjects={publishedProjects}
          featuredShowcase={featuredShowcase}
          error={projectsError}
        />
      </main>
      <Footer profile={profile} />
    </>
  );
}