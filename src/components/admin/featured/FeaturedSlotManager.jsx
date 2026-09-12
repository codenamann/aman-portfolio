"use client";

import { useState, useEffect } from "react";
import { Sparkles, Save, Loader2 } from "lucide-react";
import { useAdminToast } from "@/components/admin/ui/AdminToastProvider";
import FeaturedSlotCard from "./FeaturedSlotCard";
import FeaturedProjectPickerModal from "./FeaturedProjectPickerModal";
import {
  PROJECT_FORMATS,
  MAX_FEATURED_SHORT_FORM,
  MAX_FEATURED_LONG_FORM,
} from "@/lib/constants/limits";

/**
 * Homepage Featured Slots Manager (Strict 4+4 model)
 */
export default function FeaturedSlotManager({ initialProjects = [] }) {
  const toast = useAdminToast();
  const [activeTab, setActiveTab] = useState(PROJECT_FORMATS.SHORT_FORM);
  const [allProjects, setAllProjects] = useState(initialProjects);
  const [shortSlots, setShortSlots] = useState([]);
  const [longSlots, setLongSlots] = useState([]);
  const [saving, setSaving] = useState(false);
  const [pickerSlotIndex, setPickerSlotIndex] = useState(null);

  // Initialize slots
  useEffect(() => {
    const shorts = allProjects
      .filter((p) => p.format === PROJECT_FORMATS.SHORT_FORM && p.featured)
      .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99))
      .slice(0, MAX_FEATURED_SHORT_FORM);

    const longs = allProjects
      .filter((p) => p.format === PROJECT_FORMATS.LONG_FORM && p.featured)
      .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99))
      .slice(0, MAX_FEATURED_LONG_FORM);

    setShortSlots(shorts);
    setLongSlots(longs);
  }, [allProjects]);

  const currentSlots =
    activeTab === PROJECT_FORMATS.SHORT_FORM ? shortSlots : longSlots;
  const maxSlots =
    activeTab === PROJECT_FORMATS.SHORT_FORM
      ? MAX_FEATURED_SHORT_FORM
      : MAX_FEATURED_LONG_FORM;

  // Candidate unfeatured projects for picker modal
  const candidateProjects = allProjects.filter(
    (p) =>
      p.format === activeTab &&
      !currentSlots.some((slot) => slot.id === p.id) &&
      p.status !== "archived"
  );

  const handleMove = (index, direction) => {
    const list = [...currentSlots];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    if (activeTab === PROJECT_FORMATS.SHORT_FORM) {
      setShortSlots(list);
    } else {
      setLongSlots(list);
    }
  };

  const handleRemove = (id) => {
    if (activeTab === PROJECT_FORMATS.SHORT_FORM) {
      setShortSlots((prev) => prev.filter((p) => p.id !== id));
    } else {
      setLongSlots((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleAssign = (project) => {
    if (pickerSlotIndex === null) return;
    const list = [...currentSlots];

    if (pickerSlotIndex < list.length) {
      list[pickerSlotIndex] = project;
    } else {
      list.push(project);
    }

    if (activeTab === PROJECT_FORMATS.SHORT_FORM) {
      setShortSlots(list.slice(0, MAX_FEATURED_SHORT_FORM));
    } else {
      setLongSlots(list.slice(0, MAX_FEATURED_LONG_FORM));
    }

    setPickerSlotIndex(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const orderedIds = currentSlots.map((p) => p.id);

      const res = await fetch("/api/admin/featured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format: activeTab,
          featuredIds: orderedIds,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to update featured order");
      }

      toast.success(
        `Featured ${
          activeTab === PROJECT_FORMATS.SHORT_FORM ? "Shorts" : "Long-Form"
        } slots updated successfully!`
      );
    } catch (err) {
      toast.error(err.message || "Failed to update featured slots");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl min-w-0">
      {/* Format Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-1.5 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab(PROJECT_FORMATS.SHORT_FORM)}
            className={`min-h-[44px] px-5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === PROJECT_FORMATS.SHORT_FORM
                ? "bg-[#e90c47] text-white shadow-sm"
                : "text-[#a1a1a6] hover:text-[#f2f2f2] hover:bg-[#18181a]"
            }`}
          >
            <Sparkles size={14} />
            <span>Shorts ({shortSlots.length}/{MAX_FEATURED_SHORT_FORM})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(PROJECT_FORMATS.LONG_FORM)}
            className={`min-h-[44px] px-5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === PROJECT_FORMATS.LONG_FORM
                ? "bg-[#e90c47] text-white shadow-sm"
                : "text-[#a1a1a6] hover:text-[#f2f2f2] hover:bg-[#18181a]"
            }`}
          >
            <Sparkles size={14} />
            <span>Long-Form ({longSlots.length}/{MAX_FEATURED_LONG_FORM})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="min-h-[44px] px-6 py-2.5 bg-[#f2f2f2] text-[#111113] hover:bg-white active:bg-zinc-300 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
        >
          {saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      {/* 4 Defined Slot Cards */}
      <div className="space-y-3">
        {Array.from({ length: maxSlots }).map((_, slotIdx) => {
          const project = currentSlots[slotIdx];
          const slotNumber = slotIdx + 1;

          return (
            <FeaturedSlotCard
              key={project ? project.id : `empty-${slotIdx}`}
              slotNumber={slotNumber}
              slotIndex={slotIdx}
              project={project}
              totalSlots={currentSlots.length}
              activeFormat={activeTab}
              onMove={handleMove}
              onRemove={handleRemove}
              onAssign={() => setPickerSlotIndex(slotIdx)}
            />
          );
        })}
      </div>

      {/* Candidate Picker Modal */}
      <FeaturedProjectPickerModal
        isOpen={pickerSlotIndex !== null}
        onClose={() => setPickerSlotIndex(null)}
        slotIndex={pickerSlotIndex}
        activeFormat={activeTab}
        candidateProjects={candidateProjects}
        onSelectProject={handleAssign}
      />
    </div>
  );
}
