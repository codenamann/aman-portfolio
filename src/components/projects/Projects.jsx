"use client";

import { useState } from "react";
import { projects as defaultProjects } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import ProjectVideoModal from "./ProjectVideoModal";

export default function Projects({ items = defaultProjects }) {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section
      id="projects"
      className="w-full flex justify-center bg-background border-t border-border section-py section-px"
    >
      <div className="section-container flex-1">
        {/* ── Section Heading ───────────────────────────────────────────── */}
        <h2 className="font-display font-bold text-section-heading text-foreground tracking-tight mb-8 md:mb-12">
          Latest <span className="text-accent">Projects</span>
        </h2>

        {/* ── 2-Column Projects Grid ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10 md:gap-y-12">
          {items.map((project) => (
            <ProjectCard
              key={project.id || project.title}
              project={project}
              onSelect={setSelectedProject}
            />
          ))}
        </div>

        {/* ── Bottom Link ───────────────────────────────────────────────── */}
        <div className="flex justify-center mt-12 lg:mt-15 xl:mt-16">
          <a
            href="#projects"
            className="inline-flex items-center gap-1.5 text-base md:text-[1.2rem] font-medium text-muted hover:text-foreground transition-colors group"
          >
            View all my projects
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </a>
        </div>
      </div>

      {/* ── Reusable Video Player Modal ─────────────────────────────────── */}
      <ProjectVideoModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
