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
 * Single Desktop Project Table Row
 * Features centered, minimal 2-state controls without unnecessary space.
 */
export default function ProjectRow({
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
    <tr className="hover:bg-[#18181a] transition-colors group">
      {/* ── Project Thumbnail & Title ────────────────────────────────────── */}
      <td className="py-3 px-4 font-medium text-[#f2f2f2] align-middle">
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

      {/* ── Format Column: Centered icon with aria-label & hover title ───── */}
      <td className="py-3 px-2 text-center w-16 align-middle">
        <div className="flex items-center justify-center">
          {isLongForm ? (
            <div
              className="inline-flex items-center justify-center p-1 select-none cursor-help"
              aria-label="Landscape"
              title="Landscape"
            >
              <Monitor
                size={15}
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
              />
            </div>
          ) : (
            <div
              className="inline-flex items-center justify-center p-1 select-none cursor-help"
              aria-label="Portrait"
              title="Portrait"
            >
              <Smartphone
                size={15}
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
              />
            </div>
          )}
        </div>
      </td>

      {/* ── Status Column: Draft vs Published with identical dimensions ──── */}
      <td className="py-3 px-2 text-center w-32 align-middle">
        <div className="flex items-center justify-center">
          {isPublished ? (
            <button
              type="button"
              disabled={isTogglingStatus}
              onClick={() => onToggleStatus && onToggleStatus(project)}
              title="Published. Click to switch to Draft."
              className="w-[88px] h-7 inline-flex items-center justify-center gap-1.5 rounded-md text-[11px] font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-500 border border-muted/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.2)] transition cursor-pointer select-none disabled:opacity-50 shrink-0"
            >
              {isTogglingStatus ? (
                <Loader2 size={11} className="animate-spin text-white shrink-0" />
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
              title="Draft. Click to Publish."
              className="w-[88px] h-7 inline-flex items-center justify-center gap-1.5 rounded-md text-[11px] font-mono text-zinc-400 hover:text-zinc-200 bg-[#18181a] border border-[#2e2e33] hover:border-zinc-600 transition cursor-pointer select-none disabled:opacity-50 shrink-0"
            >
              {isTogglingStatus ? (
                <Loader2 size={11} className="animate-spin text-zinc-400 shrink-0" />
              ) : (
                <Circle
                  size={12}
                  className="text-zinc-400 stroke-[2] shrink-0"
                />
              )}
              <span className="text-zinc-400">Draft</span>
            </button>
          )}
        </div>
      </td>

      {/* ── Year / Duration (Centered for balanced spacing) ─────────────── */}
      <td className="py-3 px-2 text-center text-[#a1a1a6] font-mono text-[11px] truncate w-28 align-middle">
        <span className="truncate inline-block max-w-full">
          {project.year || "—"} {project.duration ? `• ${project.duration}` : ""}
        </span>
      </td>

      {/* ── Home Page Column: Centered Pin Icon Button ──────────────────── */}
      <td className="py-3 px-2 text-center w-20 align-middle">
        <div className="flex items-center justify-center">
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
                <Loader2 size={12} className="animate-spin text-zinc-300" />
              ) : (
                <Pin
                  size={12}
                  className="text-[#ea0044] fill-current shrink-0"
                />
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
                <Loader2 size={12} className="animate-spin text-zinc-500" />
              ) : (
                <PinOff size={12} className="text-zinc-600 shrink-0" />
              )}
            </button>
          )}
        </div>
      </td>

      {/* ── Carousel Column: Centered Slot Toggle ───────────────────────── */}
      <td className="py-3 px-2 text-center w-28 align-middle">
        <div className="flex items-center justify-center">
          {!isLongForm ? (
            <span
              className="w-[74px] h-7 inline-flex items-center justify-center text-zinc-600 font-mono text-[11px] select-none"
              title="Cinema carousel is for long-form films only"
            >
              —
            </span>
          ) : isInCarousel ? (
            <button
              type="button"
              disabled={isTogglingCarousel}
              onClick={() => onToggleCarousel && onToggleCarousel(project)}
              aria-label={`In Cinema Carousel (Slot ${carouselSlot})`}
              title={`In Cinema Carousel (Slot ${carouselSlot}). Click to remove.`}
              className="w-[74px] h-7 inline-flex items-center justify-center gap-1.5 rounded-md text-[11px] font-mono font-medium text-white bg-[#1f1f22] border border-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] hover:bg-[#252529] transition cursor-pointer select-none disabled:opacity-50 shrink-0"
            >
              {isTogglingCarousel ? (
                <Loader2 size={11} className="animate-spin text-sky-400 shrink-0" />
              ) : (
                <Tv size={12} className="text-sky-400 shrink-0" />
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
              className="w-[74px] h-7 inline-flex items-center justify-center gap-1.5 rounded-md text-[11px] font-mono text-zinc-500 hover:text-zinc-200 bg-[#18181a] border border-[#262628] hover:border-[#333338] transition cursor-pointer select-none disabled:opacity-50 shrink-0"
            >
              {isTogglingCarousel ? (
                <Loader2 size={11} className="animate-spin text-zinc-500 shrink-0" />
              ) : (
                <Tv size={12} className="text-zinc-600 shrink-0" />
              )}
              <span>Off</span>
            </button>
          )}
        </div>
      </td>

      {/* ── Actions ─────────────────────────────────────────────────────── */}
      <td className="py-3 px-4 text-right w-32 align-middle">
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
