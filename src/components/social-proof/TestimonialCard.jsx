import React from "react";
import Image from "next/image";

/**
 * Reusable TestimonialCard with accent color fill and white typography transition on hover
 */
export default function TestimonialCard({ testimonial, className = "" }) {
  if (!testimonial) return null;

  return (
    <div
      className={`group w-64 sm:w-64 md:w-86 h-60 sm:h-64 md:h-60 rounded-3xl bg-[#161618] hover:bg-accent border border-border/80 hover:border-transparent p-5 flex flex-col justify-between shrink-0 shadow-xl select-none cursor-pointer transition-all duration-300 ease-out ${className}`}
    >
      {/* ── Top Area: Quote Icon & Text ─────────────────────────────────── */}
      <div className="flex flex-col">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-hover:text-white/60 fill-current mb-2.5 transition-colors duration-300"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>

        <p className="text-sm sm:text-[15px] text-foreground/80 group-hover:text-white leading-relaxed font-normal transition-colors duration-300">
          {testimonial.quote}
        </p>
      </div>

      {/* ── Bottom Area: Stars & Author Info ────────────────────────────── */}
      <div className="flex flex-col gap-2.5 pt-2">
        <div className="flex items-center gap-1 text-accent group-hover:text-white transition-colors duration-300">
          {[...Array(testimonial.rating || 5)].map((_, i) => (
            <svg
              key={i}
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {testimonial.avatar && (
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-white/10 group-hover:border-white/30 shrink-0 transition-colors duration-300">
              <Image
                src={testimonial.avatar}
                alt={testimonial.author}
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-col">
            <h4 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-white leading-tight transition-colors duration-300">
              {testimonial.author}
            </h4>
            <p className="text-[11px] sm:text-xs text-muted group-hover:text-white/80 leading-tight mt-0.5 transition-colors duration-300">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
