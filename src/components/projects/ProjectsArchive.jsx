"use client";

import { useState, useMemo } from "react";
import { projects as allProjects } from "@/data/projects";
import ProjectVideoModal from "./ProjectVideoModal";
import FeaturedShowcase from "./FeaturedShowcase";
import LongFormSection from "./LongFormSection";
import ShortFormSection from "./ShortFormSection";

export default function ProjectsArchive({ initialProjects = allProjects }) {
  const [selectedProject, setSelectedProject] = useState(null);

  // 1. Featured Showcase Top 5 (1 Spotlight, 2 Long-form, 2 Shorts)
  const featuredShowcase = useMemo(() => {
    const spotlight =
      initialProjects.find((p) => p.spotlight) || initialProjects[0];
    const longForm2 =
      initialProjects.find((p) => p.id === "edit-war-challenge") ||
      initialProjects[4];
    const longForm3 =
      initialProjects.find((p) => p.id === "fast-pace-edit") ||
      initialProjects[8];
    const short1 =
      initialProjects.find((p) => p.id === "minimal-animation") ||
      initialProjects[2];
    const short2 =
      initialProjects.find((p) => p.id === "talking-head-short") ||
      initialProjects[3];

    return {
      spotlight,
      secondaryLongForm: longForm2,
      tertiaryLongForm: longForm3,
      shorts: [short1, short2],
    };
  }, [initialProjects]);

  // 2. All Long-form videos
  const longFormProjects = useMemo(() => {
    return initialProjects.filter((p) => p.format === "long-form");
  }, [initialProjects]);

  // 3. All Vertical Shorts / Reels
  const shortProjects = useMemo(() => {
    return initialProjects.filter(
      (p) => p.format === "short" || p.format === "reel",
    );
  }, [initialProjects]);

  return (
    <div className="relative w-full bg-background min-h-screen pt-32 sm:pt-36 md:pt-44 pb-28 md:pb-40 overflow-hidden">
      {/* ── Ambient Radial Glow ─────────────────────────────────────────── */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="section-container section-px flex flex-col gap-20 md:gap-20">
        {/* ── High-Impact Page Header ──────────────────────────────────────── */}
        <div className="flex flex-col gap-6 md:gap-8 border-b border-border/50 pb-12 md:pb-16">
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

        {/* ── SECTION 1: Featured Showcase (Top Bento) ─────────────────────── */}
        <FeaturedShowcase
          featuredShowcase={featuredShowcase}
          onSelectProject={setSelectedProject}
        />

        {/* ── SECTION 2: Dedicated Long-Form Films ──────────────────────────── */}
        <LongFormSection
          projects={longFormProjects}
          onSelectProject={setSelectedProject}
        />

        {/* ── SECTION 3: Dedicated Vertical Shorts & Reels ──────────────────── */}
        <ShortFormSection
          projects={shortProjects}
          onSelectProject={setSelectedProject}
        />
      </div>

      {/* ── Reusable Adaptive Video Player Modal ─────────────────────────── */}
      <ProjectVideoModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
