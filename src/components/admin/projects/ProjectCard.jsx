import Link from "next/link";
import AdminProjectThumbnail from "@/components/admin/ui/AdminProjectThumbnail";
import {
  Monitor,
  Smartphone,
  Circle,
  CheckCircle2,
  Pin,
  PinOff,
  Tv,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";

/**
 * Single Mobile Project Card
 * Features clean 2-state controls matching the desktop table.
 */
export default function ProjectCard({
  project,
  isTogglingFeatured = false,
  isTogglingStatus = false,
  isTogglingCarousel = false,
  onToggleFeatured,
  onToggleStatus,
  onToggleCarousel,
  onDelete,
  carouselSlot = null,
}) {
  const isLongForm = project.format === "long-form";
  const isPublished = (project.status || "published") === "published";
  const isPinned = Boolean(project.featured);
  const isInCarousel = Boolean(carouselSlot);

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

          {/* Format Row: Aspect Ratio Icon + Metadata */}
          <div className="flex items-center gap-2 mt-2">
            {isLongForm ? (
              <div
                className="inline-flex items-center gap-1 select-none cursor-help text-zinc-400"
                aria-label="Landscape"
                title="Landscape"
              >
                <Monitor size={14} className="text-zinc-400" />
                <span className="text-[11px] font-mono text-zinc-300">16:9</span>
              </div>
            ) : (
              <div
                className="inline-flex items-center gap-1 select-none cursor-help text-zinc-400"
                aria-label="Portrait"
                title="Portrait"
              >
                <Smartphone size={14} className="text-zinc-400" />
                <span className="text-[11px] font-mono text-zinc-300">9:16</span>
              </div>
            )}

            <span className="text-zinc-600 text-xs">•</span>

            <span className="text-[11px] text-[#a1a1a6] font-mono truncate">
              {project.year || "—"} {project.duration ? `• ${project.duration}` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* 2-State Interactive Control Bar */}
      <div className="pt-2.5 border-t border-[#262628] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Toggle (Draft vs Published) */}
          {isPublished ? (
            <button
              type="button"
              disabled={isTogglingStatus}
              onClick={() => onToggleStatus && onToggleStatus(project)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.2)] transition cursor-pointer select-none disabled:opacity-50"
            >
              {isTogglingStatus ? (
                <Loader2 size={11} className="animate-spin text-white" />
              ) : (
                <CheckCircle2 size={12} className="text-white shrink-0" />
              )}
              <span className="text-white">Published</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isTogglingStatus}
              onClick={() => onToggleStatus && onToggleStatus(project)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-zinc-400 hover:text-zinc-200 bg-[#18181a] border border-[#2e2e33] hover:border-zinc-600 transition cursor-pointer select-none disabled:opacity-50"
            >
              {isTogglingStatus ? (
                <Loader2 size={11} className="animate-spin text-zinc-400" />
              ) : (
                <Circle size={12} className="text-zinc-400 stroke-[2] shrink-0" />
              )}
              <span className="text-zinc-400">Draft</span>
            </button>
          )}

          {/* Home Page Toggle (Pinned vs Off) */}
          {isPinned ? (
            <button
              type="button"
              disabled={isTogglingFeatured}
              onClick={() => onToggleFeatured && onToggleFeatured(project)}
              aria-label="Pinned to Home page"
              title="Pinned to Home page. Click to unpin."
              className="inline-flex items-center justify-center w-7 h-7 rounded-md text-zinc-100 bg-[#1f1f22] border border-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] hover:bg-[#252529] transition cursor-pointer select-none disabled:opacity-50"
            >
              {isTogglingFeatured ? (
                <Loader2 size={11} className="animate-spin text-zinc-300" />
              ) : (
                <Pin size={11} className="text-[#ea0044] fill-current shrink-0" />
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled={isTogglingFeatured}
              onClick={() => onToggleFeatured && onToggleFeatured(project)}
              aria-label="Not on Home page"
              title="Not on Home page. Click to pin."
              className="inline-flex items-center justify-center w-7 h-7 rounded-md text-zinc-500 hover:text-zinc-200 bg-[#18181a] border border-[#262628] hover:border-[#333338] transition cursor-pointer select-none disabled:opacity-50"
            >
              {isTogglingFeatured ? (
                <Loader2 size={11} className="animate-spin text-zinc-500" />
              ) : (
                <PinOff size={11} className="text-zinc-600 shrink-0" />
              )}
            </button>
          )}

          {/* Carousel Toggle for Long-Form */}
          {isLongForm && (
            isInCarousel ? (
              <button
                type="button"
                disabled={isTogglingCarousel}
                onClick={() => onToggleCarousel && onToggleCarousel(project)}
                aria-label={`In Cinema Carousel (Slot ${carouselSlot})`}
                title={`In Cinema Carousel (Slot ${carouselSlot}). Click to remove.`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-white bg-[#1f1f22] border border-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] hover:bg-[#252529] transition cursor-pointer select-none disabled:opacity-50"
              >
                {isTogglingCarousel ? (
                  <Loader2 size={11} className="animate-spin text-sky-400" />
                ) : (
                  <Tv size={11} className="text-sky-400 shrink-0" />
                )}
                <span>Slot {carouselSlot}</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={isTogglingCarousel}
                onClick={() => onToggleCarousel && onToggleCarousel(project)}
                aria-label="Add to Cinema Carousel"
                title="Add to cinema movie carousel on Projects page"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-zinc-500 hover:text-zinc-200 bg-[#18181a] border border-[#262628] hover:border-[#333338] transition cursor-pointer select-none disabled:opacity-50"
              >
                {isTogglingCarousel ? (
                  <Loader2 size={11} className="animate-spin text-zinc-500" />
                ) : (
                  <Tv size={11} className="text-zinc-600 shrink-0" />
                )}
                <span>Off</span>
              </button>
            )
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {project.videoUrl && (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-[#18181a] text-[#a1a1a6] hover:text-white border border-[#262628] transition"
              title="Watch Video"
            >
              <ExternalLink size={14} />
            </a>
          )}
          <Link
            href={`/admin/projects/${encodeURIComponent(project.id)}/edit`}
            className="p-1.5 rounded-lg bg-[#18181a] text-[#a1a1a6] hover:text-white border border-[#262628] transition"
            title="Edit Project"
          >
            <Edit size={14} />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(project)}
            className="p-1.5 rounded-lg bg-[#18181a] text-[#a1a1a6] hover:text-red-400 border border-[#262628] transition cursor-pointer"
            title="Delete Project"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
