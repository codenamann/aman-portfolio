"use client";

import { aboutData } from "@/data/about";
import ProfilePanel from "./ProfilePanel";
import AboutContent from "./AboutContent";

/**
 * About Section with native CSS sticky profile panel and content-driven architecture
 */
export default function About({ content = aboutData }) {
  return (
    <section
      id="about"
      className="w-full bg-background border-t border-border py-12 px-8 md:px-8 lg:px-8"
    >
      <div className="max-w-5xl xl:px-6 mx-auto">
        {/* ── Section Heading ───────────────────────────────────────────── */}
        <h2 className="font-display font-bold text-section-heading text-foreground tracking-tight leading-[1.05] mb-12 md:mb-16">
          {content.heading.lineOne}
          <br />
          <span className="text-accent">{content.heading.lineTwo}</span>
        </h2>

        {/* ── Two-Column Main Layout: Sticky Profile + Scrolling Content ── */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 lg:gap-10">
          <ProfilePanel profile={content.profile} />
          <AboutContent
            paragraphs={content.paragraphs}
            signature={content.signature}
            workHistory={content.workHistory}
          />
        </div>
      </div>
    </section>
  );
}
