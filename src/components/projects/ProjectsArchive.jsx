"use client";

import { useState, useMemo } from "react";
import { AlertCircle, Film } from "lucide-react";
import ProjectVideoModal from "./ProjectVideoModal";
import FeaturedShowcase from "./FeaturedShowcase";
import LongFormSection from "./LongFormSection";
import ShortFormSection from "./ShortFormSection";

export default function ProjectsArchive({
  initialProjects = [],
  featuredShowcase = null,
  error = null,
}) {
  const [selectedProject, setSelectedProject] = useState(null);

  // Safe reference to server-resolved 5-slot featured showcase
  const resolvedShowcase = useMemo(() => {
    if (featuredShowcase) return featuredShowcase;
    return {
      spotlight: null,
      secondaryLongForm: null,
      tertiaryLongForm: null,
      shorts: [],
    };
  }, [featuredShowcase]);

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

  return (
    <div className="relative w-full bg-background min-h-screen pt-32 sm:pt-36 md:pt-44 pb-28 md:pb-40 overflow-hidden">
      {/* ── Ambient Radial Glow ─────────────────────────────────────────── */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="section-container section-px flex flex-col gap-18">
        {/* ── High-Impact Page Header ──────────────────────────────────────── */}
        <div className="flex flex-col gap-6 md:gap-8 border-b border-border/50 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground tracking-tighter leading-[0.88] select-none">
              SELECTED
              <br />
              <span className="text-accent">WORK</span>
            </h1>

            <div className="flex flex-col gap-3 max-w-md lg:text-right">
              <p className="font-sans text-sm md:text-md lg:text-[1.3rem] text-balance  text-foreground/80 leading-normal">
                Curated portfolio showcasing long-form storytelling edits and
                retention-driven vertical shorts.
              </p>
              <div className="text-xs font-mono text-muted uppercase tracking-wider">
                [{initialProjects.length} CURATED PROJECTS]
              </div>
            </div>
          </div>
        </div>

        {/* ── Error State ─────────────────────────────────────────────────── */}
        {error ? (
          <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-center flex flex-col items-center justify-center gap-3 my-12">
            <AlertCircle size={28} className="text-red-400" />
            <p className="text-base text-red-400 font-medium">{error}</p>
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
              Projects will appear here once they are added and published in the admin panel.
            </p>
          </div>
        ) : (
          <>
            {/* ── SECTION 1: Featured Showcase (Top Bento) ─────────────────── */}
            {(resolvedShowcase.spotlight ||
              resolvedShowcase.secondaryLongForm ||
              resolvedShowcase.shorts?.length > 0 ||
              resolvedShowcase.tertiaryLongForm) && (
              <FeaturedShowcase
                featuredShowcase={resolvedShowcase}
                onSelectProject={setSelectedProject}
              />
            )}

            {/* ── SECTION 2: Dedicated Long-Form Films ──────────────────────── */}
            {longFormProjects.length > 0 && (
              <LongFormSection
                projects={longFormProjects}
                onSelectProject={setSelectedProject}
              />
            )}

            {/* ── SECTION 3: Dedicated Vertical Shorts & Reels ──────────────── */}
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

