"use client";

import { useState, useMemo } from "react";
import { AlertCircle, Film } from "lucide-react";
import dynamic from "next/dynamic";
import LongFormSection from "./LongFormSection";
import ShortFormSection from "./ShortFormSection";
import CinematicHeroCarousel from "./CinematicHeroCarousel";
import ShortsInfiniteMarquee from "./ShortsInfiniteMarquee";

const ProjectVideoModal = dynamic(() => import("./ProjectVideoModal"), {
  ssr: false,
});

export default function ProjectsArchive({
  initialProjects = [],
  featuredShowcase = null,
  error = null,
  isLoading = false,
}) {
  const [selectedProject, setSelectedProject] = useState(null);

  // 2. All Long-form videos
  const longFormProjects = useMemo(() => {
    return (initialProjects || []).filter((p) => p.format === "long-form");
  }, [initialProjects]);

  // 3. All Vertical Shorts / Reels
  const shortProjects = useMemo(() => {
    return (initialProjects || []).filter(
      (p) =>
        p.format === "short" ||
        p.format === "short-form" ||
        p.format === "reel",
    );
  }, [initialProjects]);

  // 4. Top 5 Showcase Projects for the Full-Width Movie Carousel
  const topFiveProjects = useMemo(() => {
    if (
      featuredShowcase?.topProjects &&
      featuredShowcase.topProjects.length > 0
    ) {
      return featuredShowcase.topProjects;
    }
    if (longFormProjects.length > 0) {
      return longFormProjects.slice(0, 5);
    }
    return (initialProjects || []).slice(0, 5);
  }, [featuredShowcase, longFormProjects, initialProjects]);

  return (
    <div className="relative w-full bg-[#111113] min-h-screen pt-28 sm:pt-32 md:pt-33.75 pb-24 md:pb-36 overflow-hidden">
      {/* ── Hero Heading matching reference ────────────────────────────── */}
      <div className="w-full px-4 sm:px-6 flex flex-col items-center text-center max-w-4xl mx-auto">
        <h1 className="font-display font-bold text-[30px] sm:text-[36px] md:text-[40px] lg:text-6xl tracking-tight leading-[1.12] select-none text-white">
          Projects That <span className="text-[#ea0044]">Shape</span>
          <br />
          <span className="text-[#ea0044]">Ideas into Identity</span>
        </h1>

        <p className="mt-5 text-[13px] text-balance sm:text-[14px] md:text-[20px] text-[#a1a1aa] leading-normal max-w-[440px] sm:max-w-[550px] mx-auto select-none">
          Strategic design approach focused on clarity, helping brands grow
          through consistent, and meaningful visual systems.
        </p>
      </div>

      {/* ── Full-Bleed Horizontal Divider with Centered Accent Dot ───────── */}
      <div className="relative w-full flex items-center justify-center mt-11 mb-11">
        <div className="w-full h-px bg-[#282828]" />
      </div>

      {/* ── BIG FULL-WIDTH LONG-FORM MOVIE CAROUSEL ──────────────────────── */}
      {isLoading ? (
        <div className="w-full max-w-5xl mx-auto section-px mb-12 sm:mb-16 animate-pulse">
          <div className="w-full aspect-[16/9.5] sm:aspect-video rounded-2xl md:rounded-[2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/10" />
          </div>
        </div>
      ) : topFiveProjects.length > 0 ? (
        <div className="w-full max-w-5xl mx-auto section-px mb-12 sm:mb-16">
          <CinematicHeroCarousel
            projects={topFiveProjects}
            onSelectProject={setSelectedProject}
          />
        </div>
      ) : null}

      {/* ── FULL-SCREEN SHORTS INFINITE MARQUEE WITH SMOKY GRADIENT FRAMING ── */}
      {isLoading ? (
        <div className="w-full max-w-5xl mx-auto section-px mb-16 sm:mb-20 animate-pulse">
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[160px] sm:w-[185px] md:w-[250px] aspect-[9/16] rounded-2xl md:rounded-3xl bg-white/[0.03] border border-white/10"
              />
            ))}
          </div>
        </div>
      ) : shortProjects.length > 0 ? (
        <div className="w-full mb-16 sm:mb-20">
          <ShortsInfiniteMarquee
            projects={shortProjects}
            onSelectProject={setSelectedProject}
          />
        </div>
      ) : null}

      {/* ── Main Content Container ───────────────────────────────────────── */}
      <div className="section-container section-px flex flex-col gap-14 sm:gap-18">
        {/* ── Error State ─────────────────────────────────────────────────── */}
        {error ? (
          <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-center flex flex-col items-center justify-center gap-3 my-12">
            <AlertCircle size={28} className="text-red-400" />
            <p className="text-base text-red-400 font-medium">{error}</p>
          </div>
        ) : isLoading ? (
          /* ── Localized Long Form Grid Skeleton ─────────────────────────── */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="w-full aspect-[16/9.5] rounded-2xl bg-white/[0.03] border border-white/10" />
                <div className="w-2/3 h-5 rounded bg-white/10" />
                <div className="w-1/3 h-4 rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : initialProjects.length === 0 ? (
          /* ── Explicit Empty State ───────────────────────────────────────── */
          <div className="py-20 px-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center flex flex-col items-center justify-center gap-3 my-12">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted">
              <Film size={24} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No projects found in the archive
            </h3>
            <p className="text-xs text-muted max-w-md">
              Projects will appear here once they are added and published in the
              admin panel.
            </p>
          </div>
        ) : (

          <>
            {/* ── Dedicated Long-Form Films ────────────────────────────────── */}
            {longFormProjects.length > 0 && (
              <LongFormSection
                projects={longFormProjects}
                onSelectProject={setSelectedProject}
              />
            )}

            {/* ── Dedicated Vertical Shorts & Reels ────────────────────────── */}
            {shortProjects.length > 0 && (
              <ShortFormSection
                projects={shortProjects}
                onSelectProject={setSelectedProject}
              />
            )}
          </>
        )}
      </div>

      {/* ── Reusable Adaptive Video Player Modal ─────────────────────────── */}
      <ProjectVideoModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
