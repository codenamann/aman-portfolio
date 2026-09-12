import AdminProjectThumbnail from "@/components/admin/ui/AdminProjectThumbnail";
import { ArrowUp, ArrowDown, X, Plus, Film } from "lucide-react";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";

/**
 * Single Homepage Featured Slot Item (Filled or Empty)
 */
export default function FeaturedSlotCard({
  slotNumber,
  slotIndex,
  project,
  totalSlots,
  activeFormat,
  onMove,
  onRemove,
  onAssign,
}) {
  if (!project) {
    return (
      <div
        onClick={onAssign}
        className="p-5 sm:p-6 rounded-xl bg-[#151517] border border-dashed border-[#262628] hover:border-[#333338] hover:bg-[#18181a] transition flex flex-col items-center justify-center gap-2 cursor-pointer text-center group min-h-[140px]"
      >
        <div className="w-9 h-9 rounded-full bg-[#18181a] group-hover:bg-[#e90c47]/20 group-hover:text-[#e90c47] text-[#6f6f76] flex items-center justify-center transition">
          <Plus size={16} />
        </div>
        <span className="text-xs font-medium text-[#a1a1a6] group-hover:text-white transition">
          Assign Project to Slot #{slotNumber}
        </span>
        <span className="text-[10px] text-[#6f6f76] font-mono">
          Click to pick an unfeatured {activeFormat} project
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-[#333338] transition">
      {/* Slot Index Badge */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-8 h-8 rounded-lg bg-[#18181a] border border-[#262628] text-[#f2f2f2] font-mono font-bold text-xs flex items-center justify-center shrink-0">
          #{slotNumber}
        </div>

        {/* Thumbnail Preview */}
        <div className="w-16 h-11 sm:w-20 sm:h-12 rounded-lg bg-[#111113] overflow-hidden shrink-0 relative border border-[#262628]">
          <AdminProjectThumbnail
            project={project}
            alt={project.title || ""}
            sizes="80px"
            fallbackIconSize={16}
          />
        </div>

        {/* Project Info */}
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-xs sm:text-sm text-[#f2f2f2] truncate">
            {project.title}
          </h4>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-[11px] text-[#a1a1a6] font-mono truncate">
              {project.year ? `Year ${project.year}` : "Portfolio"}
            </span>
            {project.duration && (
              <span className="text-[10px] font-mono text-[#6f6f76]">
                • {project.duration}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Move & Remove Controls */}
      <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
        <button
          type="button"
          onClick={() => onMove(slotIndex, -1)}
          disabled={slotIndex === 0}
          title="Move slot up"
          className="p-2 rounded-lg bg-[#18181a] hover:bg-[#1f1f22] text-[#a1a1a6] hover:text-[#f2f2f2] border border-[#262628] disabled:opacity-20 disabled:cursor-not-allowed transition"
        >
          <ArrowUp size={15} />
        </button>
        <button
          type="button"
          onClick={() => onMove(slotIndex, 1)}
          disabled={slotIndex === totalSlots - 1}
          title="Move slot down"
          className="p-2 rounded-lg bg-[#18181a] hover:bg-[#1f1f22] text-[#a1a1a6] hover:text-[#f2f2f2] border border-[#262628] disabled:opacity-20 disabled:cursor-not-allowed transition"
        >
          <ArrowDown size={15} />
        </button>
        <button
          type="button"
          onClick={() => onRemove(project.id)}
          title="Remove from featured slots"
          className="p-2 rounded-lg bg-[#18181a] hover:bg-red-500/10 text-[#a1a1a6] hover:text-red-400 border border-[#262628] transition ml-1 cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
