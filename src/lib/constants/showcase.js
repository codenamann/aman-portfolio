import { PROJECT_FORMATS } from "./limits";

/**
 * 5 Canonical Showcase Slot Definitions for Projects Archive
 */
export const SHOWCASE_SLOTS = {
  spotlight: {
    key: "spotlight",
    slotNumber: 1,
    label: "SLOT 1 — SPOTLIGHT / HERO",
    format: PROJECT_FORMATS.LONG_FORM,
    description: "Primary Hero feature at the top of the Projects Archive.",
  },
  secondaryLongForm: {
    key: "secondaryLongForm",
    slotNumber: 2,
    label: "SLOT 2 — SECONDARY LONG-FORM",
    format: PROJECT_FORMATS.LONG_FORM,
    description: "Prominent landscape feature in the asymmetric duo row.",
  },
  shortOne: {
    key: "shortOne",
    slotNumber: 3,
    label: "SLOT 3 — SHORT-FORM #1",
    format: PROJECT_FORMATS.SHORT_FORM,
    description: "First vertical video card in the asymmetric duo row.",
  },
  shortTwo: {
    key: "shortTwo",
    slotNumber: 4,
    label: "SLOT 4 — SHORT-FORM #2",
    format: PROJECT_FORMATS.SHORT_FORM,
    description: "Second vertical video card in the asymmetric duo row.",
  },
  tertiaryLongForm: {
    key: "tertiaryLongForm",
    slotNumber: 5,
    label: "SLOT 5 — TERTIARY LONG-FORM",
    format: PROJECT_FORMATS.LONG_FORM,
    description: "Bottom landscape feature above the archives.",
  },
};

export const SHOWCASE_SLOT_KEYS = Object.keys(SHOWCASE_SLOTS);
