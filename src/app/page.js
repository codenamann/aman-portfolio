import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Projects from "@/components/projects/Projects";
import TestimonialHighlight from "@/components/social-proof/TestimonialHighlight";
import Services from "@/components/services/Services";
import About from "@/components/about/About";
import Testimonials from "@/components/social-proof/Testimonials";
import FAQCTA from "@/components/faq/FAQCTA";
import Footer from "@/components/contact/Footer";
import CursorBall from "@/components/layout/CursorBall";

export default function Home() {
  return (
    <>
      <CursorBall />
      <Navbar />
      <Hero />
      <main>
        <Projects />
        <TestimonialHighlight />
        <Services />
        <About />
        <Testimonials />
        <FAQCTA />
      </main>
      <Footer />
      {/* bottom blur  */}
      <div className="fixed bottom-0 z-50 w-screen h-30 pointer-events-none">
        <div className="absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,transparent,black)]" />
        <div className="absolute inset-0 backdrop-blur-[3px] [mask-image:linear-gradient(to_bottom,transparent_40%,black)]" />
        <div className="absolute inset-0 backdrop-blur-[3px] [mask-image:linear-gradient(to_bottom,transparent_70%,black)]" />
      </div>
    </>
  );
}
