import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { getProjects } from "./getProjects";
import { PROJECT_FORMATS } from "@/lib/constants/limits";
import { SHOWCASE_SLOTS, SHOWCASE_SLOT_KEYS } from "@/lib/constants/showcase";

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
        slot1: null,
        slot2: null,
        slot3: null,
        slot4: null,
        slot5: null,
        carouselIds: [],
        topFive: [],
      };
    }

    const data = docSnap.data() || {};

    let carouselIds = Array.isArray(data.carouselIds) ? data.carouselIds : null;
    if (!carouselIds) {
      const rawSlots = [data.slot1, data.slot2, data.slot3, data.slot4, data.slot5]
        .concat(Array.isArray(data.topFive) ? data.topFive : [])
        .filter(Boolean);
      carouselIds = Array.from(new Set(rawSlots)).slice(0, 5);
    }

    return {
      slot1: carouselIds[0] || null,
      slot2: carouselIds[1] || null,
      slot3: carouselIds[2] || null,
      slot4: carouselIds[3] || null,
      slot5: carouselIds[4] || null,
      carouselIds,
      topFive: carouselIds,
      updatedAt: data.updatedAt || null,
    };
  } catch (err) {
    console.error("[Showcase Service] Failed to read showcase config:", err.message);
    throw new Error(`Failed to read showcase configuration from Firestore: ${err.message}`);
  }
}

/**
 * Resolves the 5 carousel slots using the configuration and a pool of published projects.
 * Only projects explicitly in carouselIds are resolved. Unassigned slots remain empty.
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

  const carouselIds = Array.isArray(config.carouselIds)
    ? config.carouselIds
    : [config.slot1, config.slot2, config.slot3, config.slot4, config.slot5].filter(Boolean);

  const slotDetails = {};
  const slotKeys = ["slot1", "slot2", "slot3", "slot4", "slot5"];

  slotKeys.forEach((slotKey, idx) => {
    const assignedId = carouselIds[idx] || null;
    const slotDef = SHOWCASE_SLOTS[slotKey] || {
      key: slotKey,
      slotNumber: idx + 1,
      label: `SLOT ${idx + 1}`,
      format: PROJECT_FORMATS.LONG_FORM,
    };

    if (assignedId) {
      const project = projectMap.get(assignedId);
      if (!project || project.status !== "published") {
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
      // Clean empty slot — never resurrect unwanted projects automatically!
      slotDetails[slotKey] = {
        slotKey,
        slotNumber: slotDef.slotNumber,
        label: slotDef.label,
        requiredFormat: slotDef.format,
        mode: "empty",
        isMissing: false,
        missingId: null,
        project: null,
      };
    }
  });

  const topProjects = [
    slotDetails.slot1?.project,
    slotDetails.slot2?.project,
    slotDetails.slot3?.project,
    slotDetails.slot4?.project,
    slotDetails.slot5?.project,
  ].filter(Boolean);

  return {
    topProjects,
    topFive: topProjects,
    carouselIds,
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
 * @param {string} params.slotKey - "slot1" | "slot2" | "slot3" | "slot4" | "slot5"
 * @param {string|null} params.projectId - ID of project or null to clear
 * @returns {Promise<Object>} Updated config
 */
export async function updateFeaturedShowcaseSlot({ slotKey, projectId }) {
  if (!adminDb) {
    throw new Error("[Showcase Service] Cloud Firestore Admin SDK is not configured.");
  }

  const config = await getFeaturedShowcaseConfig();
  let list = [...(config.carouselIds || [])];

  const slotNumber = parseInt(slotKey.replace("slot", ""), 10);
  const slotIndex = isNaN(slotNumber) ? 0 : slotNumber - 1;

  if (projectId) {
    // Remove if already in another slot to avoid duplicates
    list = list.filter((id) => id !== projectId);
    while (list.length < slotIndex) {
      list.push(null);
    }
    list[slotIndex] = projectId;
    list = list.filter(Boolean).slice(0, 5);
  } else {
    // Clear slot
    if (slotIndex < list.length) {
      list.splice(slotIndex, 1);
    }
  }

  const docRef = adminDb.collection("content").doc("featured-showcase");
  const updateData = {
    carouselIds: list,
    topFive: list,
    slot1: list[0] || null,
    slot2: list[1] || null,
    slot3: list[2] || null,
    slot4: list[3] || null,
    slot5: list[4] || null,
    spotlight: list[0] || null,
    secondaryLongForm: list[1] || null,
    shortOne: list[2] || null,
    shortTwo: list[3] || null,
    tertiaryLongForm: list[4] || null,
    updatedAt: new Date().toISOString(),
  };

  await docRef.set(updateData);

  return await getFeaturedShowcaseConfig();
}

/**
 * Toggles a long-form project in the cinema carousel.
 * If already assigned to any slot (1-5), it is removed.
 * If not in any slot, it is appended to carouselIds (up to 5).
 * 
 * @param {string} projectId
 * @returns {Promise<{ action: "added" | "removed", slotNumber: number | null, carouselIds: string[], config: Object }>}
 */
export async function toggleProjectInShowcase(projectId) {
  if (!adminDb) {
    throw new Error("[Showcase Service] Cloud Firestore Admin SDK is not configured.");
  }

  const config = await getFeaturedShowcaseConfig();
  let list = [...(config.carouselIds || [])];

  const existingIdx = list.indexOf(projectId);
  let action = "removed";
  let slotNumber = null;

  if (existingIdx !== -1) {
    // Remove from carousel
    list.splice(existingIdx, 1);
    action = "removed";
  } else {
    // Check maximum 5
    if (list.length >= 5) {
      throw new Error("Carousel already has maximum 5 films. Remove one first.");
    }
    // Validate project in Firestore
    const projectDoc = await adminDb.collection("projects").doc(projectId).get();
    if (!projectDoc.exists) {
      throw new Error(`Project "${projectId}" not found.`);
    }
    list.push(projectId);
    action = "added";
    slotNumber = list.length;
  }

  const docRef = adminDb.collection("content").doc("featured-showcase");
  const updateData = {
    carouselIds: list,
    topFive: list,
    slot1: list[0] || null,
    slot2: list[1] || null,
    slot3: list[2] || null,
    slot4: list[3] || null,
    slot5: list[4] || null,
    spotlight: list[0] || null,
    secondaryLongForm: list[1] || null,
    shortOne: list[2] || null,
    shortTwo: list[3] || null,
    tertiaryLongForm: list[4] || null,
    updatedAt: new Date().toISOString(),
  };

  await docRef.set(updateData);

  return {
    action,
    slotNumber,
    carouselIds: list,
    config: await getFeaturedShowcaseConfig(),
  };
}

/**
 * Updates the complete carousel order.
 * @param {string[]} carouselIds - Array of project IDs in desired order (max 5)
 * @returns {Promise<Object>}
 */
export async function setCarouselOrder(carouselIds = []) {
  if (!adminDb) {
    throw new Error("[Showcase Service] Cloud Firestore Admin SDK is not configured.");
  }

  const cleanIds = Array.isArray(carouselIds)
    ? Array.from(new Set(carouselIds.filter(Boolean))).slice(0, 5)
    : [];

  const docRef = adminDb.collection("content").doc("featured-showcase");
  const updateData = {
    carouselIds: cleanIds,
    topFive: cleanIds,
    slot1: cleanIds[0] || null,
    slot2: cleanIds[1] || null,
    slot3: cleanIds[2] || null,
    slot4: cleanIds[3] || null,
    slot5: cleanIds[4] || null,
    spotlight: cleanIds[0] || null,
    secondaryLongForm: cleanIds[1] || null,
    shortOne: cleanIds[2] || null,
    shortTwo: cleanIds[3] || null,
    tertiaryLongForm: cleanIds[4] || null,
    updatedAt: new Date().toISOString(),
  };

  await docRef.set(updateData);
  return await getFeaturedShowcaseConfig();
}

