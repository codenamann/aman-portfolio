"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProfilePanel from "./ProfilePanel";
import AboutContent from "./AboutContent";

gsap.registerPlugin(ScrollTrigger);

/**
 * About Section with native CSS sticky profile panel and content-driven architecture.
 *
 * Animations:
 * - Heading line-by-line masked fade-up
 * - Profile social links sliding & fading left from right
 */
export default function About({
  aboutData,
  profile,
}) {
  const paragraphs = aboutData?.paragraphs || [];
  const signature = aboutData?.signature || null;
  const workHistory = aboutData?.workHistory || [];
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // 1. Heading line-by-line masked fade-up
      tl.fromTo(
        ".about-heading-line",
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
      )
        // 2. Social pill container subtle pop-in
        .fromTo(
          ".about-social-pill",
          {
            opacity: 0,
            scale: 0.9,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
          "-=0.35",
        )
        // 3. Social links sliding and fading left from right one-by-one
        .fromTo(
          ".about-social-link",
          {
            x: 25,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.08,
            ease: "back.out(1.6)",
            clearProps: "transform,opacity",
          },
          "-=0.25",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full bg-background border-t border-border section-py section-px"
    >
      <div className="section-container">
        {/* ── Section Heading (Static in code) ─────────────────────────── */}
        <h2 className="font-display font-bold text-section-heading text-foreground tracking-tight leading-[1.05] mb-12 md:mb-16">
          <span className="overflow-hidden block">
            <span className="about-heading-line inline-block">
              Designing experiences
            </span>
          </span>
          <span className="overflow-hidden block">
            <span className="about-heading-line inline-block">
              <span className="text-accent">that make sense.</span>
            </span>
          </span>
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
