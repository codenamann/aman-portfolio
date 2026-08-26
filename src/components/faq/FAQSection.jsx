"use client";

import React from "react";
import FAQAccordion from "./FAQAccordion";
import DiscoveryCTA from "./DiscoveryCTA";
import { faqsData, discoveryCTAData } from "@/data/faqs";

/**
 * FAQSection Component
 *
 * Combines the left-hand scrollable FAQ accordion and right-hand CSS sticky Discovery CTA card.
 */
export default function FAQSection({
  faqs = faqsData,
  cta = discoveryCTAData,
  className = "",
}) {
  return (
    <section
      id="faqs"
      className={`w-full bg-background border-t border-border py-12 px-8 md:px-8 lg:px-8 ${className}`}
    >
      <div className="max-w-5xl mx-auto xl:px-6">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
          {/* ── Left Column: Heading + Accordion ───────────────────────────── */}
          <div className="w-full lg:w-[58%] flex flex-col">
            <h2 className="font-display font-bold text-section-heading text-foreground tracking-tight leading-none mb-10 md:mb-12">
              FAQs
            </h2>

            <FAQAccordion items={faqs} />
          </div>

          {/* ── Right Column: Sticky Discovery CTA Card ─────────────────────── */}
          <DiscoveryCTA cta={cta} />
        </div>
      </div>
    </section>
  );
}
