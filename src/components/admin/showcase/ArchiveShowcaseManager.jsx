"use client";

import { useState } from "react";
import { useAdminToast } from "@/components/admin/ui/AdminToastProvider";
import ShowcaseSlotItem from "./ShowcaseSlotItem";
import ShowcaseProjectPickerModal from "./ShowcaseProjectPickerModal";
import { SHOWCASE_SLOTS } from "@/lib/constants/showcase";

/**
 * Editorial Projects Archive 5-Slot Showcase Manager Orchestrator
 */
export default function ArchiveShowcaseManager({
  initialShowcase,
  allProjects = [],
}) {
  const toast = useAdminToast();
  const [showcase, setShowcase] = useState(initialShowcase);
  const [activeSlotKey, setActiveSlotKey] = useState(null);
  const [updatingSlot, setUpdatingSlot] = useState(null);

  const slotDetails = showcase?.slotDetails || {};

  const handleUpdateSlot = async (slotKey, projectId) => {
    setUpdatingSlot(slotKey);

    try {
      const res = await fetch("/api/admin/showcase", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotKey, projectId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update slot.");
      }

      setShowcase(data.showcase);
      toast.success(data.message || "Showcase slot updated.");
      setActiveSlotKey(null);
    } catch (err) {
      toast.error(err.message || "An error occurred while updating slot.");
    } finally {
      setUpdatingSlot(null);
    }
  };

  const activeSlotDef = activeSlotKey ? SHOWCASE_SLOTS[activeSlotKey] : null;

  return (
    <div className="space-y-8 max-w-6xl min-w-0">
      {/* 5-Slot Editorial Showcase Layout */}
      <div className="space-y-8">
        {/* 1. Spotlight / Hero Row */}
        <div>
          <ShowcaseSlotItem
            slotKey="spotlight"
            slotData={slotDetails.spotlight}
            slotDef={SHOWCASE_SLOTS.spotlight}
            aspectRatio="aspect-[21/9] sm:aspect-[16/7]"
            isSpotlight={true}
            onChoose={() => setActiveSlotKey("spotlight")}
            onReset={() => handleUpdateSlot("spotlight", null)}
            isUpdating={updatingSlot === "spotlight"}
          />
        </div>

        {/* 2. Asymmetric Duo Row (Secondary Long-Form + 2 Shorts) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Secondary Long-Form (7 Columns) */}
          <div className="lg:col-span-7">
            <ShowcaseSlotItem
              slotKey="secondaryLongForm"
              slotData={slotDetails.secondaryLongForm}
              slotDef={SHOWCASE_SLOTS.secondaryLongForm}
              aspectRatio="aspect-[16/10]"
              onChoose={() => setActiveSlotKey("secondaryLongForm")}
              onReset={() => handleUpdateSlot("secondaryLongForm", null)}
              isUpdating={updatingSlot === "secondaryLongForm"}
            />
          </div>

          {/* Short-Form Pair (5 Columns, 2 Columns internally) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <ShowcaseSlotItem
              slotKey="shortOne"
              slotData={slotDetails.shortOne}
              slotDef={SHOWCASE_SLOTS.shortOne}
              aspectRatio="aspect-[9/16]"
              onChoose={() => setActiveSlotKey("shortOne")}
              onReset={() => handleUpdateSlot("shortOne", null)}
              isUpdating={updatingSlot === "shortOne"}
            />
            <ShowcaseSlotItem
              slotKey="shortTwo"
              slotData={slotDetails.shortTwo}
              slotDef={SHOWCASE_SLOTS.shortTwo}
              aspectRatio="aspect-[9/16]"
              onChoose={() => setActiveSlotKey("shortTwo")}
              onReset={() => handleUpdateSlot("shortTwo", null)}
              isUpdating={updatingSlot === "shortTwo"}
            />
          </div>
        </div>

        {/* 3. Tertiary Long-Form Row */}
        <div>
          <ShowcaseSlotItem
            slotKey="tertiaryLongForm"
            slotData={slotDetails.tertiaryLongForm}
            slotDef={SHOWCASE_SLOTS.tertiaryLongForm}
            aspectRatio="aspect-[16/8] sm:aspect-[16/7]"
            onChoose={() => setActiveSlotKey("tertiaryLongForm")}
            onReset={() => handleUpdateSlot("tertiaryLongForm", null)}
            isUpdating={updatingSlot === "tertiaryLongForm"}
          />
        </div>
      </div>

      {/* Project Selection Modal */}
      <ShowcaseProjectPickerModal
        isOpen={Boolean(activeSlotKey)}
        onClose={() => setActiveSlotKey(null)}
        slotKey={activeSlotKey}
        slotDef={activeSlotDef}
        slotDetails={slotDetails}
        candidateProjects={allProjects}
        onSelectProject={handleUpdateSlot}
        updating={Boolean(updatingSlot)}
      />
    </div>
  );
}
