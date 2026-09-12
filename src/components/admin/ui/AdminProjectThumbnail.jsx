"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Film } from "lucide-react";
import { getYouTubeVideoId } from "@/lib/youtube";

/**
 * Resilient Admin Project Thumbnail Component
 * Automatically falls back from maxresdefault -> hqdefault -> placeholder
 * with smooth fade-in and zero broken-image glyphs.
 */
export default function AdminProjectThumbnail({
  project,
  alt = "Project thumbnail",
  fill = true,
  sizes = "(max-width: 1024px) 100vw, 600px",
  className = "object-cover",
  fallbackIconSize = 16,
}) {
  const videoUrl =
    project?.videoUrl ||
    project?.links?.youtube ||
    project?.url ||
    "";
  const youtubeId = project?.youtubeId || getYouTubeVideoId(videoUrl);

  const initialSrc =
    project?.thumbnail ||
    (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : null);

  const [src, setSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync state if project changes
  useEffect(() => {
    setSrc(initialSrc);
    setHasError(!initialSrc);
    setIsLoaded(false);
  }, [project?.id, project?.thumbnail, initialSrc]);

  const handleError = () => {
    if (src && src.includes("maxresdefault.jpg") && youtubeId) {
      // Fallback to hqdefault which is universally available on YouTube
      setSrc(`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`);
    } else if (src && src.includes("hqdefault.jpg") && youtubeId) {
      // Fallback to mqdefault
      setSrc(`https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#111113] text-[#6f6f76] select-none">
        <Film size={fallbackIconSize} className="opacity-40" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#111113] overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        unoptimized={typeof src === "string" && src.includes("ytimg.com")}
      />
    </div>
  );
}
