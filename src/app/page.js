import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Projects from "@/components/projects/Projects";
import TestimonialHighlight from "@/components/social-proof/TestimonialHighlight";
import CursorBall from "@/components/layout/CursorBall";
import RouteReady from "@/components/layout/RouteReady";
import { getFeaturedProjects } from "@/services/projects/getFeaturedProjects";
import { getAllContent } from "@/services/content/getContent";

const Services = dynamic(() => import("@/components/services/Services"), {
  loading: () => <div className="w-full min-h-[360px] bg-background" />,
});

const About = dynamic(() => import("@/components/about/About"), {
  loading: () => <div className="w-full min-h-[360px] bg-background" />,
});

const Testimonials = dynamic(
  () => import("@/components/social-proof/Testimonials"),
  {
    loading: () => <div className="w-full min-h-[300px] bg-background" />,
  }
);

const FAQCTA = dynamic(() => import("@/components/faq/FAQCTA"), {
  loading: () => <div className="w-full min-h-[300px] bg-background" />,
});

const Footer = dynamic(() => import("@/components/contact/Footer"), {
  loading: () => <div className="w-full min-h-[260px] bg-background" />,
});

export default async function Home() {
  let shortForm = [];
  let longForm = [];
  let projectsError = null;

  // 1. Fetch featured projects (Firestore-only)
  try {
    const featured = await getFeaturedProjects();
    shortForm = featured?.shortForm || [];
    longForm = featured?.longForm || [];
  } catch (err) {
    projectsError = "Unable to load featured projects from the database.";
  }

  // 2. Fetch all content sections (resolved via Firestore / controlled fallback policy)
  let allContent = {};
  try {
    allContent = await getAllContent();
  } catch (err) {
    console.warn("[Home Page] Could not load all content sections:", err.message);
  }

  const profile = allContent.profile || null;
  const about = allContent.about || null;
  const services = allContent.services || null;
  const creativeTools = allContent["creative-tools"] || null;
  const testimonials = allContent.testimonials || null;
  const viewerReactions = allContent["viewer-reactions"] || null;
  const testimonialsConfig = allContent["testimonials-config"] || null;
  const socialProof = allContent["social-proof"] || null;
  const faqs = allContent.faqs || null;
  const quote = allContent.quote || null;

  return (
    <>
      <RouteReady routePath="/" />
      <CursorBall />
      <Navbar brand={profile} />
      <Hero
        tagline={profile?.tagline}
        ctaHref={profile?.call?.href}
        socialProofData={socialProof}
      />
      <main>
        <Projects
          featuredShorts={shortForm}
          featuredLongForm={longForm}
          error={projectsError}
        />
        <TestimonialHighlight quote={quote} profile={profile} />
        <Services
          servicesData={services}
          creativeToolsData={creativeTools}
        />
        <About aboutData={about} profile={profile} />
        <Testimonials
          testimonialsData={testimonials}
          reactionsData={viewerReactions}
          configData={testimonialsConfig}
          socialProofData={socialProof}
        />
        <FAQCTA faqsData={faqs} profile={profile} />
      </main>
      <Footer profile={profile} />
      {/* bottom blur  */}
      <div className="fixed bottom-0 inset-x-0 z-50 w-full h-30 pointer-events-none">
        <div className="absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,transparent,black)]" />
        <div className="absolute inset-0 backdrop-blur-[3px] [mask-image:linear-gradient(to_bottom,transparent_40%,black)]" />
        <div className="absolute inset-0 backdrop-blur-[3px] [mask-image:linear-gradient(to_bottom,transparent_70%,black)]" />
      </div>
    </>
  );
}


