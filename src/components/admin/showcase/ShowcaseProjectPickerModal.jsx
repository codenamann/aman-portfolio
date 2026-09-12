"use client";

import { useState } from "react";
import { Search, Film, Check, Loader2 } from "lucide-react";
import AdminModal from "@/components/admin/ui/AdminModal";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminProjectThumbnail from "@/components/admin/ui/AdminProjectThumbnail";

/**
 * Editorial Modal for assigning a project to a 5-Slot Archive Showcase slot
 */
export default function ShowcaseProjectPickerModal({
  isOpen,
  onClose,
  slotKey,
  slotDef,
  slotDetails = {},
  candidateProjects = [],
  onSelectProject,
  updating = false,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittingProjectId, setSubmittingProjectId] = useState(null);

  if (!isOpen || !slotDef) return null;

  const handleSelect = async (projectId) => {
    try {
      setSubmittingProjectId(projectId);
      await onSelectProject(slotKey, projectId);
    } finally {
      setSubmittingProjectId(null);
    }
  };

  const filtered = candidateProjects
    .filter((p) => {
      if (p.format !== slotDef.format) return false;
      if (p.status !== "published") return false;

      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const title = (p.title || "").toLowerCase();
      const client = (p.client || "").toLowerCase();
      const tags = (p.tags || []).join(" ").toLowerCase();
      return (
        title.includes(query) || client.includes(query) || tags.includes(query)
      );
    })
    .sort((a, b) => {
      const dateA = a.createdAt?.toDate
        ? a.createdAt.toDate()
        : new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate
        ? b.createdAt.toDate()
        : new Date(b.createdAt || 0);
      return dateB - dateA;
    });

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={updating ? () => {} : onClose}
      title={`Slot 0${slotDef.slotNumber} · ${
        slotDef.label.split("—")[1]?.trim() || slotDef.label
      }`}
      subtitle={`Showing published ${slotDef.format} projects.`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-3">
        {/* Search Input */}
        <AdminInput
          type="text"
          placeholder={`Filter ${slotDef.format} projects...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
          autoFocus
        />

        {/* Candidate List */}
        <div className="flex-1 max-h-[50vh] overflow-y-auto space-y-2 divide-y divide-[#262628] pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 px-4 text-[#6f6f76]">
              <Film className="w-6 h-6 mx-auto mb-2 opacity-30" />
              <p className="text-xs">
                No published {slotDef.format} projects found.
              </p>
            </div>
          ) : (
            filtered.map((project) => {
              const isCurrentSelection =
                slotDetails[slotKey]?.project?.id === project.id;
              const isAssignedElsewhere = Object.entries(slotDetails).some(
                ([k, s]) => k !== slotKey && s?.project?.id === project.id
              );
              const isThisSubmitting =
                updating && submittingProjectId === project.id;

              return (
                <div
                  key={project.id}
                  className={`pt-2 first:pt-0 flex items-center justify-between gap-3 p-2 rounded-lg transition-colors ${
                    isCurrentSelection
                      ? "bg-[#e90c47]/10 border border-[#e90c47]/30"
                      : "hover:bg-[#18181a]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-9 rounded bg-[#111113] overflow-hidden shrink-0 relative border border-[#262628]">
                      <AdminProjectThumbnail
                        project={project}
                        alt={project.title || ""}
                        sizes="56px"
                        fallbackIconSize={14}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#f2f2f2] truncate">
                        {project.title}
                      </p>
                      <p className="text-[10px] font-mono text-[#a1a1a6] truncate mt-0.5">
                        {project.year ? `Year ${project.year}` : ""}
                        {project.duration ? ` · ${project.duration}` : ""}
                        {isAssignedElsewhere ? " · (In another slot)" : ""}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelect(project.id)}
                    disabled={updating}
                    className={`min-h-[32px] text-xs font-mono px-3 py-1 rounded-lg transition-all shrink-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 ${
                      isCurrentSelection
                        ? "bg-[#e90c47] text-white font-medium shadow-xs"
                        : "bg-[#18181a] hover:bg-[#1f1f22] text-[#f2f2f2] border border-[#262628] hover:border-[#333338]"
                    }`}
                  >
                    {isThisSubmitting ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-[#f2f2f2]" />
                        <span>Selecting...</span>
                      </>
                    ) : isCurrentSelection ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Assigned</span>
                      </>
                    ) : (
                      "Select"
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminModal>
  );
}
