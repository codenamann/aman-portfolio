"use client";

import React from "react";
import ProjectCard from "./ProjectCard";

export default function FeaturedShowcase({ featuredShowcase, onSelectProject }) {
  if (!featuredShowcase) return null;

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <h2 className="font-display font-bold text-section-heading text-foreground tracking-tight">
          Featured <span className="text-accent">Showcase</span>
        </h2>
        <span className="text-xs font-mono text-muted">[05 SELECTED]</span>
      </div>

      <div className="flex flex-col gap-12 md:gap-16">
        {/* Spotlight Hero Row */}
        {featuredShowcase.spotlight && (
          <ProjectCard
            project={featuredShowcase.spotlight}
            onSelect={onSelectProject}
            isSpotlight={true}
          />
        )}

        {/* Asymmetric Duo Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
          {/* Left Column (7 cols): Prominent Landscape Feature */}
          {featuredShowcase.secondaryLongForm && (
            <div className="lg:col-span-7">
              <ProjectCard
                project={featuredShowcase.secondaryLongForm}
                onSelect={onSelectProject}
                aspectRatio="aspect-[16/10]"
              />
            </div>
          )}

          {/* Right Column (5 cols): 2 Vertical Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
            {featuredShowcase.shorts.map(
              (project, idx) =>
                project && (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onSelect={onSelectProject}
                    aspectRatio="aspect-[9/16]"
                  />
                )
            )}
          </div>
        </div>

        {/* Bottom Landscape Row */}
        {featuredShowcase.tertiaryLongForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProjectCard
              project={featuredShowcase.tertiaryLongForm}
              onSelect={onSelectProject}
              aspectRatio="aspect-[16/9.5]"
            />
            <div className="hidden md:flex flex-col justify-center p-8 border border-border/50 rounded-3xl bg-card/30 relative overflow-hidden group select-none">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3 className="font-display font-bold text-3xl text-foreground tracking-tight mb-3">
                Want to see <span className="text-accent">more?</span>
              </h3>
              <p className="text-foreground/70 text-base leading-relaxed mb-6">
                Scroll down to explore my dedicated sections for Long-Form
                Films and Short-Form Vertical content.
              </p>
              <div className="text-[4rem] font-bold text-accent/20 group-hover:text-accent/30 transition-colors select-none font-mono">
                ↓↓
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
