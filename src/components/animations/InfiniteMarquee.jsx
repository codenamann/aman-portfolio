"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

/**
 * Generic, high-performance Infinite Marquee component.
 *
 * Features:
 * - First-class direction support ('left' | 'right', defaults to 'left')
 * - Time-based elapsed delta animation for consistent speed across all refresh rates
 * - Infinite seamless looping with zero visible jumps or blank gaps
 * - Configurable speed, gap, and pauseOnHover
 * - Purely generic: accepts arbitrary React children
 * - Completely isolated: internal viewport clipping prevents page-level horizontal overflow
 */
export default function InfiniteMarquee({
  children,
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
          {children}
        </div>
        <div
          aria-hidden="true"
          className={`flex items-center shrink-0 pr-5 sm:pr-6 ${gap}`}
        >
          {children}
        </div>
        <div
          aria-hidden="true"
          className={`flex items-center shrink-0 pr-5 sm:pr-6 ${gap}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
