"use client";

import React from "react";
import ProjectCard from "./ProjectCard";
import ShortsScroll from "./ShortsScroll";

export default function ShortFormSection({ projects = [], onSelectProject }) {
  if (projects.length === 0) return null;

  return (
    <div id="shorts" className="flex flex-col gap-8 md:gap-12 pt-8">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
          Vertical <span className="text-accent">Shorts & Reels</span>
        </h2>
        <span className="text-xs font-mono text-muted">
          [{projects.length} REELS]
        </span>
      </div>

      <ShortsScroll projects={projects} onSelectProject={onSelectProject} />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={onSelectProject}
            aspectRatio="aspect-[9/16]"
          />
        ))}
      </div>
    </div>
  );
}
