"use client";

import React from "react";
import InfiniteMarquee from "@/components/animations/InfiniteMarquee";
import TestimonialCard from "./TestimonialCard";
import SocialProofSummary from "./SocialProofSummary";
import ViewerReactions from "./ViewerReactions";

/**
 * Social Proof & Testimonials Section
 */
export default function Testimonials({
  testimonialsData,
  reactionsData,
  configData,
  socialProofData,
}) {
  const activeTestimonials = testimonialsData?.testimonials || [];
  const activeReactions = reactionsData?.reactions || [];
  const activeSocialProof = socialProofData || null;

  // Display toggles from config or default to true
  const showTestimonialsRail =
    configData?.showTestimonials !== false && activeTestimonials.length > 0;
  const showReactionsRail =
    configData?.showViewerReactions !== false && activeReactions.length > 0;

  return (
    <>
      <section
        id="testimonials"
        className="w-full bg-background border-t border-border pt-[var(--section-py)] section-px"
      >
        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div className="section-container mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="font-display font-bold lg:w-[60%] xl:w-[70%] text-section-heading text-foreground tracking-tight leading-[1.05]">
              <span>Hear from what </span>
              <span className="text-accent"> my clients have to say. </span>
            </h2>

            {activeSocialProof && (
              <SocialProofSummary
                avatars={activeSocialProof.avatars || []}
                rating={activeSocialProof.rating}
                satisfiedClients={activeSocialProof.satisfiedClients}
                className="pb-1"
              />
            )}
          </div>
        </div>
      </section>

      {/* ── Infinite Marquee Rails ──────────────────────────────────────── */}
      {(showTestimonialsRail || showReactionsRail) && (
        <div className="flex flex-col gap-5 sm:gap-6 pb-[var(--section-py)]">
          {/* Client Testimonials Rail (Leftward Marquee) */}
          {showTestimonialsRail && (
            <InfiniteMarquee direction="left" speed={45} gap="gap-5 sm:gap-6">
              {activeTestimonials.map((item) => (
                <TestimonialCard key={item.id || item.author} testimonial={item} />
              ))}
            </InfiniteMarquee>
          )}

          {/* Viewer Reactions Rail (Rightward Marquee) */}
          {showReactionsRail && (
            <ViewerReactions reactions={activeReactions} direction="right" speed={38} />
          )}
        </div>
      )}
    </>
  );
}
