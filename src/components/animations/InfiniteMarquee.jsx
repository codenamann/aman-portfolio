"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { getToolLogo } from "@/lib/logos";

/**
 * Generic, high-performance Infinite Marquee component.
 *
 * Features:
 * - First-class direction support ('left' | 'right', defaults to 'left')
 * - Time-based elapsed delta animation for consistent speed across all refresh rates
 * - Infinite seamless looping with zero visible jumps or blank gaps
 * - Configurable speed, gap, and pauseOnHover
 * - Purely generic: accepts dynamic items array OR arbitrary React children
 * - Completely isolated: internal viewport clipping prevents page-level horizontal overflow
 */
export default function InfiniteMarquee({
  children,
  items = [],
  direction = "left",
  speed = 45, // pixels per second
  gap = "gap-5 sm:gap-6",
  pauseOnHover = false,
  className = "",
}) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const isPaused = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationFrame;
    let lastTime = performance.now();
    let width = 0;

    // Measure single-sequence width (track contains 3 identical sequence blocks)
    const updateWidth = () => {
      if (track.firstElementChild) {
        width = track.firstElementChild.getBoundingClientRect().width;
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    // Initial offset based on direction
    let offset = direction === "right" ? -width : 0;

    const animate = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isPaused.current && width > 0) {
        if (direction === "left") {
          offset -= speed * delta;
          if (Math.abs(offset) >= width) {
            offset += width;
          }
        } else {
          offset += speed * delta;
          if (offset >= 0) {
            offset -= width;
          }
        }
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", updateWidth);
      cancelAnimationFrame(animationFrame);
    };
  }, [direction, speed]);

  // Render items based on their type (logo vs text capability vs tool)
  const renderItems = () => {
    return items.map((item, index) => {
      if (item.type === "logo") {
        return (
          <Image
            key={item.src || index}
            src={item.src}
            alt={item.alt || ""}
            width={160}
            height={40}
            className="h-6 sm:h-7 md:h-8 w-auto shrink-0 object-contain select-none opacity-70 transition-opacity hover:opacity-100"
          />
        );
      }

      if (item.type === "tool") {
        const logoSrc = getToolLogo(item.icon || item.name);
        const brandColor = item.color || "#e90c47";
        return (
          <div
            key={item.name || index}
            className="flex items-center gap-2.5 sm:gap-3 px-2 select-none shrink-0 group opacity-85 hover:opacity-100 transition-all duration-300"
            style={{ "--tool-color": brandColor }}
          >
            {logoSrc && (
              <span
                className="inline-block w-5.5 h-5.5 transition-all duration-300 transform group-hover:scale-110 shrink-0"
                style={{
                  backgroundColor: brandColor,
                  maskImage: `url(${logoSrc})`,
                  WebkitMaskImage: `url(${logoSrc})`,
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                }}
                aria-hidden="true"
              />
            )}
            <span
              className="text-sm sm:text-base font-sans font-semibold tracking-tight text-foreground select-none transition-colors duration-300 group-hover:text-[var(--tool-color)]"
            >
              {item.name}
            </span>
            <span className="text-muted/40 font-light select-none text-[10px] sm:text-xs ml-4 group-hover:text-accent/60 transition-colors">
              ✦
            </span>
          </div>
        );
      }

      // Default: text capability item
      return (
        <div
          key={item.label || index}
          className="flex items-center gap-5 sm:gap-7 select-none shrink-0"
        >
          <span className="text-[1.3rem] sm:text-[1.8rem] font-display font-black text-foreground tracking-tighter uppercase leading-none">
            {item.label}
          </span>
          <span className="text-accent/60 font-bold select-none text-[1.2rem] sm:text-[1.5rem]">
            //
          </span>
        </div>
      );
    });
  };

  return (
    <div
      ref={viewportRef}
      onMouseEnter={() => {
        if (pauseOnHover) isPaused.current = true;
      }}
      onMouseLeave={() => {
        if (pauseOnHover) isPaused.current = false;
      }}
      className={cn(`w-full overflow-hidden select-none`, className)}
    >
      <div
        ref={trackRef}
        className="flex w-max will-change-transform"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        {/* Render 3 identical blocks to ensure gapless infinite loop */}
        <div className={`flex items-center shrink-0 pr-5 sm:pr-6 ${gap}`}>
          {children || renderItems()}
        </div>
        <div
          aria-hidden="true"
          className={`flex items-center shrink-0 pr-5 sm:pr-6 ${gap}`}
        >
          {children || renderItems()}
        </div>
        <div
          aria-hidden="true"
          className={`flex items-center shrink-0 pr-5 sm:pr-6 ${gap}`}
        >
          {children || renderItems()}
        </div>
      </div>
    </div>
  );
}
