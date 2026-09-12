import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { normalizeProject } from "./getProjects";

/**
 * Retrieves a single project by ID or slug exclusively from Firestore.
 * ZERO-FALLBACK: Never falls back to static files.
 * 
 * @param {string} idOrSlug
 * @returns {Promise<Object | null>}
 */
export async function getProjectById(idOrSlug) {
  if (!idOrSlug) return null;

  if (!adminDb) {
    throw new Error(
      "[Projects Service] Cloud Firestore Admin SDK is not configured."
    );
  }

  try {
    // 1. Try document ID
    const docRef = adminDb.collection("projects").doc(idOrSlug);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return {
        ...normalizeProject(docSnap.data()),
        id: docSnap.id,
      };
    }

    // 2. Try query by slug / id field
    const querySnap = await adminDb
      .collection("projects")
      .where("id", "==", idOrSlug)
      .limit(1)
      .get();

    if (!querySnap.empty) {
      const found = querySnap.docs[0];
      return {
        ...normalizeProject(found.data()),
        id: found.id,
      };
    }

    return null;
  } catch (err) {
    console.error(`[Project Service] getProjectById failed: ${err.message}`);
    throw new Error(`Failed to fetch project '${idOrSlug}': ${err.message}`);
  }
}

