"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { socialProofData } from "@/data/socialProof";

// ── Avatars & Rating Component ────────────────────────────────────────────────
function ReviewBadge({ avatars = socialProofData.avatars }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
      {/* Overlapping Avatar Stack */}
      <div className="flex items-center -space-x-2.5 sm:-space-x-3">
        {avatars.map((avatar, idx) => (
          <div
            key={idx}
            className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-background shadow-sm shrink-0"
          >
            <Image
              src={avatar.src}
              alt={avatar.alt}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Stars & Text */}
      <div className="flex flex-col justify-center gap-0.5 select-none">
        <div className="flex items-center gap-0.5 text-accent">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-5 h-5 sm:w-4 sm:h-4 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="font-sans text-sm sm:text-[1rem] font-medium text-foreground/80 tracking-tight whitespace-nowrap">
          99+ Happy clients
        </span>
      </div>
    </div>
  );
}

function LogoMarquee({ logos }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport || !track) return;

    let animationFrame;
    let offset = 0;
    let lastTime = performance.now();

    const speed = 100; // pixels per second

    const animate = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      offset -= speed * delta;

      const firstLogo = track.firstElementChild;

      if (firstLogo) {
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap) || 0;

        const firstLogoWidth = firstLogo.getBoundingClientRect().width;
        const firstLogoDistance = firstLogoWidth + gap;

        if (-offset >= firstLogoDistance) {
          offset += firstLogoDistance;
          track.appendChild(firstLogo);
        }
      }

      track.style.transform = `translate3d(${offset}px, 0, 0)`;

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div ref={viewportRef} className="min-w-0 flex-1 overflow-hidden">
      <div
        ref={trackRef}
        className="flex w-max items-center gap-7 sm:gap-10 md:gap-10 lg:gap-14"
      >
        {logos.map((logo) => (
          <Image
            key={logo.src}
            src={logo.src}
            alt={logo.alt}
            width={160}
            height={40}
            className="h-6 sm:h-7 md:h-8 w-auto shrink-0 object-contain select-none opacity-70 transition-opacity hover:opacity-100"
          />
        ))}
      </div>
    </div>
  );
}

// ── Main SocialProof / Client Bar ────────────────────────────────────────────

export default function SocialProof({
  logos = socialProofData.logos,
  className = "",
}) {
  return (
    <div
      aria-label="Client reviews and trusted brands"
      className={cn(
        "w-full py-10 md:py-8 border-t border-border bg-background overflow-hidden",
        className,
      )}
    >
      <div className="section-container section-px">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 md:gap-10 lg:gap-14">
          {/* Review badge */}
          <ReviewBadge />

          <LogoMarquee logos={logos} />
        </div>
      </div>
    </div>
  );
}
