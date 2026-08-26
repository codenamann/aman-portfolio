"use client";

import React from "react";

/**
 * Restrained Editorial Filter Bar for Work Archive
 */
export default function ProjectFilter({
  filters = [],
  activeFilter = "all",
  onSelectFilter,
  counts = {},
  className = "",
}) {
  return (
    <div
      className={`flex items-center gap-6 sm:gap-8 md:gap-10 border-b border-border/40 pb-4 overflow-x-auto no-scrollbar select-none ${className}`}
      role="tablist"
      aria-label="Filter projects"
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        const count = counts[filter.id] ?? 0;

        return (
          <button
            key={filter.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectFilter(filter.id)}
            className={`group cursor-pointer text-sm sm:text-base transition-all shrink-0 relative py-1.5 flex items-center gap-1.5 ${
              isActive
                ? "text-foreground font-semibold"
                : "text-muted hover:text-foreground font-normal"
            }`}
          >
            <span>{filter.label}</span>
            {count > 0 && (
              <span
                className={`text-[11px] font-mono transition-opacity ${
                  isActive ? "text-accent opacity-100" : "text-muted/60 opacity-60 group-hover:opacity-100"
                }`}
              >
                ({count})
              </span>
            )}
            {isActive && (
              <span className="absolute -bottom-4 left-0 right-0 h-[2px] bg-accent" />
            )}
          </button>
        );
      })}
    </div>
  );
}
