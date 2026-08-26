import { cn } from "@/lib/utils";
import React from "react";

/**
 * Large Closing Brand Typography (e.g. "MR. AMAN")
 */
export default function FooterSignature({ text = "MR. AMAN", className = "" }) {
  if (!text) return null;

  return (
    <div
      className={cn(
        `w-full overflow-hidden select-none pt-4 sm:pt-6 ${className}`,
      )}
    >
      <h2
        className="font-display font-black text-accent uppercase tracking-tighter leading-[0.75] text-[3.9rem] md:text-[9.6rem] lg:text-[13rem] xl:text-[13.9rem] text-center sm:text-left break-normal"
        style={{ letterSpacing: "-0.04em" }}
      >
        {text}
      </h2>
    </div>
  );
}
