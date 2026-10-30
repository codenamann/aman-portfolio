"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaYoutube,
} from "react-icons/fa6";
import { getYouTubeThumbnail, getYouTubeVideoId } from "@/lib/youtube";

/**
 * Cinematic Full-Width Movie Carousel
 * Displays showcased projects within the section width (max-w-6xl).
 * Slides advance right-to-left smoothly, repeat in an infinite loop, and handle 1, 2, 3+ projects.
 */
export default function CinematicHeroCarousel({
  projects = [],
  onSelectProject,
  autoPlayInterval = 6000,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [progress, setProgress] = useState(0);
  const [failedThumbs, setFailedThumbs] = useState({});

  const total = projects.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
    setProgress(0);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setProgress(0);
  }, [total]);

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  // Autoplay timer with progress bar
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const intervalStep = 50; // update progress every 50ms
    const totalSteps = autoPlayInterval / intervalStep;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 100 / totalSteps;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [total, isPaused, autoPlayInterval, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (total <= 1) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total, nextSlide, prevSlide]);

  if (!projects || projects.length === 0) return null;

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null || total <= 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    setTouchStartX(null);
  };

  return (
    <div
      className="relative w-full rounded-2xl md:rounded-[2rem] overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Outer Cinematic Frame ────────────────────────────────────────── */}
      <div className="relative w-full rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 bg-[#111113] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Slides Container: exactly 100% width, no subpixel gaps */}
        <div className="relative w-full h-[380px] sm:h-[440px] md:h-[500px] lg:h-[540px] xl:h-[560px] overflow-hidden">
          {projects.map((project, idx) => {
            const videoUrl = project.videoUrl || project.url || "";
            const videoId = project.youtubeId || getYouTubeVideoId(videoUrl);

            // Thumbnail quality fallback handling
            const quality = failedThumbs[project.id] || "maxresdefault";
            const thumbSrc =
              project.thumbnail ||
              (videoId
                ? getYouTubeThumbnail(videoId, quality)
                : "/projects/hoodverse.png");

            // Absolute sliding calculation: each slide is exactly 100% width
            const offset = idx - currentIndex;
            const isVisible =
              Math.abs(offset) <= 1 ||
              (currentIndex === total - 1 && idx === 0) ||
              (currentIndex === 0 && idx === total - 1);

            // Maximum 2 tools visible in hero; remainder show as +N
            const maxTools = 2;
            const visibleTools = (project.tools || []).slice(0, maxTools);
            const remainingToolsCount = (project.tools || []).length - maxTools;

            return (
              <div
                key={project.id || idx}
                className="absolute inset-0 w-full h-full overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: `translateX(${offset * 100}%)`,
                  visibility: isVisible ? "visible" : "hidden",
                }}
              >
                {/* Backdrop Image - strictly clipped within its slide */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <Image
                    src={thumbSrc}
                    alt={project.title}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 1200px) 100vw, 1152px"
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
                    className="object-cover w-full h-full scale-105 transition-transform duration-1000 ease-out"
                  />
                  {/* Layered Cinematic Vignettes for High-Contrast Text Legibility & Seamless Edge Blending */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#111113]/90 via-[#111113]/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-l from-[#111113]/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-10 lg:p-12 z-10 pointer-events-none">
                  {/* Top Header: Clean medium-sized number in top right corner only */}
                  <div className="flex items-center justify-end w-full">
                    <div className="text-sm sm:text-base md:text-lg font-mono text-white/70 select-none tracking-widest drop-shadow">
                      <span className="text-white font-bold">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-zinc-600 mx-1.5">/</span>
                      <span className="text-zinc-400">
                        {String(total).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Only video title, limited tools (+count), and action buttons */}
                  <div className="flex flex-col gap-2.5 sm:gap-3.5 max-w-2xl pointer-events-auto">
                    {/* Video Title */}
                    <h2 className="font-display font-extrabold text-xl sm:text-2xl md:text-4xl lg:text-5xl text-white tracking-tight leading-[1.15] sm:leading-[1.1] drop-shadow-md">
                      {project.title}
                    </h2>

                    {/* Tools Tags (Limited to 2 + count) */}
                    {visibleTools.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        {visibleTools.map((tool) => (
                          <span
                            key={tool}
                            className="px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-200"
                          >
                            {tool}
                          </span>
                        ))}
                        {remainingToolsCount > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-300">
                            +{remainingToolsCount}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons (Hovering pauses autoplay) */}
                    <div className="flex items-center gap-2.5 sm:gap-4 pt-1.5 sm:pt-2.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectProject && onSelectProject(project)
                        }
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        className="inline-flex items-center gap-2 sm:gap-2.5 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#ea0044] hover:bg-[#d00a3e] active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(234,0,68,0.4)] transition-all duration-300 cursor-pointer group"
                      >
                        <FaPlay className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 group-hover:scale-110 transition-transform" />
                        <span>WATCH FILM</span>
                      </button>

                      {videoUrl && (
                        <a
                          href={videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onMouseEnter={() => setIsPaused(true)}
                          onMouseLeave={() => setIsPaused(false)}
                          className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 active:scale-95 text-white text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer"
                        >
                          <FaYoutube className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ea0044]" />
                          <span className="hidden sm:inline">
                            Open on YouTube
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Translucent Navigation Arrows at the very ends ─────────────────── */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              aria-label="Previous Project"
              className="absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/60 text-white/40 hover:text-white backdrop-blur-sm border border-white/5 hover:border-white/20 opacity-40 hover:opacity-100 flex items-center justify-center transition-all duration-300 cursor-pointer"
            >
              <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 -translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              aria-label="Next Project"
              className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/60 text-white/40 hover:text-white backdrop-blur-sm border border-white/5 hover:border-white/20 opacity-40 hover:opacity-100 flex items-center justify-center transition-all duration-300 cursor-pointer"
            >
              <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4 translate-x-0.5" />
            </button>
          </>
        )}

        {/* ── Segmented Progress Bars (Compatible with 1, 2, 3+ projects) ────── */}
        {total > 1 && (
          <div
            className="absolute bottom-3.5 sm:bottom-6 right-4 sm:right-8 md:right-12 z-20 flex items-center gap-1.5 sm:gap-2"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {projects.map((p, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={p.id || idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${p.title}`}
                  className="group relative h-1 sm:h-1.5 rounded-full overflow-hidden transition-all duration-300 cursor-pointer"
                  style={{
                    width: isActive ? "28px" : "10px",
                  }}
                >
                  {/* Background track */}
                  <span className="absolute inset-0 bg-white/20 group-hover:bg-white/40 transition-colors" />

                  {/* Active animated progress bar fill */}
                  {isActive && (
                    <span
                      className="absolute inset-y-0 left-0 bg-[#ea0044] shadow-[0_0_6px_#ea0044] transition-all"
                      style={{
                        width: `${progress}%`,
                        transition: isPaused ? "none" : "width 50ms linear",
                      }}
                    />
                  )}

                  {!isActive && idx < currentIndex && (
                    <span className="absolute inset-0 bg-white/50" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
