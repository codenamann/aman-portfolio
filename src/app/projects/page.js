import Navbar from "@/components/layout/Navbar";
import ProjectsArchive from "@/components/projects/ProjectsArchive";
import Footer from "@/components/contact/Footer";

export const metadata = {
  title: "Projects & Work Archive | Aman Shrivastava",
  description:
    "Explore long-form video editing, motion design, YouTube shorts, and creative packaging identity projects by Aman Shrivastava.",
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main>
        <ProjectsArchive />
      </main>
      <Footer />
    </>
  );
}
