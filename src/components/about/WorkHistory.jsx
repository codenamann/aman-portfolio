"use client";

import { useState } from "react";
import ExperienceCard from "./ExperienceCard";

/**
 * Reusable Work History Component with Closed Stack and Expanded List states
 */
export default function WorkHistory({ items = [], className = "" }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!items || items.length === 0) return null;

  const hasMultiple = items.length > 1;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* ── Heading ──────────────────────────────────────────────────────── */}
      <h4 className="font-sans font-bold text-xl sm:text-2xl text-foreground">
        My work history
      </h4>

      {/* ── Closed / Stacked State ───────────────────────────────────────── */}
      {!isExpanded ? (
        <div className="relative pb-1">
          {/* Layer 2 (Bottom-most subtle layer) */}
          {hasMultiple && (
            <div
              className="absolute -bottom-2 inset-x-5 h-full bg-[#101012] border border-[#27272a]/60 rounded-[18px] -z-20 pointer-events-none"
              aria-hidden="true"
            />
          )}

          {/* Layer 1 (Middle subtle layer) */}
          {hasMultiple && (
            <div
              className="absolute -bottom-1 inset-x-2.5 h-full bg-[#141416] border border-[#27272a]/80 rounded-[19px] -z-10 pointer-events-none"
              aria-hidden="true"
            />
          )}

          {/* Front Visible Card */}
          <ExperienceCard experience={items[0]} />
        </div>
      ) : (
        /* ── Open / Expanded State ────────────────────────────────────────── */
        <div className="flex flex-col gap-3.5 transition-all duration-300">
          {items.map((item) => (
            <ExperienceCard
              key={item.id || item.company}
              experience={item}
            />
          ))}
        </div>
      )}

      {/* ── Show all / Hide Toggle Button (Centered) ─────────────────────── */}
      {hasMultiple && (
        <div className="flex justify-center mt-3">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="inline-flex items-center gap-2 text-[12px] font-medium px-4 py-1.5 rounded-full bg-[#18181b] border border-[#27272a] text-foreground/80 hover:text-foreground hover:border-[#3f3f46] transition-colors cursor-pointer select-none"
          >
            <span>{isExpanded ? "Hide" : "Show all"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          </button>
        </div>
      )}
    </div>
  );
}
