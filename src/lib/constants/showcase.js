import { PROJECT_FORMATS } from "./limits";

/**
 * 5 Canonical Showcase Slot Definitions for Projects Archive
 * Represents the 5 Top Selected Films displayed in the full-width cinematic movie carousel.
 */
export const SHOWCASE_SLOTS = {
  slot1: {
    key: "slot1",
    slotNumber: 1,
    label: "SLOT 1 — FEATURED FILM #1",
    format: PROJECT_FORMATS.LONG_FORM,
    description: "First slide in the full-width cinematic movie carousel.",
    aliases: ["spotlight"],
  },
  slot2: {
    key: "slot2",
    slotNumber: 2,
    label: "SLOT 2 — FEATURED FILM #2",
    format: PROJECT_FORMATS.LONG_FORM,
    description: "Second slide in the full-width cinematic movie carousel.",
    aliases: ["secondaryLongForm"],
  },
  slot3: {
    key: "slot3",
    slotNumber: 3,
    label: "SLOT 3 — FEATURED FILM #3",
    format: PROJECT_FORMATS.LONG_FORM,
    description: "Third slide in the full-width cinematic movie carousel.",
    aliases: ["shortOne"],
  },
  slot4: {
    key: "slot4",
    slotNumber: 4,
    label: "SLOT 4 — FEATURED FILM #4",
    format: PROJECT_FORMATS.LONG_FORM,
    description: "Fourth slide in the full-width cinematic movie carousel.",
    aliases: ["shortTwo"],
  },
  slot5: {
    key: "slot5",
    slotNumber: 5,
    label: "SLOT 5 — FEATURED FILM #5",
    format: PROJECT_FORMATS.LONG_FORM,
    description: "Fifth slide in the full-width cinematic movie carousel.",
    aliases: ["tertiaryLongForm"],
  },
};

export const SHOWCASE_SLOT_KEYS = Object.keys(SHOWCASE_SLOTS);

