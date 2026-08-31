"use client";

import React from "react";
import ProjectCard from "./ProjectCard";

export default function LongFormSection({ projects = [], onSelectProject }) {
  if (projects.length === 0) return null;

  return (
    <div id="long-form" className="flex flex-col gap-8 md:gap-12 pt-8">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
          Long-Form <span className="text-accent">Film & Edits</span>
        </h2>
        <span className="text-xs font-mono text-muted">
          [{projects.length} VIDEOS]
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-16">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={onSelectProject}
            aspectRatio="aspect-[16/9.5]"
          />
        ))}
      </div>
    </div>
  );
}
