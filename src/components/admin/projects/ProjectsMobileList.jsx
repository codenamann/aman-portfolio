import ProjectCard from "./ProjectCard";

/**
 * Mobile Projects Card List Container (< sm)
 */
export default function ProjectsMobileList({
  projects = [],
  togglingFeaturedId = null,
  onToggleFeatured,
  onDelete,
}) {
  return (
    <div className="sm:hidden divide-y divide-white/5 space-y-3 p-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isTogglingFeatured={togglingFeaturedId === project.id}
          onToggleFeatured={onToggleFeatured}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
