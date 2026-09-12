import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { CONTENT_SECTIONS } from "@/lib/constants/limits";
import {
  MASTER_FALLBACK_ENABLED,
  CONTENT_FALLBACK_CONFIG,
} from "@/lib/config/fallbackPolicy";

/**
 * Retrieves content for a section from Firestore singleton doc `content/{sectionId}`.
 * Controlled fallback behavior:
 * - If Firestore document exists: returns Firestore data (_source: "firestore").
 * - If Firestore document is missing / unreachable:
 *   - If forceNoFallback is true (Admin CMS callers): returns null.
 *   - If MASTER_FALLBACK_ENABLED is false: returns null (_source: "empty").
 *   - If MASTER_FALLBACK_ENABLED is true AND section fallback enabled: returns exact local fallback data (_source: "fallback").
 * 
 * @param {string} sectionId - Key from CONTENT_SECTIONS
 * @param {Object} [options]
 * @param {boolean} [options.forceNoFallback] - Set to true for Admin CMS to disable fallbacks
 * @returns {Promise<Object | null>}
 */
export async function getContent(sectionId, { forceNoFallback = false } = {}) {
  if (!sectionId) return null;

  // 1. Attempt Firestore read
  if (adminDb) {
    try {
      const docRef = adminDb.collection("content").doc(sectionId);
      const snap = await docRef.get();

      if (snap.exists) {
        return {
          ...snap.data(),
          _source: "firestore",
          _id: snap.id,
        };
      }
    } catch (err) {
      console.warn(
        `[Content Service] Failed to fetch '${sectionId}' from Firestore (${err.message}).`
      );
      if (forceNoFallback) {
        throw new Error(`Failed to fetch content section '${sectionId}': ${err.message}`);
      }
    }
  }

  // 2. Admin CMS callers never receive fallback
  if (forceNoFallback) {
    return null;
  }

  // 3. Local Master Fallback Gate: If disabled, NO fallback is permitted
  if (!MASTER_FALLBACK_ENABLED) {
    return null;
  }

  // 4. Section-level fallback policy
  const config = CONTENT_FALLBACK_CONFIG[sectionId];
  if (config && config.enabled && config.data) {
    return {
      ...config.data,
      _source: "fallback",
      _id: sectionId,
    };
  }

  return null;
}

/**
 * Retrieves all content sections in a single combined object.
 * @param {Object} [options]
 * @param {boolean} [options.forceNoFallback]
 * @returns {Promise<Record<string, any>>}
 */
export async function getAllContent(options = {}) {
  const sections = Object.values(CONTENT_SECTIONS);
  const results = await Promise.all(
    sections.map(async (sec) => {
      const data = await getContent(sec, options);
      return [sec, data];
    })
  );

  return Object.fromEntries(results);
}
