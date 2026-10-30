"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "@/components/ui/Link";
import SocialProof from "@/components/social-proof/SocialProof";
import HeroFace from "./HeroFace";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({
  tagline,
  ctaText = "Book a call with me",
  ctaHref = "#contact",
  socialProofData,
}) {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const bottomBarRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      // ── Step 1: HeroFace pure fade in (no scaling/expansion)
      tl.to("#hero-face-wrapper", {
        opacity: 1,
        duration: 0.9,
        ease: "power2.out",
      })
        // ── Step 2: Subheading and CTA fade in smoothly
        .to(
          ".hero-tagline",
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "+=0.1"
        )
        .to(
          ".hero-cta",
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.35"
        )
        // ── Step 3: Main heading fades in cleanly behind the HeroFace
        .to(
          headlineRef.current,
          {
            opacity: 1,
            duration: 1.0,
            ease: "power2.out",
          },
          "-=0.15"
        )
        // ── Step 4: Social proof bar fades in
        .to(
          ".hero-social-proof",
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.4"
        );

      // ── Scroll Parallax on Headline and HeroFace (pure translation, no opacity fade)
      gsap.to(headlineRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        yPercent: 20,
        ease: "none",
      });

      gsap.to("#hero-face-wrapper", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: 40,
        ease: "none",
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="w-full pt-30 sm:pt-28 md:pt-28 bg-background flex flex-col justify-between items-center relative overflow-hidden"
    >
      <div className="max-w-252 pb-12 md:pb-18 lg:pb-22 px-6 sm:px-8 md:px-9 lg:px-10 xl:px-4 flex flex-col gap-80 md:gap-6 lg:gap-10 w-full flex-1 justify-center relative">
        {/* ── Headline rendered behind HeroFace (z-0, initially opacity-0 to prevent FOUC) ── */}
        <h1
          ref={headlineRef}
          className="flex flex-col justify-center items-center select-none relative z-0 opacity-0"
        >
          <span className="font-display font-semibold text-[6.4rem] sm:text-[13rem] md:text-[10rem] lg:text-[14.5rem] uppercase tracking-tight text-foreground md:leading-[0.78] leading-[0.85]">
            THINK
          </span>

          <span className="font-display font-[630] text-[3.9rem] sm:text-[8rem] md:text-[8.3rem] lg:text-[11.9rem] tracking-[-0.02em] uppercase text-accent md:leading-[0.78] leading-[0.8]">
            CREATIVELY
          </span>
        </h1>

        {/* ── Bottom bar (z-30 so CTA is clickable above everything) ── */}
        <div
          ref={bottomBarRef}
          className="max-w-5xl mx-auto w-full px-1 sm:px-0 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-30"
        >
          {/* Tagline (initially opacity-0) */}
          <div className="w-full md:w-64 hero-tagline opacity-0 translate-y-3">
            {tagline && (
              <p className="text-center md:text-left md:text-balance font-sans font-normal text-[1.1rem] md:text-[1.25rem] leading-[1.3] text-foreground/80">
                {tagline}
              </p>
            )}
          </div>

          {/* CTA (initially opacity-0) */}
          <div className="hero-cta opacity-0 translate-y-3">
            <Link
              href={ctaHref || "#contact"}
              variant="pill"
              color="red"
              className="md:py-2.5"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>

      {/* ── HeroFace rendered in foreground above headline (z-20) ─────── */}
      <HeroFace />

      {/* ── Client Proof & Brand Logos at bottom of Hero ─────────────── */}
      {socialProofData && (
        <div className="w-full hero-social-proof relative z-30 opacity-0 translate-y-4">
          <SocialProof data={socialProofData} />
        </div>
      )}
    </section>
  );
}
