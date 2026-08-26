"use client";
import React, { useRef } from "react";
import {
  services as defaultServices,
  tools as defaultTools,
} from "@/data/services";
import ServiceCard from "./ServiceCard";
import ToolList from "./ToolList";

/**
 * Static Foundation for Services Section.
 * Structured cleanly for future scroll-linked card animations.
 */
export default function Services({
  items = defaultServices,
  toolItems = defaultTools,
}) {
  return (
    <section
      id="services"
      className="w-full bg-background border-t border-border py-12 md:py-18 lg:py-15 xl:py-15 px-8 sm:px-6 md:px-8 lg:px-8"
    >
      <div className="relative max-w-5xl mx-auto xl:px-6 flex flex-col lg:flex-row items-start justify-between gap-3 lg:gap-3">
        {/* ── Left Content Column: Heading & Tools ────────────────────────── */}
        <div className="flex-1 flex sticky top-30 md:top-45 lg:top-60 flex-col gap-10 lg:gap-14">
          <h2 className="font-display font-bold text-section-heading text-foreground tracking-tight leading-[1.05]">
            What I help
            <br />
            you to <span className="text-accent">Shape...</span>
          </h2>

          <ToolList items={toolItems} />
        </div>

        {/* ── Right Content Column: Services Sequence ─────────────────────── */}
        <div className="w-full lg:w-[45%] flex md:grid md:grid-cols-2 lg:flex flex-col gap-8">
          {items.map((service) => (
            <ServiceCard key={service.id || service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
