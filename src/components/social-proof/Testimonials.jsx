"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InfiniteMarquee from "@/components/animations/InfiniteMarquee";
import TestimonialCard from "./TestimonialCard";
import SocialProofSummary from "./SocialProofSummary";
import ViewerReactions from "./ViewerReactions";

gsap.registerPlugin(ScrollTrigger);

/**
 * Social Proof & Testimonials Section
 *
 * Animations:
 * - Section heading line-by-line masked fade-up
 * - Marquee cards pop in one-by-one radiating from center to both directions
 * - Once entrance completes, infinite rolling animation starts smoothly
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

  const [isRolling, setIsRolling] = useState(false);
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // 1. Section heading line-by-line masked fade-up
      tl.fromTo(
        ".testimonials-heading-line",
        {
          yPercent: 120,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.14,
          ease: "power3.out",
        },
      );

      // 2. Both marquee tracks appear one-by-one starting from center to both directions
      const marqueeBlocks =
        containerRef.current?.querySelectorAll(".marquee-block") || [];

      if (marqueeBlocks.length > 0) {
        marqueeBlocks.forEach((block, index) => {
          const testCards = block.querySelectorAll(".testimonial-card-item");
          const reactCards = block.querySelectorAll(".reaction-card-item");

          if (testCards.length > 0) {
            tl.fromTo(
              testCards,
              {
                opacity: 0,
                scale: 0.82,
                y: 20,
              },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.55,
                stagger: {
                  from: "center",
                  amount: 0.5,
                },
                ease: "back.out(1.4)",
                clearProps: "transform,opacity",
              },
              index === 0 ? "-=0.3" : "<",
            );
          }

          if (reactCards.length > 0) {
            tl.fromTo(
              reactCards,
              {
                opacity: 0,
                scale: 0.82,
                y: 20,
              },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.55,
                stagger: {
                  from: "center",
                  amount: 0.5,
                },
                ease: "back.out(1.4)",
                clearProps: "transform,opacity",
              },
              index === 0 ? "<+=0.1" : "<",
            );
          }
        });
      }

      // 3. Once cards have appeared, trigger the infinite marquee rolling
      tl.call(() => {
        setIsRolling(true);
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="w-full">
      <section
        id="testimonials"
        className="w-full bg-background border-t border-border pt-[var(--section-py)] section-px"
      >
        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div className="section-container mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="font-display font-bold lg:w-[60%] xl:w-[70%] text-section-heading text-foreground tracking-tight leading-[1.05]">
              <span className="overflow-hidden block">
                <span className="testimonials-heading-line inline-block">
                  Hear from what
                </span>
              </span>
              <span className="overflow-hidden block">
                <span className="testimonials-heading-line inline-block">
                  <span className="text-accent">my clients have to say.</span>
                </span>
              </span>
            </h2>

            <SocialProofSummary
              avatars={activeSocialProof?.avatars}
              rating={activeSocialProof?.rating || 5}
              satisfiedClients={activeSocialProof?.satisfiedClients || "20+"}
              className="pb-1"
            />
          </div>
        </div>
      </section>

      {/* ── Infinite Marquee Rails ──────────────────────────────────────── */}
      {(showTestimonialsRail || showReactionsRail) && (
        <div className="flex flex-col gap-5 sm:gap-6 pb-[var(--section-py)]">
          {/* Client Testimonials Rail (Leftward Marquee) */}
          {showTestimonialsRail && (
            <InfiniteMarquee
              direction="left"
              speed={45}
              gap="gap-5 sm:gap-6"
              isPlaying={isRolling}
            >
              {activeTestimonials.map((item) => (
                <div
                  key={item.id || item.author}
                  className="testimonial-card-item shrink-0"
                >
                  <TestimonialCard testimonial={item} />
                </div>
              ))}
            </InfiniteMarquee>
          )}

          {/* Viewer Reactions Rail (Rightward Marquee) */}
          {showReactionsRail && (
            <ViewerReactions
              reactions={activeReactions}
              direction="right"
              speed={38}
              isPlaying={isRolling}
            />
          )}
        </div>
      )}
    </div>
  );
}
