import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { getProjects, normalizeProject } from "./getProjects";
import { PROJECT_FORMATS } from "@/lib/constants/limits";

import { SHOWCASE_SLOTS, SHOWCASE_SLOT_KEYS } from "@/lib/constants/showcase";

/**
 * Helper to safely extract milliseconds timestamp from createdAt
 */
function getTimestamp(val) {
  if (!val) return 0;
  if (typeof val.toDate === "function") return val.toDate().getTime();
  if (typeof val._seconds === "number") return val._seconds * 1000;
  if (val instanceof Date) return val.getTime();
  const parsed = new Date(val).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Retrieves the raw showcase configuration document from Firestore: content/featured-showcase
 * @returns {Promise<Object>}
 */
export async function getFeaturedShowcaseConfig() {
  if (!adminDb) {
    throw new Error("[Showcase Service] Cloud Firestore Admin SDK is not configured.");
  }

  try {
    const docRef = adminDb.collection("content").doc("featured-showcase");
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return {
        spotlight: null,
        secondaryLongForm: null,
        shortOne: null,
        shortTwo: null,
        tertiaryLongForm: null,
      };
    }

    const data = docSnap.data() || {};
    return {
      spotlight: data.spotlight || null,
      secondaryLongForm: data.secondaryLongForm || null,
      shortOne: data.shortOne || null,
      shortTwo: data.shortTwo || null,
      tertiaryLongForm: data.tertiaryLongForm || null,
      updatedAt: data.updatedAt || null,
    };
  } catch (err) {
    console.error("[Showcase Service] Failed to read showcase config:", err.message);
    throw new Error(`Failed to read showcase configuration from Firestore: ${err.message}`);
  }
}

/**
 * Resolves the 5 showcase slots using the configuration and a pool of published projects.
 *
 * RULES:
 * 1. Manual selections are assigned first.
 *    - If project exists and matches slot format, it is assigned (mode: 'manual') and its ID is marked as used.
 *    - If missing or deleted, marked as isMissing: true (mode: 'manual', project: null). NEVER silently replaced.
 * 2. Unassigned / automatic slots are resolved independently by format:
 *    - Long-form slots in order: Slot 1 (spotlight) -> Slot 2 (secondaryLongForm) -> Slot 5 (tertiaryLongForm)
 *    - Short-form slots in order: Slot 3 (shortOne) -> Slot 4 (shortTwo)
 *    - Sorted strictly by createdAt descending (newest first).
 *    - Excludes any already used project IDs (manual or previous automatic).
 *    - If no eligible projects left, slot resolves to null (empty, never duplicated).
 *
 * @param {Array<Object>} allProjects
 * @param {Object} config
 * @returns {Object}
 */
export function resolveFeaturedShowcase(allProjects = [], config = {}) {
  const projectMap = new Map();
  allProjects.forEach((p) => {
    if (p && p.id) {
      projectMap.set(p.id, p);
    }
  });

  // Filter published projects by format and sort strictly by createdAt descending
  const longFormPool = allProjects
    .filter((p) => p.status === "published" && p.format === PROJECT_FORMATS.LONG_FORM)
    .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));

  const shortFormPool = allProjects
    .filter((p) => p.status === "published" && p.format === PROJECT_FORMATS.SHORT_FORM)
    .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));

  const usedProjectIds = new Set();
  const slotDetails = {};

  // Step 1: Pre-process manual selections to register all valid manual IDs in usedProjectIds
  SHOWCASE_SLOT_KEYS.forEach((slotKey) => {
    const assignedId = config[slotKey];
    const slotDef = SHOWCASE_SLOTS[slotKey];

    if (assignedId) {
      const project = projectMap.get(assignedId);
      if (project && project.format === slotDef.format && project.status === "published") {
        usedProjectIds.add(assignedId);
      }
    }
  });

  // Step 2: Resolve Long-Form slots in priority order: spotlight (1) -> secondaryLongForm (2) -> tertiaryLongForm (5)
  const longFormSlotKeys = ["spotlight", "secondaryLongForm", "tertiaryLongForm"];
  longFormSlotKeys.forEach((slotKey) => {
    const assignedId = config[slotKey];
    const slotDef = SHOWCASE_SLOTS[slotKey];

    if (assignedId) {
      // Manual mode
      const project = projectMap.get(assignedId);
      if (!project || project.format !== slotDef.format || project.status !== "published") {
        slotDetails[slotKey] = {
          slotKey,
          slotNumber: slotDef.slotNumber,
          label: slotDef.label,
          requiredFormat: slotDef.format,
          mode: "manual",
          isMissing: true,
          missingId: assignedId,
          project: null,
        };
      } else {
        slotDetails[slotKey] = {
          slotKey,
          slotNumber: slotDef.slotNumber,
          label: slotDef.label,
          requiredFormat: slotDef.format,
          mode: "manual",
          isMissing: false,
          missingId: null,
          project,
        };
      }
    } else {
      // Automatic mode: Pick newest unused long-form project
      const autoProject = longFormPool.find((p) => !usedProjectIds.has(p.id)) || null;
      if (autoProject) {
        usedProjectIds.add(autoProject.id);
      }
      slotDetails[slotKey] = {
        slotKey,
        slotNumber: slotDef.slotNumber,
        label: slotDef.label,
        requiredFormat: slotDef.format,
        mode: "automatic",
        isMissing: false,
        missingId: null,
        project: autoProject,
      };
    }
  });

  // Step 3: Resolve Short-Form slots in priority order: shortOne (3) -> shortTwo (4)
  const shortFormSlotKeys = ["shortOne", "shortTwo"];
  shortFormSlotKeys.forEach((slotKey) => {
    const assignedId = config[slotKey];
    const slotDef = SHOWCASE_SLOTS[slotKey];

    if (assignedId) {
      // Manual mode
      const project = projectMap.get(assignedId);
      if (!project || project.format !== slotDef.format || project.status !== "published") {
        slotDetails[slotKey] = {
          slotKey,
          slotNumber: slotDef.slotNumber,
          label: slotDef.label,
          requiredFormat: slotDef.format,
          mode: "manual",
          isMissing: true,
          missingId: assignedId,
          project: null,
        };
      } else {
        slotDetails[slotKey] = {
          slotKey,
          slotNumber: slotDef.slotNumber,
          label: slotDef.label,
          requiredFormat: slotDef.format,
          mode: "manual",
          isMissing: false,
          missingId: null,
          project,
        };
      }
    } else {
      // Automatic mode: Pick newest unused short-form project
      const autoProject = shortFormPool.find((p) => !usedProjectIds.has(p.id)) || null;
      if (autoProject) {
        usedProjectIds.add(autoProject.id);
      }
      slotDetails[slotKey] = {
        slotKey,
        slotNumber: slotDef.slotNumber,
        label: slotDef.label,
        requiredFormat: slotDef.format,
        mode: "automatic",
        isMissing: false,
        missingId: null,
        project: autoProject,
      };
    }
  });

  const spotlight = slotDetails.spotlight.project;
  const secondaryLongForm = slotDetails.secondaryLongForm.project;
  const shortOne = slotDetails.shortOne.project;
  const shortTwo = slotDetails.shortTwo.project;
  const tertiaryLongForm = slotDetails.tertiaryLongForm.project;

  return {
    spotlight,
    secondaryLongForm,
    shortOne,
    shortTwo,
    tertiaryLongForm,
    shorts: [shortOne, shortTwo].filter(Boolean),
    rawConfig: config,
    slotDetails,
  };
}

/**
 * Server fetcher: Reads showcase config & projects from Firestore, returns resolved showcase.
 * @returns {Promise<Object>}
 */
export async function getFeaturedShowcase() {
  const [projects, config] = await Promise.all([
    getProjects(),
    getFeaturedShowcaseConfig(),
  ]);

  return resolveFeaturedShowcase(projects, config);
}

/**
 * Updates a single slot in the showcase configuration.
 * @param {Object} params
 * @param {string} params.slotKey - "spotlight" | "secondaryLongForm" | "shortOne" | "shortTwo" | "tertiaryLongForm"
 * @param {string|null} params.projectId - ID of project or null for automatic
 * @returns {Promise<Object>} Updated config
 */
export async function updateFeaturedShowcaseSlot({ slotKey, projectId }) {
  if (!adminDb) {
    throw new Error("[Showcase Service] Cloud Firestore Admin SDK is not configured.");
  }

  if (!SHOWCASE_SLOTS[slotKey]) {
    throw new Error(`[Showcase Service] Invalid slot key: ${slotKey}`);
  }

  const slotDef = SHOWCASE_SLOTS[slotKey];

  // If assigning a project, validate that it exists and matches required format
  if (projectId) {
    const projectDoc = await adminDb.collection("projects").doc(projectId).get();
    if (!projectDoc.exists) {
      throw new Error(`[Showcase Service] Project "${projectId}" does not exist in Firestore.`);
    }
    const projectData = normalizeProject(projectDoc.data());
    if (projectData.format !== slotDef.format) {
      throw new Error(
        `[Showcase Service] Format mismatch: Slot "${slotDef.label}" requires "${slotDef.format}", but project "${projectData.title}" is "${projectData.format}".`
      );
    }
  }

  const docRef = adminDb.collection("content").doc("featured-showcase");

  const updateData = {
    [slotKey]: projectId || null,
    updatedAt: new Date().toISOString(),
  };

  await docRef.set(updateData, { merge: true });

  return await getFeaturedShowcaseConfig();
}
