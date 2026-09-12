import ProfilePanel from "./ProfilePanel";
import AboutContent from "./AboutContent";

/**
 * About Section with native CSS sticky profile panel and content-driven architecture.
 *
 * Rule:
 * - Section heading is 100% static in code.
 * - Content is passed strictly from server resolution (getContent).
 */
export default function About({
  aboutData,
  profile,
}) {
  const paragraphs = aboutData?.paragraphs || [];
  const signature = aboutData?.signature || null;
  const workHistory = aboutData?.workHistory || [];

  return (
    <section
      id="about"
      className="w-full bg-background border-t border-border section-py section-px"
    >
      <div className="section-container">
        {/* ── Section Heading (Static in code) ─────────────────────────── */}
        <h2 className="font-display font-bold text-section-heading text-foreground tracking-tight leading-[1.05] mb-12 md:mb-16">
          Designing experiences
          <br />
          <span className="text-accent">that make sense.</span>
        </h2>

        {/* ── Two-Column Main Layout: Sticky Profile + Scrolling Content ── */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 lg:gap-10">
          <ProfilePanel profile={profile} />
          <AboutContent
            paragraphs={paragraphs}
            signature={signature}
            workHistory={workHistory}
          />
        </div>
      </div>
    </section>
  );
}
