"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceCard from "./ServiceCard";
import ToolList from "./ToolList";
import { tools as catalogTools } from "@/data/services";

gsap.registerPlugin(ScrollTrigger);

/**
 * Maps enabled tool IDs (string[]) or tool objects to catalog tool definitions
 */
function resolveTools(creativeToolsData) {
  if (!creativeToolsData) return catalogTools;
  if (Array.isArray(creativeToolsData) && creativeToolsData.length > 0) return creativeToolsData;
  if (Array.isArray(creativeToolsData.enabledTools) && creativeToolsData.enabledTools.length > 0) {
    const enabledSet = new Set(
      creativeToolsData.enabledTools.map((id) =>
        id.toLowerCase().replace(/[-_\s]/g, ""),
      ),
    );
    const matched = catalogTools.filter(
      (t) =>
        enabledSet.has(t.id.toLowerCase().replace(/[-_\s]/g, "")) ||
        enabledSet.has((t.icon || "").toLowerCase().replace(/[-_\s]/g, "")),
    );
    return matched.length > 0 ? matched : catalogTools;
  }
  return catalogTools;
}

/**
 * Services Section with GSAP scroll-triggered heading and tools reveal
 */
export default function Services({ servicesData, creativeToolsData }) {
  const activeServices = servicesData?.services || [];
  const activeTools = resolveTools(creativeToolsData);
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
        ".services-heading-line",
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
        // 2. Tools label fade
        .fromTo(
          ".services-tools-label",
          {
            opacity: 0,
            x: -20,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3",
        )
        // 3. Tools sliding & fading right from left one by one
        .fromTo(
          ".tool-item-anim",
          {
            x: -25,
            opacity: 0,
            scale: 0.85,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.45,
            stagger: 0.06,
            ease: "back.out(1.8)",
            clearProps: "transform,opacity",
          },
          "-=0.2",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="w-full bg-background border-t border-border section-py section-px"
    >
      <div className="relative section-container flex flex-col lg:flex-row items-start justify-between gap-3 lg:gap-3 pb-12">
        {/* ── Left Content Column: Heading & Tools ────────────────────────── */}
        <div className="flex-1 flex sticky top-25 sm:top-30 md:top-45 lg:top-60 flex-col gap-10 lg:gap-14">
          <h2 className="font-display font-bold text-section-heading text-foreground tracking-tight leading-[1.05]">
            <span className="overflow-hidden block">
              <span className="services-heading-line inline-block">
                What I help
              </span>
            </span>
            <span className="overflow-hidden block">
              <span className="services-heading-line inline-block">
                you to <span className="text-accent">Shape...</span>
              </span>
            </span>
          </h2>

          {activeTools.length > 0 && (
            <div className="services-tools-container flex flex-col gap-3">
              <ToolList items={activeTools} />
            </div>
          )}
        </div>

        {/* ── Right Content Column: Services Sequence ─────────────────────── */}
        <div className="w-full lg:w-[45%] flex md:grid md:grid-cols-2 lg:flex flex-col gap-8">
          {activeServices.map((service) => (
            <ServiceCard key={service.id || service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
