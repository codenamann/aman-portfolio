import React from "react";

/**
 * Reusable ExperienceCard component for work history entries
 */
export default function ExperienceCard({ experience, className = "" }) {
  if (!experience) return null;

  return (
    <div
      className={`w-full bg-[#18181b] border border-[#27272a] rounded-[20px] px-6 py-5 flex items-center justify-between gap-4 transition-colors hover:border-[#38383e] ${className}`}
    >
      <div className="flex flex-col">
        <h4 className="font-sans font-bold text-[17px] text-foreground tracking-tight leading-snug">
          {experience.company}
        </h4>
        <p className="text-[13px] text-foreground/50 mt-1 leading-normal">
          {experience.role}
        </p>
      </div>

      <span className="text-[12px] sm:text-[13px] text-foreground/50 font-normal shrink-0 self-end pb-0.5">
        {experience.period}
      </span>
    </div>
  );
}
