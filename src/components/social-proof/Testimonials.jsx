"use client";

import React from "react";
import InfiniteMarquee from "@/components/animations/InfiniteMarquee";
import TestimonialCard from "./TestimonialCard";
import SocialProofSummary from "./SocialProofSummary";
import ViewerReactions from "./ViewerReactions";
import { testimonialsData } from "@/data/testimonials";
import { socialProofData } from "@/data/socialProof";

/**
 * Social Proof & Testimonials Section
 *
 * Features:
 * - Editorial heading with accent typography
 * - Dynamic data-driven Social Proof Summary (Avatar stack + 5-star rating + calculated client bucket)
 * - Continuous leftward marquee for Client Testimonials
 * - Continuous rightward marquee for Viewer Reactions / Comments
 * - Uses the generic, frame-rate independent InfiniteMarquee component
 */
export default function Testimonials({
  items = testimonialsData,
  socialProof = socialProofData,
  showViewerReactions = true,
}) {
  return (
    <>
      <section
        id="testimonials"
        className="w-full bg-background px-8 border-t border-border pt-15"
      >
        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto xl:px-6 mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="font-display font-bold lg:w-[60%] xl:w-[70%] text-section-heading text-foreground tracking-tight leading-[1.05]">
              <span>Hear from what </span>
              <span className="text-accent"> my clients have to say. </span>
            </h2>

            <SocialProofSummary
              avatars={socialProof.avatars}
              rating={socialProof.rating}
              satisfiedClients={socialProof.satisfiedClients}
              className="pb-1"
            />
          </div>
        </div>
      </section>
      {/* ── Infinite Marquee Rails ──────────────────────────────────────── */}
      <div className="flex flex-col gap-5 sm:gap-6 pb-15">
        {/* Client Testimonials Rail (Leftward Marquee) */}
        <InfiniteMarquee direction="left" speed={45} gap="gap-5 sm:gap-6">
          {items.map((item) => (
            <TestimonialCard key={item.id} testimonial={item} />
          ))}
        </InfiniteMarquee>

        {/* Viewer Reactions Rail (Rightward Marquee) */}
        {showViewerReactions && (
          <ViewerReactions direction="right" speed={38} />
        )}
      </div>
    </>
  );
}
