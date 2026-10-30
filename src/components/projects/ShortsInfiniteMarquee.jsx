"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaPlay, FaYoutube, FaInstagram } from "react-icons/fa6";
import gsap from "gsap";
import { getYouTubeThumbnail, getYouTubeVideoId } from "@/lib/youtube";

/**
 * ShortsInfiniteMarquee
 * An infinite horizontal scrolling marquee for vertical short-form projects.
 * - Smooth GSAP-driven scrolling that gently slows down (decelerates) on hover rather than freezing.
 * - Feathered fade edges that seamlessly dissolve cards without heavy black side walls.
 */
export default function ShortsInfiniteMarquee({
  projects = [],
  onSelectProject,
}) {
  const [failedThumbs, setFailedThumbs] = useState({});
  const trackRef = useRef(null);
  const tweenRef = useRef(null);

  // Duplicate items to ensure a seamless infinite loop
  const marqueeItems = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    let list = [...projects];
    while (list.length < 8) {
      list = [...list, ...projects];
    }
    // Duplicate once more so translating -50% loops seamlessly
    return [...list, ...list];
  }, [projects]);

  // GSAP continuous loop with smooth deceleration on hover
  useEffect(() => {
    if (!trackRef.current || marqueeItems.length === 0) return;

    // Reset previous tween
    if (tweenRef.current) tweenRef.current.kill();

    // 45 second continuous loop moving -50%
    tweenRef.current = gsap.to(trackRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 30,
      repeat: -1,
    });

    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [marqueeItems]);

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, {
        timeScale: 0.18, // Slows down to ~18% speed smoothly
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, {
        timeScale: 1, // Smoothly accelerates back to 1x speed
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  };

  if (!projects || projects.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden select-none py-4 sm:py-6">
      {/* ── Section Header (Within max-w-5xl) ────────────────────────────── */}
      <div className="section-container section-px mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="font-display font-bold text-lg sm:text-xl md:text-2xl text-white tracking-tight">
            Vertical <span className="text-[#ea0044]">Shorts & Reels</span>
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400">
          [{projects.length} REELS]
        </span>
      </div>

      {/* ── Marquee Stage (Housed within max-w-5xl with subtle edge feathering) ── */}
      <div
        className="section-container section-px relative overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
        onTouchCancel={handleMouseLeave}
      >
        {/* Soft atmospheric gradient feathering on left & right edges (no harsh black walls) */}
        <div className="absolute inset-y-0 left-0 w-12 sm:w-20 md:w-24 bg-gradient-to-r from-[#111113] to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-12 sm:w-20 md:w-24 bg-gradient-to-l from-[#111113] to-transparent pointer-events-none z-20" />

        {/* ── Infinite Marquee Scrolling Track ───────────────────────────── */}
        <div
          ref={trackRef}
          className="flex items-center gap-4 sm:gap-5 py-2 w-max will-change-transform"
        >
          {marqueeItems.map((project, idx) => {
            const isInstagram =
              project.platform === "instagram" ||
              project.url?.includes("instagram.com") ||
              project.videoUrl?.includes("instagram.com");

            const videoUrl = project.videoUrl || project.url || "";
            const videoId = project.youtubeId || getYouTubeVideoId(videoUrl);
            const quality = failedThumbs[project.id] || "maxresdefault";

            const thumbSrc =
              project.thumbnail ||
              (videoId
                ? getYouTubeThumbnail(videoId, quality)
                : "/projects/hoodverse.png");

            const handleClick = () => {
              if (isInstagram && videoUrl) {
                window.open(videoUrl, "_blank", "noopener,noreferrer");
              } else if (onSelectProject) {
                onSelectProject(project);
              }
            };

            return (
              <div
                key={`${project.id || "short"}-${idx}`}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick();
                  }
                }}
                className="group relative flex-shrink-0 w-[160px] sm:w-[185px] md:w-[250px] aspect-[9/16] rounded-2xl md:rounded-3xl overflow-hidden bg-[#161618] border border-white/10 hover:border-[#ea0044]/60 transition-all duration-300 cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
              >
                {/* Thumbnail Image */}
                <Image
                  src={thumbSrc}
                  alt={project.title}
                  fill
                  priority={idx < 2}
                  loading={idx < 4 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 185px, 250px"
                  onError={() => {
                    if (
                      !project.thumbnail &&
                      videoId &&
                      quality === "maxresdefault"
                    ) {
                      setFailedThumbs((prev) => ({
                        ...prev,
                        [project.id]: "hqdefault",
                      }));
                    }
                  }}
                  className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Dark Vertical Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/25 to-black/30 opacity-90 group-hover:opacity-75 transition-opacity duration-300" />

                {/* Top Platform Badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-medium text-white/90">
                  {isInstagram ? (
                    <FaInstagram className="w-3 h-3 text-[#e1306c]" />
                  ) : (
                    <FaYoutube className="w-3 h-3 text-[#ea0044]" />
                  )}
                  <span>{isInstagram ? "Reel" : "Short"}</span>
                </div>

                {/* Center Hover Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#ea0044] text-white flex items-center justify-center shadow-lg shadow-[#ea0044]/40 group-hover:scale-110 transition-transform duration-300">
                    <FaPlay className="w-3 sm:w-3.5 sm:h-3.5 translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom Card Caption */}
                <div className="absolute bottom-3 inset-x-3 flex flex-col gap-0.5 pointer-events-none">
                  <h4 className="font-display font-bold text-xs sm:text-sm text-white group-hover:text-[#ea0044] transition-colors line-clamp-1 leading-snug">
                    {project.title}
                  </h4>
                  {project.subtitle ? (
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 line-clamp-1 font-mono">
                      {project.subtitle}
                    </p>
                  ) : (
                    project.category && (
                      <p className="text-[10px] sm:text-[11px] text-zinc-400 line-clamp-1 font-mono">
                        {project.category}
                      </p>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
