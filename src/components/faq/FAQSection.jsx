"use client";

import React from "react";
import FAQAccordion from "./FAQAccordion";
import DiscoveryCTA from "./DiscoveryCTA";

/**
 * FAQSection Component
 */
export default function FAQSection({
  faqsData,
  profile,
  className = "",
}) {
  const activeFaqs = faqsData?.faqs || [];
  const activeCTA = faqsData?.cta || null;

  return (
    <section
      id="faqs"
      className={`w-full bg-background border-t border-border section-py section-px ${className}`}
    >
      <div className="section-container">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
          {/* ── Left Column: Heading + Accordion ───────────────────────────── */}
          <div className="w-full lg:w-[58%] flex flex-col">
            <h2 className="font-display font-bold text-section-heading text-foreground tracking-tight leading-none mb-10 md:mb-12">
              FAQs
            </h2>

            <FAQAccordion items={activeFaqs} />
          </div>

          {/* ── Right Column: Sticky Discovery CTA Card ─────────────────────── */}
          {activeCTA && <DiscoveryCTA cta={activeCTA} profile={profile} />}
        </div>
      </div>
    </section>
  );
}
