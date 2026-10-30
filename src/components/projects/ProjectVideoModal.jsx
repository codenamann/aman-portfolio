"use client";

import { useEffect, useCallback, useState } from "react";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { X, Loader2 } from "lucide-react";
import { FaInstagram } from "react-icons/fa6";

export default function ProjectVideoModal({ project, onClose }) {
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!project) return;
    setIsIframeLoading(true);

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, handleKeyDown]);

  if (!project) return null;

  const isShort =
    project.format === "short" ||
    project.format === "short-form" ||
    project.format === "reel" ||
    project.url?.includes("/shorts/") ||
    project.videoUrl?.includes("/shorts/");

  const embedUrl = getYouTubeEmbedUrl(project.url || project.videoUrl, {
    autoplay: true,
  });

  const instagramUrl =
    project.links?.instagram ||
    project.instagramUrl ||
    (project.platform === "instagram" ? project.url || project.videoUrl : "");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 md:p-10 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div
        className={`relative w-full flex flex-col gap-2.5 sm:gap-3 ${
          isShort ? "max-w-xs sm:max-w-md max-h-[88dvh]" : "max-w-3xl max-h-[90dvh]"
        }`}
      >
        {/* ── Top Bar with Title, Instagram Link, and Close Button ───────────── */}
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="min-w-0 flex-1">
            <h4
              id="video-modal-title"
              className="font-display font-bold text-sm sm:text-base md:text-lg text-foreground truncate text-ellipsis"
            >
              {project.title}
            </h4>
            <p className="text-[11px] sm:text-xs text-muted truncate">
              {project.subtitle || project.category || (isShort ? "Vertical Short" : "Video Edit")}
            </p>
          </div>

          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10 hover:bg-[#e1306c] text-white text-xs font-medium transition cursor-pointer shrink-0"
              title="Open Reel on Instagram"
            >
              <FaInstagram className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instagram</span>
              <span>↗</span>
            </a>
          )}
        </div>

        {/* ── Adaptive Video Container (16:9 Landscape or 9:16 Portrait) ───── */}
        <div
          className={`relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-border ${
            isShort ? "aspect-[9/16] max-h-[75dvh]" : "aspect-video"
          }`}
        >
          {/* Subtle loading placeholder while iframe is initializing */}
          {isIframeLoading && embedUrl && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#111113] text-zinc-400">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
              <span className="text-xs font-mono">Loading player...</span>
            </div>
          )}

          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={project.title}
              onLoad={() => setIsIframeLoading(false)}
              className="w-full h-full border-0 relative z-20"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm">
              Invalid or missing video URL
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close video player"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface border border-border flex items-center justify-center text-foreground hover:text-accent hover:border-accent/40 transition-colors cursor-pointer absolute top-4 right-4 sm:top-6 sm:right-6 z-50 shadow-lg"
      >
        <X size={18} />
      </button>
    </div>
  );
}

