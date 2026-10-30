import ProjectCard from "./ProjectCard";

/**
 * Mobile Projects Card List Container (< sm)
 */
export default function ProjectsMobileList({
  projects = [],
  togglingFeaturedId = null,
  togglingStatusId = null,
  togglingCarouselId = null,
  onToggleFeatured,
  onToggleStatus,
  onToggleCarousel,
  onDelete,
  getCarouselSlot,
}) {
  return (
    <div className="sm:hidden divide-y divide-white/5 space-y-3 p-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isTogglingFeatured={togglingFeaturedId === project.id}
          isTogglingStatus={togglingStatusId === project.id}
          isTogglingCarousel={togglingCarouselId === project.id}
          onToggleFeatured={onToggleFeatured}
          onToggleStatus={onToggleStatus}
          onToggleCarousel={onToggleCarousel}
          onDelete={onDelete}
          carouselSlot={getCarouselSlot ? getCarouselSlot(project.id) : null}
        />
      ))}
    </div>
  );
}
