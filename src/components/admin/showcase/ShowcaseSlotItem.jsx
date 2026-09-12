import AdminProjectThumbnail from "@/components/admin/ui/AdminProjectThumbnail";
import { AlertCircle, RotateCcw, Film, Loader2 } from "lucide-react";

/**
 * Editorial Showcase Slot Item Component
 */
export default function ShowcaseSlotItem({
  slotKey,
  slotData,
  slotDef,
  aspectRatio = "aspect-video",
  isSpotlight = false,
  onChoose,
  onReset,
  isUpdating = false,
}) {
  const mode = slotData?.mode || "automatic";
  const isMissing = slotData?.isMissing || false;
  const project = slotData?.project;

  const slotNumberFormatted = `0${slotDef.slotNumber}`;
  const slotName = slotDef.label.split("—")[1]?.trim() || slotDef.label;

  return (
    <div className="group flex flex-col border border-[#262628] bg-[#151517] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.5)] transition-colors hover:border-[#333338]">
      {/* Slot Header Line */}
      <div className="px-3.5 py-2.5 border-b border-[#262628] bg-[#18181a] flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#f2f2f2] tracking-wider">
            {slotName.toUpperCase()}
          </span>
        </div>

        <div>
          {isMissing ? (
            <span className="text-rose-400 font-medium inline-flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Missing Project</span>
            </span>
          ) : mode === "manual" ? (
            <span className="text-[#e90c47] font-medium">Manual</span>
          ) : (
            <span className="text-[#6f6f76]">Auto Select</span>
          )}
        </div>
      </div>

      {/* Thumbnail Canvas */}
      <div
        className={`relative w-full ${aspectRatio} bg-[#111113] overflow-hidden`}
      >
        {isMissing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-rose-950/20">
            <AlertCircle className="w-5 h-5 text-rose-400 mb-1.5" />
            <p className="text-xs text-rose-300 font-medium">
              Selected project is no longer available
            </p>
            <p className="text-[10px] font-mono text-rose-400/60 mt-0.5">
              ID: {slotData.missingId}
            </p>
          </div>
        ) : project ? (
          <>
            <AdminProjectThumbnail
              project={project}
              alt={project.title || "Showcase preview"}
              sizes={
                isSpotlight
                  ? "(max-width: 1024px) 100vw, 1100px"
                  : "(max-width: 1024px) 100vw, 600px"
              }
              className="object-cover group-hover:scale-[1.015] transition-transform duration-500 ease-out"
              fallbackIconSize={24}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />

            {/* Subtle Overlay Tags */}
            <div className="absolute bottom-2.5 left-3 right-3 flex flex-col text-[11px] text-white/90">
              <p
                className="text-xs font-semibold text-white/70 truncate leading-snug"
                title={project?.title || "Unassigned"}
              >
                {project ? (
                  project.title
                ) : (
                  <span className="text-[#6f6f76] font-mono italic">
                    Unassigned Slot
                  </span>
                )}
              </p>
              <div className="flex justify-between items-center w-full">
                <span className="font-mono text-[10px] text-white/70 truncate">
                  {project.year ? `Year ${project.year}` : "Portfolio"}
                </span>
                {project.duration && (
                  <span className="font-mono text-[10px] bg-black/80 px-1.5 py-0.5 rounded text-white/80 shrink-0 border border-white/10">
                    {project.duration}
                  </span>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-[#262628] m-3 rounded-lg">
            <p className="text-xs text-[#a1a1a6] font-medium">
              No eligible project
            </p>
            <p className="text-[10px] text-[#6f6f76] mt-0.5 max-w-xs">
              Choose a project manually or wait for an eligible published
              project.
            </p>
          </div>
        )}
      </div>

      {/* Metadata & Controls Footer */}
      <div className="p-3 bg-[#151517] border-t border-[#262628] flex flex-col gap-2.5">
        {/* Title & Info Line */}
        {/* <div className="min-w-0">
          <p
            className="text-xs font-semibold text-[#f2f2f2] truncate leading-snug"
            title={project?.title || "Unassigned"}
          >
            {project ? (
              project.title
            ) : (
              <span className="text-[#6f6f76] font-mono italic">
                Unassigned Slot
              </span>
            )}
          </p>
          {project && (
            <p className="text-[10px] font-mono text-[#6f6f76] truncate mt-0.5">
              {project.year ? `Year ${project.year}` : "Portfolio"}
              {project.duration ? ` • ${project.duration}` : ""}
            </p>
          )}
        </div> */}

        {/* Actions Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#1e1e21]">
          <button
            type="button"
            onClick={onChoose}
            disabled={isUpdating}
            className="flex-1 min-h-[32px] text-[11px] font-mono px-3 py-1.5 bg-[#18181a] hover:bg-[#1f1f22] text-[#f2f2f2] hover:text-white border border-[#262628] hover:border-[#333338] rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-[#a1a1a6]" />
                <span>Updating...</span>
              </>
            ) : project ? (
              "Change Project"
            ) : (
              "Choose Project"
            )}
          </button>

          {(mode === "manual" || isMissing) && (
            <button
              type="button"
              onClick={onReset}
              disabled={isUpdating}
              title="Reset slot to automatic selection"
              className="min-h-[32px] text-[11px] font-mono text-[#a1a1a6] hover:text-[#f2f2f2] hover:bg-[#18181a] border border-[#262628] hover:border-[#333338] rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors px-2.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Auto</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
