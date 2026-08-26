"use client";

import { useState } from "react";
import Image from "next/image";
import { getYouTubeVideoId, getYouTubeThumbnail } from "@/lib/youtube";

export default function ProjectCard({ project, onSelect }) {
  const videoId = getYouTubeVideoId(project.videoUrl);
  const [thumbQuality, setThumbQuality] = useState("maxresdefault");

  const thumbnailSrc = videoId
    ? getYouTubeThumbnail(videoId, thumbQuality)
    : "/projects/hoodverse.png";

  const handleImageError = () => {
    if (thumbQuality === "maxresdefault") {
      setThumbQuality("hqdefault");
    } else if (thumbQuality === "hqdefault") {
      setThumbQuality("mqdefault");
    }
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(project);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group flex flex-col cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl transition-transform"
      aria-label={`View ${project.title} video`}
    >
      {/* ── Card Media / Thumbnail ────────────────────────────────────────── */}
      <div className="relative w-full aspect-[5/2.8] rounded-2xl md:rounded-3xl overflow-hidden bg-card border border-border/60">
        <Image
          src={thumbnailSrc}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={handleImageError}
          className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* ── Metadata & Action ─────────────────────────────────────────────── */}
      <div className="mt-3.5 flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display font-bold text-sm sm:text-lg md:text-[1.15rem] text-foreground tracking-tight group-hover:text-accent transition-colors">
            {project.title}
          </h3>

          <span className="text-xs md:text-[13px] text-muted group-hover:text-foreground flex items-center gap-1 shrink-0 transition-colors font-medium select-none">
            <span className="text-[11px] font-sans">↗</span> View Project
          </span>
        </div>

        <p className="text-xs md:text-sm text-muted mt-1">{project.category}</p>
      </div>
    </article>
  );
}
