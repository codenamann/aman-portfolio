"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Film,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  ExternalLink,
  Search,
  Check,
  Tv,
  AlertCircle,
  Loader2,
} from "lucide-react";
import AdminProjectThumbnail from "@/components/admin/ui/AdminProjectThumbnail";
import { useAdminToast } from "@/components/admin/ui/AdminToastProvider";

/**
 * Modern Cinema Carousel Order & Curation Manager
 * Allows selecting, unselecting, and reordering top 5 long-form films
 * for the public Projects page cinema carousel.
 */
export default function ArchiveShowcaseManager({
  initialShowcase,
  allProjects = [],
  onShowcaseChange,
}) {
  const toast = useAdminToast();
  const [showcase, setShowcase] = useState(initialShowcase);
  const [updatingId, setUpdatingId] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Extract current carousel IDs
  const carouselIds = useMemo(() => {
    const ids =
      showcase?.carouselIds ||
      showcase?.rawConfig?.carouselIds ||
      showcase?.config?.carouselIds;
    if (Array.isArray(ids)) {
      return ids.filter(Boolean).slice(0, 5);
    }
    const raw = showcase?.rawConfig || showcase?.config || {};
    return [raw.slot1, raw.slot2, raw.slot3, raw.slot4, raw.slot5]
      .filter(Boolean)
      .slice(0, 5);
  }, [showcase]);

  // Map of all projects by ID for fast lookup
  const projectMap = useMemo(() => {
    const map = new Map();
    allProjects.forEach((p) => {
      if (p && p.id) map.set(p.id, p);
    });
    return map;
  }, [allProjects]);

  // All long-form projects available in portfolio
  const longFormProjects = useMemo(() => {
    return allProjects.filter((p) => p.format === "long-form");
  }, [allProjects]);

  // Resolved list of carousel projects in order
  const carouselProjects = useMemo(() => {
    return carouselIds.map((id, index) => {
      const proj = projectMap.get(id);
      return {
        id,
        slotNumber: index + 1,
        project: proj || null,
        isMissing: !proj,
      };
    });
  }, [carouselIds, projectMap]);

  // Filtered available projects for the picker
  const filteredAvailableProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return longFormProjects.filter((p) => {
      if (!query) return true;
      return (
        p.title?.toLowerCase().includes(query) ||
        p.id?.toLowerCase().includes(query) ||
        p.year?.toString().includes(query)
      );
    });
  }, [longFormProjects, searchQuery]);

  // ── Actions ─────────────────────────────────────────────────────────────

  // Move a project up or down in the carousel order
  const handleMove = async (currentIndex, direction) => {
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= carouselIds.length || isReordering) {
      return;
    }

    const newOrder = [...carouselIds];
    const [movedId] = newOrder.splice(currentIndex, 1);
    newOrder.splice(targetIndex, 0, movedId);

    // Optimistic UI update
    const previousShowcase = showcase;
    setShowcase((prev) => ({
      ...prev,
      carouselIds: newOrder,
    }));
    setIsReordering(true);

    try {
      const res = await fetch("/api/admin/showcase", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reorder",
          carouselIds: newOrder,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update carousel order.");
      }

      if (data.showcase) {
        setShowcase(data.showcase);
        if (onShowcaseChange) onShowcaseChange(data.showcase);
      }
      const movedProject = projectMap.get(movedId);
      toast.success(
        `Moved "${movedProject?.title || movedId}" to Slot ${targetIndex + 1}.`
      );
    } catch (err) {
      setShowcase(previousShowcase);
      toast.error(err.message || "Failed to reorder carousel.");
    } finally {
      setIsReordering(false);
    }
  };

  // Add a project to the carousel
  const handleAdd = async (projectId) => {
    if (carouselIds.length >= 5) {
      toast.error("Carousel already has maximum 5 films. Remove one first.");
      return;
    }
    if (carouselIds.includes(projectId) || updatingId) return;

    const newOrder = [...carouselIds, projectId];
    const previousShowcase = showcase;
    setShowcase((prev) => ({
      ...prev,
      carouselIds: newOrder,
    }));
    setUpdatingId(projectId);

    try {
      const res = await fetch("/api/admin/showcase", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          projectId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add project to carousel.");
      }

      if (data.showcase) {
        setShowcase(data.showcase);
        if (onShowcaseChange) onShowcaseChange(data.showcase);
      }
      const proj = projectMap.get(projectId);
      toast.success(
        `"${proj?.title || projectId}" added to Cinema Carousel (Slot ${newOrder.length}).`
      );
    } catch (err) {
      setShowcase(previousShowcase);
      toast.error(err.message || "Failed to add to carousel.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Remove a project from the carousel
  const handleRemove = async (projectId) => {
    if (updatingId) return;

    const newOrder = carouselIds.filter((id) => id !== projectId);
    const previousShowcase = showcase;
    setShowcase((prev) => ({
      ...prev,
      carouselIds: newOrder,
    }));
    setUpdatingId(projectId);

    try {
      const res = await fetch("/api/admin/showcase", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "remove",
          projectId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to remove project from carousel.");
      }

      if (data.showcase) {
        setShowcase(data.showcase);
        if (onShowcaseChange) onShowcaseChange(data.showcase);
      }
      const proj = projectMap.get(projectId);
      toast.success(
        `"${proj?.title || projectId}" removed from Cinema Carousel.`
      );
    } catch (err) {
      setShowcase(previousShowcase);
      toast.error(err.message || "Failed to remove from carousel.");
    } finally {
      setUpdatingId(null);
    }
  };

  const emptySlotsCount = Math.max(0, 5 - carouselProjects.length);

  return (
    <div className="space-y-8 max-w-5xl min-w-0">
      {/* ── Overview & Context Banner ─────────────────────────────────────── */}
      <div className="p-4 rounded-xl bg-[#151517] border border-[#262628] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-300 shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm">
              Projects Cinema Carousel
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-sky-500/15 text-sky-400 border border-sky-500/30">
              {carouselProjects.length} of 5 Films Selected
            </span>
          </div>
          <p className="text-zinc-400 text-xs">
            These long-form films slide right-to-left in the full-width cinema
            carousel at the top of the Projects page. Use the up and down arrows
            to change their display order.
          </p>
        </div>

        <Link
          href="/projects"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white bg-[#1f1f22] hover:bg-[#252529] border border-[#333338] transition cursor-pointer self-start sm:self-auto shrink-0"
        >
          <span>View Public Carousel</span>
          <ExternalLink size={13} />
        </Link>
      </div>

      {/* ── SECTION 1: Active Carousel Order (Slots 1 to 5) ───────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#a1a1a6] font-semibold">
            Slide Order (1 to 5)
          </h3>
          <span className="text-[11px] font-mono text-zinc-500">
            Plays from Slot 1 → Slot 5 in infinite loop
          </span>
        </div>

        {carouselProjects.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-[#2e2e33] bg-[#151517]/50 text-center space-y-2">
            <Tv size={28} className="mx-auto text-zinc-600" />
            <p className="text-xs font-medium text-zinc-300">
              No films selected for the cinema carousel yet.
            </p>
            <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
              Select up to 5 long-form films from the library below to showcase
              them in the carousel.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {carouselProjects.map((item, index) => {
              const { project, slotNumber, isMissing, id } = item;
              const isFirst = index === 0;
              const isLast = index === carouselProjects.length - 1;
              const isUpdatingThis = updatingId === id;

              return (
                <div
                  key={id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#151517] border border-[#262628] hover:border-[#333338] transition-colors shadow-xs"
                >
                  {/* Left: Slot Badge + Thumbnail + Details */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Slot Indicator */}
                    <div className="flex flex-col items-center justify-center w-14 py-1 px-2 rounded-lg bg-[#1a1a1d] border border-[#2a2a2e] shrink-0 text-center">
                      <span className="text-[10px] font-mono font-bold text-sky-400">
                        SLOT {slotNumber}
                      </span>
                      {isFirst && (
                        <span className="text-[9px] font-mono text-emerald-400 leading-none mt-0.5">
                          Hero
                        </span>
                      )}
                    </div>

                    {/* Thumbnail */}
                    <div className="w-24 h-15 rounded-lg bg-[#111113] overflow-hidden shrink-0 relative border border-[#262628]">
                      {isMissing ? (
                        <div className="w-full h-full flex items-center justify-center bg-rose-950/20 text-rose-400">
                          <AlertCircle size={16} />
                        </div>
                      ) : (
                        <AdminProjectThumbnail
                          project={project}
                          alt={project?.title || ""}
                          sizes="96px"
                          fallbackIconSize={16}
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      {isMissing ? (
                        <div>
                          <span className="text-xs font-semibold text-rose-300 block truncate">
                            Missing Project
                          </span>
                          <span className="text-[10px] font-mono text-rose-400/60 block truncate">
                            ID: {id} (project was deleted or unlisted)
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-semibold text-[#f2f2f2] truncate block">
                              {project.title}
                            </span>
                            {project.status === "draft" && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                                Draft
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 mt-0.5 truncate">
                            <span>ID: {project.id}</span>
                            {project.year && <span>• {project.year}</span>}
                            {project.duration && (
                              <span>• {project.duration}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Reorder Up/Down + Remove Controls */}
                  <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#222226]">
                    <div className="inline-flex items-center bg-[#18181a] border border-[#2e2e33] rounded-lg p-0.5">
                      <button
                        type="button"
                        disabled={isFirst || isReordering}
                        onClick={() => handleMove(index, -1)}
                        title={
                          isFirst
                            ? "Already first slide"
                            : `Move up to Slot ${slotNumber - 1}`
                        }
                        className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-[#252529] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-400 transition cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={isLast || isReordering}
                        onClick={() => handleMove(index, 1)}
                        title={
                          isLast
                            ? "Already last slide"
                            : `Move down to Slot ${slotNumber + 1}`
                        }
                        className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-[#252529] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-400 transition cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isUpdatingThis}
                      onClick={() => handleRemove(id)}
                      title="Remove from Carousel"
                      className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-[#262628] hover:border-rose-500/30 transition cursor-pointer disabled:opacity-50"
                    >
                      {isUpdatingThis ? (
                        <Loader2 size={14} className="animate-spin text-rose-400" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Dotted Placeholders for remaining unfilled slots */}
            {emptySlotsCount > 0 &&
              Array.from({ length: emptySlotsCount }).map((_, idx) => {
                const emptySlotNum = carouselProjects.length + idx + 1;
                return (
                  <div
                    key={`empty-${emptySlotNum}`}
                    className="flex items-center justify-between p-3 rounded-xl border border-dashed border-[#262628] bg-[#121214]/40 text-zinc-500 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-14 py-1 px-2 rounded-lg bg-[#171719] border border-[#222225] shrink-0 text-center">
                        <span className="text-[10px] font-mono text-zinc-500">
                          SLOT {emptySlotNum}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-500">
                        Empty Slot — choose a film below to assign
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* ── SECTION 2: Available Long-Form Films Library ──────────────────── */}
      <div className="space-y-4 pt-4 border-t border-[#262628]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#a1a1a6] font-semibold">
              Available Long-Form Films ({longFormProjects.length})
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Click &quot;+ Add to Carousel&quot; to append a film to the cinema
              slideshow.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search films..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#151517] border border-[#262628] text-xs text-[#f2f2f2] placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-mono transition"
            />
          </div>
        </div>

        {filteredAvailableProjects.length === 0 ? (
          <div className="p-6 rounded-xl border border-[#262628] bg-[#151517] text-center text-xs text-zinc-500">
            {searchQuery
              ? `No long-form films match "${searchQuery}".`
              : "No long-form films found in your portfolio."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAvailableProjects.map((project) => {
              const inCarousel = carouselIds.includes(project.id);
              const carouselSlot = inCarousel
                ? carouselIds.indexOf(project.id) + 1
                : null;
              const isUpdatingThis = updatingId === project.id;
              const isCarouselFull = carouselIds.length >= 5 && !inCarousel;

              return (
                <div
                  key={project.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${
                    inCarousel
                      ? "bg-[#18181b] border-sky-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]"
                      : "bg-[#151517] border-[#262628] hover:border-[#333338]"
                  }`}
                >
                  {/* Thumbnail + Title */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-16 h-10 rounded-md bg-[#111113] overflow-hidden shrink-0 relative border border-[#262628]">
                      <AdminProjectThumbnail
                        project={project}
                        alt={project.title || ""}
                        sizes="64px"
                        fallbackIconSize={14}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-[#f2f2f2] truncate block">
                        {project.title}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 mt-0.5 truncate">
                        <span>{project.year || "—"}</span>
                        {project.duration && <span>• {project.duration}</span>}
                        {project.status === "draft" && (
                          <span className="text-zinc-500">• Draft</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add / In-Carousel Button */}
                  <div className="shrink-0">
                    {inCarousel ? (
                      <button
                        type="button"
                        disabled={isUpdatingThis}
                        onClick={() => handleRemove(project.id)}
                        title={`Currently in Slot ${carouselSlot}. Click to remove.`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium text-sky-400 bg-sky-500/10 hover:bg-rose-500/15 hover:text-rose-400 border border-sky-500/30 hover:border-rose-500/40 transition cursor-pointer select-none group"
                      >
                        {isUpdatingThis ? (
                          <Loader2 size={12} className="animate-spin text-sky-400" />
                        ) : (
                          <>
                            <Check
                              size={12}
                              className="text-sky-400 group-hover:hidden shrink-0"
                            />
                            <Trash2
                              size={12}
                              className="hidden group-hover:block text-rose-400 shrink-0"
                            />
                          </>
                        )}
                        <span className="group-hover:hidden">Slot {carouselSlot}</span>
                        <span className="hidden group-hover:inline">Remove</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isCarouselFull || isUpdatingThis}
                        onClick={() => handleAdd(project.id)}
                        title={
                          isCarouselFull
                            ? "Carousel is full (5/5 films). Remove one above to add this."
                            : "Add to Cinema Carousel"
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white bg-[#1f1f22] hover:bg-[#252529] border border-[#2e2e33] hover:border-[#3e3e44] disabled:opacity-40 disabled:hover:bg-[#1f1f22] disabled:hover:text-zinc-300 disabled:cursor-not-allowed transition cursor-pointer select-none"
                      >
                        {isUpdatingThis ? (
                          <Loader2 size={12} className="animate-spin text-zinc-400" />
                        ) : (
                          <Plus size={12} className="text-zinc-400" />
                        )}
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
