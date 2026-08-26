"use client";

import { useState, useMemo } from "react";
import { projects as allProjects, projectFilters } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import ProjectVideoModal from "./ProjectVideoModal";
import { LayoutGrid, Grid2X2 } from "lucide-react";

export default function ProjectsArchive({
  initialProjects = allProjects,
  filters = projectFilters,
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("bento"); // 'bento' | 'grid'
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter item counts
  const filterCounts = useMemo(() => {
    const counts = { all: initialProjects.length };
    filters.forEach((f) => {
      if (f.id === "all") return;
      counts[f.id] = initialProjects.filter((p) => {
        if (f.id === "long-form") return p.format === "long-form" || !p.format;
        if (f.id === "short") return p.format === "short" || p.format === "reel";
        return p.category?.toLowerCase().includes(f.id);
      }).length;
    });
    return counts;
  }, [initialProjects, filters]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return initialProjects;
    return initialProjects.filter((p) => {
      if (activeFilter === "long-form") return p.format === "long-form" || !p.format;
      if (activeFilter === "short") return p.format === "short" || p.format === "reel";
      return p.category?.toLowerCase().includes(activeFilter);
    });
  }, [initialProjects, activeFilter]);

  // Spotlight project (HOODVERSE)
  const spotlightProject = useMemo(() => {
    return initialProjects.find((p) => p.spotlight) || initialProjects[0];
  }, [initialProjects]);

  // Secondary project for bento layout
  const secondaryLongForm = useMemo(() => {
    return (
      initialProjects.find(
        (p) =>
          (p.format === "long-form" || !p.format) && p.id !== spotlightProject?.id
      ) || initialProjects[1]
    );
  }, [initialProjects, spotlightProject]);

  const allVerticalProjects = useMemo(() => {
    return initialProjects.filter((p) => p.format === "short" || p.format === "reel");
  }, [initialProjects]);

  // Top 2 vertical projects for the asymmetric row
  const featuredVertical = useMemo(() => {
    return allVerticalProjects.slice(0, 2);
  }, [allVerticalProjects]);

  // Additional vertical projects if more than 2
  const additionalVertical = useMemo(() => {
    return allVerticalProjects.slice(2);
  }, [allVerticalProjects]);

  const remainingLongForm = useMemo(() => {
    return initialProjects.filter(
      (p) =>
        (p.format === "long-form" || !p.format) &&
        p.id !== spotlightProject?.id &&
        p.id !== secondaryLongForm?.id
    );
  }, [initialProjects, spotlightProject, secondaryLongForm]);

  return (
    <div className="relative w-full bg-background min-h-screen pt-32 sm:pt-36 md:pt-44 pb-28 md:pb-40 overflow-hidden">
      {/* ── Ambient Radial Glow in Top Corner ──────────────────────────────── */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="section-container section-px flex flex-col gap-14 md:gap-20">
        {/* ── High-Impact Cinematic Page Header ─────────────────────────────── */}
        <div className="flex flex-col gap-6 md:gap-8 border-b border-border/50 pb-12 md:pb-16">
          {/* Top Monospace Studio Status Indicator */}
          <div className="flex items-center justify-between text-xs font-mono text-muted/80 tracking-widest uppercase">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>ARCHIVE // 2024 — 2025</span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-foreground/70">COMMISSIONS: AVAILABLE</span>
            </div>
          </div>

          {/* Grand Typographic Headline */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground tracking-tighter leading-[0.88] select-none">
              SELECTED
              <br />
              <span className="text-accent">WORK</span>
            </h1>

            <div className="flex flex-col gap-3 max-w-md lg:text-right">
              <p className="font-sans text-base sm:text-lg text-foreground/80 leading-relaxed">
                Video editing, motion direction, high-energy pacing, and tactile 3D brand storytelling.
              </p>
              <div className="text-xs font-mono text-muted uppercase tracking-wider">
                [{initialProjects.length} CURATED PROJECTS]
              </div>
            </div>
          </div>
        </div>

        {/* ── Studio Control Dock (Filters & View Switcher) ─────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
          {/* Category Tabs */}
          <div
            className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-1 select-none"
            role="tablist"
            aria-label="Filter works by format"
          >
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;
              const count = filterCounts[filter.id] ?? 0;

              return (
                <button
                  key={filter.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`group cursor-pointer text-sm sm:text-base transition-all shrink-0 relative py-1.5 flex items-center gap-2 ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted hover:text-foreground font-normal"
                  }`}
                >
                  <span>{filter.label}</span>
                  {count > 0 && (
                    <span
                      className={`text-[11px] font-mono transition-opacity ${
                        isActive
                          ? "text-accent opacity-100"
                          : "text-muted/60 opacity-60 group-hover:opacity-100"
                      }`}
                    >
                      [{count}]
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-5 left-0 right-0 h-[2px] bg-accent" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Layout View Mode Switcher (Visible on 'all' filter) */}
          {activeFilter === "all" && (
            <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border/80 text-muted">
              <button
                type="button"
                onClick={() => setViewMode("bento")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewMode === "bento"
                    ? "bg-surface text-foreground shadow-sm"
                    : "hover:text-foreground"
                }`}
                title="Bento Editorial Layout"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-accent" />
                <span>BENTO</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-surface text-foreground shadow-sm"
                    : "hover:text-foreground"
                }`}
                title="Uniform Showreel Grid"
              >
                <Grid2X2 className="w-3.5 h-3.5 text-accent" />
                <span>GRID</span>
              </button>
            </div>
          )}
        </div>

        {/* ── Main Projects Composition ─────────────────────────────────────── */}
        {filteredProjects.length > 0 ? (
          <div className="flex flex-col gap-16 md:gap-24">
            {/* 1. BENTO EDITORIAL SHOWCASE (Default 'all' view) */}
            {activeFilter === "all" && viewMode === "bento" ? (
              <div className="flex flex-col gap-16 md:gap-24">
                {/* ── ROW 1: Hero Spotlight Project (HOODVERSE) ─────────────── */}
                {spotlightProject && (
                  <ProjectCard
                    project={spotlightProject}
                    onSelect={setSelectedProject}
                    isSpotlight={true}
                  />
                )}

                {/* ── ROW 2: Asymmetric Duo (Landscape Project + 2 Vertical Reels) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
                  {/* Left Column (7 cols): Prominent Landscape Feature */}
                  {secondaryLongForm && (
                    <div className="lg:col-span-7">
                      <ProjectCard
                        project={secondaryLongForm}
                        index={1}
                        onSelect={setSelectedProject}
                        aspectRatio="aspect-[16/10]"
                      />
                    </div>
                  )}

                  {/* Right Column (5 cols): 2 Sleek Smartphone Vertical Cards */}
                  <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
                    {featuredVertical.map((project, idx) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={idx}
                        onSelect={setSelectedProject}
                        aspectRatio="aspect-[9/16]"
                      />
                    ))}
                  </div>
                </div>

                {/* ── ROW 3: Additional Vertical Shorts / Reels Showcase (if >2) ── */}
                {additionalVertical.length > 0 && (
                  <div className="pt-4">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground tracking-tight">
                        Vertical <span className="text-accent">Shorts & Reels</span>
                      </h3>
                      <span className="text-xs font-mono text-muted">
                        [{allVerticalProjects.length} REELS]
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                      {allVerticalProjects.map((project, idx) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          index={idx}
                          onSelect={setSelectedProject}
                          aspectRatio="aspect-[9/16]"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* ── ROW 4: Balanced Twin Landscape Features ────────────────── */}
                {remainingLongForm.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-16">
                    {remainingLongForm.map((project, idx) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={idx + 3}
                        onSelect={setSelectedProject}
                        aspectRatio="aspect-[16/9.5]"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : activeFilter === "short" ? (
              /* 2. DEDICATED SHORTS & REELS GRID (3-4 Column Portrait) */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {filteredProjects.map((project, idx) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={idx}
                    onSelect={setSelectedProject}
                    aspectRatio="aspect-[9/16]"
                  />
                ))}
              </div>
            ) : (
              /* 3. DEDICATED LONG-FORM / GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-16">
                {filteredProjects.map((project, idx) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={idx}
                    onSelect={setSelectedProject}
                    aspectRatio="aspect-[16/9.5]"
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full py-28 flex flex-col items-center justify-center text-center gap-4 border border-border/50 rounded-3xl bg-card">
            <p className="text-muted text-base">No work found in this category.</p>
            <button
              onClick={() => setActiveFilter("all")}
              className="text-sm font-medium text-accent hover:underline cursor-pointer"
            >
              Show all works
            </button>
          </div>
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
