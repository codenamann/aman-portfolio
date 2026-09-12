import Link from "next/link";
import AdminProjectThumbnail from "@/components/admin/ui/AdminProjectThumbnail";
import {
  Film,
  Sparkles,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";

/**
 * Single Desktop Project Table Row
 */
export default function ProjectRow({
  project,
  isTogglingFeatured = false,
  onToggleFeatured,
  onDelete,
}) {
  return (
    <tr className="hover:bg-[#18181a] transition-colors group">
      {/* Project Thumbnail & Title */}
      <td className="py-3 px-4 font-medium text-[#f2f2f2] max-w-[280px]">
        <div className="flex items-center gap-3">
          <div className="w-14 h-9 rounded-lg bg-[#111113] overflow-hidden shrink-0 relative border border-[#262628]">
            <AdminProjectThumbnail
              project={project}
              alt={project.title || ""}
              sizes="56px"
              fallbackIconSize={14}
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="truncate block font-semibold text-xs sm:text-sm text-[#f2f2f2]">
              {project.title}
            </span>
            <span className="text-[10px] font-mono text-[#6f6f76] truncate block mt-0.5">
              ID: {project.id}
            </span>
          </div>
        </div>
      </td>

      {/* Format */}
      <td className="py-3 px-3">
        <AdminStatusBadge type={project.format}>
          {project.format}
        </AdminStatusBadge>
      </td>

      {/* Status */}
      <td className="py-3 px-3">
        <AdminStatusBadge type={project.status || "published"}>
          {project.status || "published"}
        </AdminStatusBadge>
      </td>

      {/* Year / Duration */}
      <td className="py-3 px-3 text-[#a1a1a6] font-mono text-[11px] truncate max-w-[130px]">
        {project.year || "—"} {project.duration ? `• ${project.duration}` : ""}
      </td>

      {/* Featured Toggle Button */}
      <td className="py-3 px-3">
        <button
          type="button"
          disabled={isTogglingFeatured}
          onClick={() => onToggleFeatured(project)}
          title={
            project.featured
              ? "Remove from Featured Slots"
              : "Add to Featured Slots"
          }
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer border disabled:opacity-60 disabled:cursor-not-allowed ${
            isTogglingFeatured
              ? "bg-[#18181a] text-[#a1a1a6] border-[#262628]"
              : project.featured
                ? "bg-[#e90c47]/15 text-[#e90c47] border-[#e90c47]/30 hover:bg-[#e90c47]/25"
                : "bg-[#18181a] text-[#a1a1a6] border-[#262628] hover:text-[#f2f2f2] hover:bg-[#1f1f22]"
          }`}
        >
          {isTogglingFeatured ? (
            <>
              <Loader2 size={13} className="animate-spin text-[#a1a1a6]" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <Sparkles
                size={13}
                className={project.featured ? "text-[#e90c47]" : ""}
              />
              <span>{project.featured ? "Featured" : "Feature"}</span>
            </>
          )}
        </button>
      </td>

      {/* Action Buttons */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {project.videoUrl && (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Watch Video"
              className="p-1.5 rounded-lg text-[#a1a1a6] hover:text-white hover:bg-[#1f1f22] transition"
            >
              <ExternalLink size={14} />
            </a>
          )}
          <Link
            href={`/admin/projects/${encodeURIComponent(project.id)}/edit`}
            title="Edit Project"
            className="p-1.5 rounded-lg text-[#a1a1a6] hover:text-white hover:bg-[#1f1f22] transition"
          >
            <Edit size={14} />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(project)}
            title="Delete Project"
            className="p-1.5 rounded-lg text-[#a1a1a6] hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
