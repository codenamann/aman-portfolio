import ProjectRow from "./ProjectRow";

/**
 * Desktop Projects Table Container
 */
export default function ProjectsTable({
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
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full text-left text-xs min-w-[800px] table-fixed">
        <thead>
          <tr className="border-b border-[#262628] text-[#a1a1a6] uppercase font-mono text-[10px] bg-[#18181a]">
            <th className="py-3 px-4 font-medium align-middle">Project</th>
            <th className="py-3 px-2 text-center font-medium w-16 align-middle">Format</th>
            <th className="py-3 px-2 text-center font-medium w-32 align-middle">Status</th>
            <th className="py-3 px-2 text-center font-medium w-28 align-middle">Year / Length</th>
            <th className="py-3 px-2 text-center font-medium w-20 align-middle">Home page</th>
            <th className="py-3 px-2 text-center font-medium w-28 align-middle">Carousel</th>
            <th className="py-3 px-4 text-right font-medium w-32 align-middle">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#262628]">
          {projects.map((project) => (
            <ProjectRow
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
        </tbody>
      </table>
    </div>
  );
}
