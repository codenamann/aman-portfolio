"use client";

import { useState } from "react";
import Image from "next/image";
import { getYouTubeVideoId, getYouTubeThumbnail } from "@/lib/youtube";
import { FaPlay, FaInstagram, FaYoutube } from "react-icons/fa6";

export default function ProjectCard({
  project,
  index,
  onSelect,
  aspectRatio,
  isSpotlight = false,
  className = "",
}) {
  const isInstagram =
    project.platform === "instagram" ||
    project.url?.includes("instagram.com") ||
    project.videoUrl?.includes("instagram.com");

  const isShort =
    project.format === "short" ||
    project.format === "reel" ||
    project.url?.includes("/shorts/") ||
    project.videoUrl?.includes("/shorts/");

  const videoUrl = project.url || project.videoUrl || "";
  const videoId = getYouTubeVideoId(videoUrl);
  const [thumbQuality, setThumbQuality] = useState("maxresdefault");

  // Art-directed custom thumbnail override always takes highest priority
  const thumbnailSrc =
    project.thumbnail ||
    (videoId
      ? getYouTubeThumbnail(videoId, thumbQuality)
      : "/projects/hoodverse.png");

  const handleImageError = () => {
    if (!project.thumbnail && videoId) {
      if (thumbQuality === "maxresdefault") {
        setThumbQuality("hqdefault");
      } else if (thumbQuality === "hqdefault") {
        setThumbQuality("mqdefault");
      }
    }
  };

  const handleClick = () => {
    if (isInstagram) {
      if (videoUrl) {
        window.open(videoUrl, "_blank", "noopener,noreferrer");
      }
    } else {
      if (onSelect) {
        onSelect(project);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  // ── SPOTLIGHT HERO CARD (Full Widescreen Cinematic Showcase) ──────────────
  if (isSpotlight) {
    return (
      <article
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`group relative w-full rounded-3xl md:rounded-[2rem] overflow-hidden bg-card border border-border/80 hover:border-accent/60 transition-all duration-500 cursor-pointer ${className}`}
        aria-label={`Watch spotlight project ${project.title}`}
      >
        {/* Cinematic Backdrop Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-transparent to-accent/10 rounded-[2.1rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.2/1] overflow-hidden bg-surface">
          <Image
            src={thumbnailSrc}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            onError={handleImageError}
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500" />

          {/* Top Bar Badges */}
          <div className="absolute top-6 inset-x-6 sm:inset-x-8 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-white/90">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>FEATURED SPOTLIGHT</span>
            </div>

            {project.duration && (
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-white/70">
                {project.duration}
              </span>
            )}
          </div>

          {/* Center Interactive Play Button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent text-white shadow-2xl shadow-accent/40 group-hover:scale-110 transition-transform duration-500">
              <div className="absolute -inset-2 rounded-full border border-accent/40 animate-ping opacity-60 pointer-events-none" />
              <FaPlay className="w-5 h-5 sm:w-6 sm:h-6 translate-x-0.5" />
            </div>
          </div>

          {/* Bottom Hero Metadata Bar */}
          <div className="absolute bottom-6 sm:bottom-8 inset-x-6 sm:inset-x-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5 max-w-xl">
              <span className="text-xs font-mono text-accent uppercase tracking-widest">
                {project.category}
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-foreground tracking-tight group-hover:text-accent transition-colors">
                {project.title}
              </h2>
              {project.subtitle && (
                <p className="text-sm sm:text-base text-foreground/80 hidden sm:block">
                  {project.subtitle}
                </p>
              )}
            </div>

            {/* Tools Tags */}
            {project.tools && project.tools.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-[11px] font-mono text-white/80 border border-white/10"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  // ── PORTRAIT MOBILE / SHORTS / REELS CARD ──────────────────────────────────
  if (isShort) {
    return (
      <article
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`group flex flex-col cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent transition-transform duration-300 ${className}`}
        aria-label={`${isInstagram ? "Open Reel" : "Play Short"} ${project.title}`}
      >
        <div className="relative w-full aspect-[9/16] rounded-2xl md:rounded-3xl overflow-hidden bg-card border border-border/80 group-hover:border-accent/60 transition-all duration-500">
          <Image
            src={thumbnailSrc}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={handleImageError}
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Vertical Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-black/40 opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

          {/* Top Platform Badge */}
          <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white/90">
            {isInstagram ? (
              <>
                <FaInstagram className="w-3 h-3 text-accent" />
                <span>Reel</span>
              </>
            ) : (
              <>
                <FaYoutube className="w-3 h-3 text-accent" />
                <span>Short</span>
              </>
            )}
          </div>

          {/* Center Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/40 group-hover:scale-110 transition-transform">
              <FaPlay className="w-4 h-4 translate-x-0.5" />
            </div>
          </div>

          {/* Bottom Card Caption */}
          <div className="absolute bottom-4 inset-x-4 flex flex-col gap-1 pointer-events-none">
            <h4 className="font-display font-bold text-sm md:text-[16px] lg:text-[20px] text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-1">
              {project.title}
            </h4>
            <p className="text-xs text-muted/80 line-clamp-1">
              {project.category}
            </p>
          </div>
        </div>
      </article>
    );
  }

  // ── STANDARD WIDESCREEN 16:9 CARD ─────────────────────────────────────────
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group flex flex-col cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all duration-300 ${className}`}
      aria-label={`Play ${project.title}`}
    >
      {/* Artwork Media Frame */}
      <div
        className={`relative w-full ${
          aspectRatio || "aspect-[16/9.5]"
        } rounded-2xl md:rounded-3xl overflow-hidden bg-card border border-border/80 group-hover:border-accent/60 transition-all duration-500`}
      >
        <Image
          src={thumbnailSrc}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={handleImageError}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover Center Play Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-xl shadow-accent/40 group-hover:scale-110 transition-transform duration-300">
            <FaPlay className="w-4 h-4 translate-x-0.5" />
          </div>
        </div>

        {/* Top Duration Stamp */}
        {project.duration && (
          <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/80">
            {project.duration}
          </div>
        )}
      </div>

      {/* Editorial Card Metadata */}
      <div className="mt-4 flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-2.5">
            {index !== undefined && (
              <span className="font-mono text-xs text-accent font-semibold">
                {String(index + 1).padStart(2, "0")} //
              </span>
            )}
            <h3 className="font-display font-bold text-lg sm:text-xl md:text-2xl text-foreground tracking-tight group-hover:text-accent transition-colors">
              {project.title}
            </h3>
          </div>

          <span className="text-xs text-muted/70 group-hover:text-foreground font-mono transition-colors shrink-0">
            VIEW ↗
          </span>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm text-muted">
          <span>{project.category}</span>
          {project.year && (
            <span className="font-mono text-xs opacity-70">{project.year}</span>
          )}
        </div>
      </div>
    </article>
  );
}
