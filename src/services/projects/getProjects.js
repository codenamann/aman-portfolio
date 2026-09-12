import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { PROJECT_FORMATS } from "@/lib/constants/limits";

/**
 * Normalizes project format strings
 * @param {string} format
 * @returns {string}
 */
export function normalizeFormat(format) {
  if (format === "short" || format === "short-form") {
    return PROJECT_FORMATS.SHORT_FORM;
  }
  return PROJECT_FORMATS.LONG_FORM;
}

/**
 * Normalizes a project document from Firestore
 * @param {Object} item
 * @returns {Object}
 */
export function normalizeProject(item) {
  if (!item) return null;
  return {
    ...item,
    format: normalizeFormat(item.format),
    featured: Boolean(item.featured),
    spotlight: Boolean(item.spotlight),
    status: item.status || "published",
    tools: Array.isArray(item.tools) ? item.tools : [],
    deliverables: Array.isArray(item.deliverables) ? item.deliverables : [],
    tags: Array.isArray(item.tags) ? item.tags : [],
    stats: item.stats || {},
    links: {
      youtube: item.links?.youtube || item.videoUrl || item.url || "",
      instagram: item.links?.instagram || item.instagramUrl || "",
    },
  };
}

/**
 * Retrieves projects exclusively from Cloud Firestore.
 * ZERO-FALLBACK POLICY: Never falls back to static files.
 * 
 * - SUCCESS + records -> returns Array<Project>
 * - SUCCESS + 0 records -> returns [] (Empty state)
 * - FAILURE / UNCONFIGURED -> throws Error (Error state)
 *
 * @param {Object} options
 * @param {string} [options.format] - "short-form" | "long-form"
 * @param {string} [options.status] - "published" | "draft" | "archived"
 * @param {boolean} [options.featured]
 * @param {boolean} [options.spotlight]
 * @param {number} [options.limit]
 * @returns {Promise<Array<Object>>}
 */
export async function getProjects(options = {}) {
  const { format, status, featured, spotlight, limit } = options;

  if (!adminDb) {
    throw new Error(
      "[Projects Service] Cloud Firestore Admin SDK is not configured."
    );
  }

  try {
    let query = adminDb.collection("projects");

    if (status) {
      query = query.where("status", "==", status);
    }
    if (format) {
      query = query.where("format", "==", normalizeFormat(format));
    }
    if (typeof featured === "boolean") {
      query = query.where("featured", "==", featured);
    }
    if (typeof spotlight === "boolean") {
      query = query.where("spotlight", "==", spotlight);
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      return [];
    }

    let results = snapshot.docs.map((doc) => ({
      ...normalizeProject(doc.data()),
      id: doc.id,
    }));

    // Sort by featuredOrder, order, or updatedAt/createdAt
    results.sort((a, b) => {
      if (a.featuredOrder !== undefined && b.featuredOrder !== undefined) {
        if (a.featuredOrder !== null && b.featuredOrder !== null) {
          return a.featuredOrder - b.featuredOrder;
        }
      }
      if (a.order !== undefined && b.order !== undefined) {
        return (a.order || 0) - (b.order || 0);
      }
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    if (limit && limit > 0) {
      results = results.slice(0, limit);
    }

    return results;
  } catch (err) {
    console.error("[Projects Service] Firestore query failed:", err.message);
    throw new Error(`Failed to query projects from Firestore: ${err.message}`);
  }
}

