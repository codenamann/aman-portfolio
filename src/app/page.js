import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Projects from "@/components/projects/Projects";
import TestimonialHighlight from "@/components/social-proof/TestimonialHighlight";
import Services from "@/components/services/Services";
import About from "@/components/about/About";
import Testimonials from "@/components/social-proof/Testimonials";
import FAQCTA from "@/components/faq/FAQCTA";
import Footer from "@/components/contact/Footer";

export default function Home() {
  return (
    <>
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
    </>
  );
}
