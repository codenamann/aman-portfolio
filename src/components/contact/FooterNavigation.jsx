import React from "react";

/**
 * Lower Footer Navigation Row: Menu links, copyright text, and decorative accent dot
 */
export default function FooterNavigation({
  menu = [],
  copyright = "",
  className = "",
}) {
  return (
    <div
      className={`w-full flex flex-col sm:flex-row justify-between md:items-center gap-6 select-none ${className}`}
    >
      {/* ── Menu Column ────────────────────────────────────────────────── */}
      <div className="flex flex-col">
        <span className="text-xs md:text-sm text-muted font-normal uppercase tracking-wider mb-3">
          Menu
        </span>
        <div className="flex items-center gap-6">
          {menu.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-medium text-md md:text-[20px] text-foreground hover:text-accent transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Copyright & Decorative Accent Dot ───────────────────────────── */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
        <p className="text-xs sm:text-sm text-muted font-normal">{copyright}</p>
      </div>
    </div>
  );
}
