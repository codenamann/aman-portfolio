import Link from "next/link";
import AdminProjectThumbnail from "@/components/admin/ui/AdminProjectThumbnail";
import { Film, Sparkles, Edit, Trash2, ExternalLink, Loader2 } from "lucide-react";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";

/**
 * Single Mobile Project Card
 */
export default function ProjectCard({
  project,
  isTogglingFeatured = false,
  onToggleFeatured,
  onDelete,
}) {
  return (
    <div className="p-3.5 bg-[#151517] border border-[#262628] rounded-xl space-y-3">
      {/* Top Header with Thumbnail and Title */}
      <div className="flex items-start gap-3">
        <div className="w-16 h-11 rounded-lg bg-[#111113] overflow-hidden shrink-0 relative border border-[#262628]">
          <AdminProjectThumbnail
            project={project}
            alt={project.title || ""}
            sizes="64px"
            fallbackIconSize={16}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-sm text-[#f2f2f2] truncate">
            {project.title}
          </h4>
          <p className="text-[10px] font-mono text-[#6f6f76] truncate mt-0.5">
            ID: {project.id}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <AdminStatusBadge type={project.format}>
              {project.format}
            </AdminStatusBadge>
            <AdminStatusBadge type={project.status || "published"}>
              {project.status || "published"}
            </AdminStatusBadge>
          </div>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-2 border-t border-[#262628] flex items-center justify-between gap-2">
        <span className="text-[11px] text-[#a1a1a6] font-mono truncate max-w-[120px]">
          {project.year || "—"} {project.duration ? `• ${project.duration}` : ""}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            disabled={isTogglingFeatured}
            onClick={() => onToggleFeatured(project)}
            title="Toggle Featured"
            className={`p-2 rounded-lg text-xs font-medium border transition disabled:opacity-60 disabled:cursor-not-allowed ${
              isTogglingFeatured
                ? "bg-[#18181a] text-[#a1a1a6] border-[#262628]"
                : project.featured
                ? "bg-[#e90c47]/15 text-[#e90c47] border-[#e90c47]/30"
                : "bg-[#18181a] text-[#a1a1a6] border-[#262628] hover:text-white"
            }`}
          >
            {isTogglingFeatured ? (
              <Loader2 size={14} className="animate-spin text-[#a1a1a6]" />
            ) : (
              <Sparkles size={14} />
            )}
          </button>
          {project.videoUrl && (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[#18181a] text-[#a1a1a6] hover:text-white border border-[#262628] transition"
            >
              <ExternalLink size={14} />
            </a>
          )}
          <Link
            href={`/admin/projects/${encodeURIComponent(project.id)}/edit`}
            className="p-2 rounded-lg bg-[#18181a] text-[#a1a1a6] hover:text-white border border-[#262628] transition"
          >
            <Edit size={14} />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(project)}
            className="p-2 rounded-lg bg-[#18181a] text-[#a1a1a6] hover:text-red-400 border border-[#262628] transition cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
