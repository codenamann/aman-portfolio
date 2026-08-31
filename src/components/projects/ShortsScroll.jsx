import React from "react";
import ProjectCard from "./ProjectCard";

export default function ShortsScroll({ projects, onSelectProject }) {
  return (
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
  );
}
