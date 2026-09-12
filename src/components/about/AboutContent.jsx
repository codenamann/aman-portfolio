"use client";

import { useState } from "react";
import WorkHistory from "./WorkHistory";

/**
 * Right-side Content for About section:
 * Paragraphs, Signature, and Work History
 */
export default function AboutContent({
  paragraphs = [],
  signature,
  workHistory = [],
  className = "",
}) {
  const [imageError, setImageError] = useState(false);

  const signatureSrc =
    typeof signature === "string" ? signature : signature?.src || "";

  return (
    <div className={`w-full flex-1 flex flex-col gap-8 ${className}`}>
      {/* ── Descriptive Paragraphs ───────────────────────────────────────── */}
      <div className="flex flex-col gap-5 text-base sm:text-[18px] text-foreground/75 leading-relaxed font-normal">
        {paragraphs.map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </div>

      {/* ── Signature Graphic (Authentic Red Signature Image) ─────────────── */}
      {signatureSrc && !imageError && (
        <div className="my-1">
          <img
            src={signatureSrc}
            alt="Signature"
            onError={() => setImageError(true)}
            className="h-14 sm:h-16 w-auto object-contain"
          />
        </div>
      )}

      {/* ── Work History Component ───────────────────────────────────────── */}
      <WorkHistory items={workHistory} />
    </div>
  );
}
