import ProjectRow from "./ProjectRow";

/**
 * Desktop Projects Table Container
 */
export default function ProjectsTable({
  projects = [],
  togglingFeaturedId = null,
  onToggleFeatured,
  onDelete,
}) {
  return (
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full text-left text-xs min-w-[700px]">
        <thead>
          <tr className="border-b border-[#262628] text-[#a1a1a6] uppercase font-mono text-[10px] bg-[#18181a]">
            <th className="py-3 px-4 font-medium">Project</th>
            <th className="py-3 px-3 font-medium">Format</th>
            <th className="py-3 px-3 font-medium">Status</th>
            <th className="py-3 px-3 font-medium">Year / Length</th>
            <th className="py-3 px-3 font-medium">Featured</th>
            <th className="py-3 px-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#262628]">
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              isTogglingFeatured={togglingFeaturedId === project.id}
              onToggleFeatured={onToggleFeatured}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
