"use client";

import { useState } from "react";
import { Search, Film, Check } from "lucide-react";
import AdminModal from "@/components/admin/ui/AdminModal";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminProjectThumbnail from "@/components/admin/ui/AdminProjectThumbnail";

/**
 * Modal to pick candidate projects for a Homepage Featured Slot
 */
export default function FeaturedProjectPickerModal({
  isOpen,
  onClose,
  slotIndex,
  activeFormat,
  candidateProjects = [],
  onSelectProject,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = candidateProjects.filter((p) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    const title = (p.title || "").toLowerCase();
    const client = (p.client || "").toLowerCase();
    return title.includes(query) || client.includes(query);
  });

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Project to Slot #${(slotIndex ?? 0) + 1}`}
      subtitle={`Choose an eligible published ${activeFormat} project.`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <AdminInput
          type="text"
          placeholder="Filter by title or client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
          autoFocus
        />

        {/* Candidate List */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-[#6f6f76] text-xs">
              No eligible unfeatured {activeFormat} projects found.
            </div>
          ) : (
            filtered.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="p-3 rounded-xl bg-[#18181a] border border-[#262628] hover:border-[#e90c47]/40 hover:bg-[#1f1f22] transition flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-14 h-9 rounded bg-[#111113] overflow-hidden shrink-0 relative border border-[#262628]">
                    <AdminProjectThumbnail
                      project={project}
                      alt={project.title || ""}
                      sizes="56px"
                      fallbackIconSize={14}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-semibold text-[#f2f2f2] truncate group-hover:text-white transition">
                      {project.title}
                    </h5>
                    <p className="text-[10px] font-mono text-[#a1a1a6] truncate mt-0.5">
                      {project.year ? `Year ${project.year}` : "Portfolio"}
                      {project.duration ? ` • ${project.duration}` : ""}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-[#e90c47] opacity-0 group-hover:opacity-100 transition shrink-0 font-medium">
                  Assign ➔
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminModal>
  );
}
