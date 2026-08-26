"use client";

import { useState } from "react";
import { tools } from "@/data/services";
import { getToolLogo } from "@/lib/logos";

function ToolIcon({ tool, isHovered }) {
  const logoSrc = getToolLogo(tool.icon || tool.id);

  if (logoSrc) {
    return (
      <span
        className={`inline-block w-7 h-7 transition-colors duration-200 ${
          isHovered ? "bg-accent" : "bg-foreground/75"
        }`}
        style={{
          maskImage: `url(${logoSrc})`,
          WebkitMaskImage: `url(${logoSrc})`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
        aria-label={tool.name}
      />
    );
  }

  // Fallback if logo is missing
  return (
    <span
      className={`font-bold text-xs sm:text-sm transition-colors duration-200 ${
        isHovered ? "text-accent" : "text-foreground/75"
      }`}
    >
      {tool.abbr || tool.name}
    </span>
  );
}

export default function ToolList({ items = tools }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[1.2rem] font-normal text-foreground/75 select-none">
        Tools that I use
      </span>

      <div className="flex flex-wrap items-center gap-3">
        {items.map((tool) => {
          const isHovered = hoveredId === tool.id;

          return (
            <div
              key={tool.id || tool.name}
              onMouseEnter={() => setHoveredId(tool.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-card border flex items-center justify-center transition-all duration-200 select-none cursor-pointer ${
                isHovered ? "border-border shadow-md" : "border-border/80"
              }`}
            >
              {/* ── Tool Name Pill on Top ── */}
              {isHovered && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none z-30 animate-fade-in">
                  <span className="bg-accent text-white text-[11px] sm:text-xs font-medium px-2.5 py-0.5 sm:py-1 rounded-full whitespace-nowrap shadow-lg block leading-tight">
                    {tool.name}
                  </span>
                </div>
              )}

              <ToolIcon tool={tool} isHovered={isHovered} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
