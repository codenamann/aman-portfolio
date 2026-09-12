"use client";
import React from "react";
import ServiceCard from "./ServiceCard";
import ToolList from "./ToolList";
import { tools as catalogTools } from "@/data/services";

/**
 * Maps enabled tool IDs (string[]) or tool objects to catalog tool definitions
 */
function resolveTools(creativeToolsData) {
  if (!creativeToolsData) return [];
  if (Array.isArray(creativeToolsData)) return creativeToolsData;
  if (Array.isArray(creativeToolsData.enabledTools)) {
    const enabledSet = new Set(
      creativeToolsData.enabledTools.map((id) =>
        id.toLowerCase().replace(/[-_\s]/g, "")
      )
    );
    return catalogTools.filter(
      (t) =>
        enabledSet.has(t.id.toLowerCase().replace(/[-_\s]/g, "")) ||
        enabledSet.has((t.icon || "").toLowerCase().replace(/[-_\s]/g, ""))
    );
  }
  return [];
}

/**
 * Static Foundation for Services Section.
 * Structured cleanly for future scroll-linked card animations.
 */
export default function Services({
  servicesData,
  creativeToolsData,
}) {
  const activeServices = servicesData?.services || [];
  const activeTools = resolveTools(creativeToolsData);

  return (
    <section
      id="services"
      className="w-full bg-background border-t border-border section-py section-px"
    >
      <div className="relative section-container flex flex-col lg:flex-row items-start justify-between gap-3 lg:gap-3">
        {/* ── Left Content Column: Heading & Tools ────────────────────────── */}
        <div className="flex-1 flex sticky top-25 sm:top-30 md:top-45 lg:top-60 flex-col gap-10 lg:gap-14">
          <h2 className="font-display font-bold text-section-heading text-foreground tracking-tight leading-[1.05]">
            What I help
            <br />
            you to <span className="text-accent">Shape...</span>
          </h2>

          {activeTools.length > 0 && <ToolList items={activeTools} />}
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
