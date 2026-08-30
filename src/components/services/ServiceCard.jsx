"use client";
import React, { useRef } from "react";
import { Video, Sparkles, Palette, Music, Film } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

function ServiceIcon({ name, isAccent }) {
  const iconColor = isAccent ? "text-white" : "text-accent";

  switch (name) {
    case "shortform":
      return <Video size={28} className={`shrink-0 ${iconColor}`} />;
    case "motion":
      return <Sparkles size={28} className={`shrink-0 ${iconColor}`} />;
    case "color":
      return <Palette size={28} className={`shrink-0 ${iconColor}`} />;
    case "sound":
      return <Music size={28} className={`shrink-0 ${iconColor}`} />;
    case "brand":
      return <Film size={28} className={`shrink-0 ${iconColor}`} />;
    default:
      return (
        <div
          className={`w-2.5 h-2.5 rounded-full ${isAccent ? "bg-white" : "bg-accent"}`}
        />
      );
  }
}

/**
 * Reusable ServiceCard component supporting 'dark' and 'accent' variants.
 */
export default function ServiceCard({ service, className = "" }) {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const isAccent = service.variant === "accent";

  let angle = isAccent ? [-40, 0] : [40, 0];

  const y = useTransform(scrollYProgress, [0, 0.46], [250, 0]);
  const rotate = useTransform(scrollYProgress, [0, 0.46], angle);

  const containerStyles = isAccent
    ? "bg-accent text-white shadow-xl shadow-accent/10 border border-accent/20"
    : "bg-card text-foreground border border-border/80 shadow-lg shadow-black/40";

  const descriptionStyles = isAccent ? "text-white/90" : "text-foreground/75";

  const tagStyles = isAccent
    ? "bg-white/15 text-white border border-white/20 hover:bg-white/20"
    : "bg-white/[0.04] text-muted border border-border/80 hover:text-foreground hover:border-border";

  return (
    <div
      ref={targetRef}
      className="sticky top-62 sm:top-100 md:top-120 lg:top-60"
    >
      <motion.div style={{ rotate, y }}>
        <article
          className={`relative w-full min-h-80 sm:min-h-60 md:min-h-85 lg:min-h-68 p-4 sm:p-4 rounded-2xl md:rounded-3xl flex flex-col justify-between transition-colors ${containerStyles} ${className}`}
        >
          <div>
            {/* ── Card Header: Icon + Title ─────────────────────────────────────── */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <ServiceIcon name={service.icon} isAccent={isAccent} />
              <h3 className="font-display font-bold text-xl sm:text-2xl md:text-3xl lg:text-3xl tracking-tight leading-snug">
                {service.title}
              </h3>
            </div>

            {/* ── Description ─────────────────────────────────────────────────── */}
            <p
              className={`text-sm sm:text-md md:text-[1.2rem] leading-relaxed mt-2 ${descriptionStyles}`}
            >
              {service.description}
            </p>
          </div>

          {/* ── Tags / Skills Pills ───────────────────────────────────────────── */}
          {service.tags && service.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-sm sm:text-[16px] font-medium px-3.5 py-1.5 rounded-full transition-colors ${tagStyles}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </motion.div>
    </div>
  );
}
