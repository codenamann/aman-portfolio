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

  return (
    <div className={`w-full flex-1 flex flex-col gap-8 ${className}`}>
      {/* ── Descriptive Paragraphs ───────────────────────────────────────── */}
      <div className="flex flex-col gap-5 text-base sm:text-[18px] text-foreground/75 leading-relaxed font-normal">
        {paragraphs.map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </div>

      {/* ── Signature Graphic / Script ───────────────────────────────────── */}
      {signature && (
        <div className="my-1">
          {signature.type === "image" && signature.src && !imageError ? (
            <img
              src={signature.src}
              alt="Signature"
              onError={() => setImageError(true)}
              className="h-14 sm:h-16 w-auto object-contain"
            />
          ) : (
            <div className="font-script font-bold text-5xl sm:text-6xl text-accent -rotate-6 select-none inline-block">
              {signature.text || "Aman"}
            </div>
          )}
        </div>
      )}

      {/* ── Work History Component ───────────────────────────────────────── */}
      <WorkHistory items={workHistory} />
    </div>
  );
}
