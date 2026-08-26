import React from "react";
import Image from "next/image";

/**
 * Reusable Discovery CTA sticky card
 */
export default function DiscoveryCTA({ cta, className = "" }) {
  if (!cta) return null;

  const descriptions = Array.isArray(cta.description)
    ? cta.description
    : [cta.description];

  return (
    <div
      className={`w-full lg:w-[40%] lg:max-w-md lg:sticky lg:top-28 rounded-3xl sm:rounded-[28px] bg-accent p-7 sm:p-9 flex flex-col justify-between shadow-2xl self-start select-none ${className}`}
    >
      <div>
        {/* ── Avatar ─────────────────────────────────────────────────────── */}
        {cta.avatar && (
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-md shrink-0">
            <Image
              src={cta.avatar}
              alt="Avatar"
              fill
              sizes="64px"
              className="object-cover object-top"
            />
          </div>
        )}

        {/* ── Title ──────────────────────────────────────────────────────── */}
        <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight leading-[1.15] mt-5 mb-4 whitespace-pre-line">
          {cta.title}
        </h3>

        {/* ── Supporting Description Copy ────────────────────────────────── */}
        <div className="text-sm sm:text-[15px] text-white/90 leading-relaxed font-normal flex flex-col gap-3 mb-8">
          {descriptions.map((desc, idx) => (
            <p key={idx}>{desc}</p>
          ))}
        </div>
      </div>

      {/* ── Actions Row: Schedule Now Button + Secondary Service Link ──── */}
      <div className="flex items-center gap-4 mt-auto pt-2">
        {cta.primaryButton && (
          <a
            href={cta.primaryButton.href || "#contact"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#0d0d0e] hover:bg-black text-white px-5 py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer select-none"
          >
            <svg
              className="w-4 h-4 fill-none stroke-current stroke-2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{cta.primaryButton.label || "Schedule Now"}</span>
          </a>
        )}

        {cta.secondaryLabel && (
          <a
            href={cta.secondaryHref || "#contact"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 hover:text-white text-sm font-semibold transition-colors cursor-pointer select-none"
          >
            {cta.secondaryLabel}
          </a>
        )}
      </div>
    </div>
  );
}
