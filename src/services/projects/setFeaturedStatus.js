import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import {
  MAX_FEATURED_SHORT_FORM,
  MAX_FEATURED_LONG_FORM,
  PROJECT_FORMATS,
} from "@/lib/constants/limits";
import { normalizeFormat } from "./getProjects";

/**
 * Toggles or sets the featured state of a project with atomic quota enforcement.
 * 
 * @param {string} projectId
 * @param {boolean} featured
 * @param {string} adminEmail
 * @returns {Promise<{ success: boolean, featured: boolean }>}
 */
export async function toggleProjectFeatured(projectId, featured, adminEmail) {
  if (!adminDb) {
    throw new Error("Firebase Admin DB is not configured on this server.");
  }

  return await adminDb.runTransaction(async (transaction) => {
    const docRef = adminDb.collection("projects").doc(projectId);
    const docSnap = await transaction.get(docRef);

    if (!docSnap.exists) {
      throw new Error(`Project '${projectId}' not found.`);
    }

    const data = docSnap.data();
    const format = normalizeFormat(data.format);
    const maxAllowed =
      format === PROJECT_FORMATS.SHORT_FORM
        ? MAX_FEATURED_SHORT_FORM
        : MAX_FEATURED_LONG_FORM;

    // If enabling featured, verify current featured count
    if (featured && !data.featured) {
      const currentFeaturedSnap = await adminDb
        .collection("projects")
        .where("format", "==", format)
        .where("featured", "==", true)
        .get();

      if (currentFeaturedSnap.size >= maxAllowed) {
        throw new Error(
          `Cannot feature project: Maximum limit of ${maxAllowed} featured ${format} projects reached. Unfeature another ${format} project first.`
        );
      }
    }

    const now = new Date().toISOString();
    transaction.update(docRef, {
      featured: Boolean(featured),
      featuredOrder: featured ? (data.featuredOrder ?? 99) : null,
      updatedAt: now,
      updatedBy: adminEmail || "admin",
    });

    return {
      success: true,
      featured: Boolean(featured),
      format,
    };
  });
}

/**
 * Reorders featured projects for a given format atomically.
 * 
 * @param {string} format - "short-form" | "long-form"
 * @param {string[]} orderedProjectIds - Array of up to 4 project IDs in order
 * @param {string} adminEmail
 * @returns {Promise<{ success: boolean, updatedCount: number }>}
 */
export async function reorderFeaturedProjects(format, orderedProjectIds, adminEmail) {
  if (!adminDb) {
    throw new Error("Firebase Admin DB is not configured on this server.");
  }

  const normalizedFormat = normalizeFormat(format);
  const maxAllowed =
    normalizedFormat === PROJECT_FORMATS.SHORT_FORM
      ? MAX_FEATURED_SHORT_FORM
      : MAX_FEATURED_LONG_FORM;

  if (orderedProjectIds.length > maxAllowed) {
    throw new Error(
      `Cannot feature more than ${maxAllowed} projects for ${normalizedFormat}. Received ${orderedProjectIds.length}.`
    );
  }

  return await adminDb.runTransaction(async (transaction) => {
    // 1. Fetch currently featured projects for this format
    const currentSnap = await adminDb
      .collection("projects")
      .where("format", "==", normalizedFormat)
      .where("featured", "==", true)
      .get();

    const now = new Date().toISOString();
    const targetSet = new Set(orderedProjectIds);

    // 2. Unfeature projects that are no longer in the ordered list
    for (const doc of currentSnap.docs) {
      if (!targetSet.has(doc.id)) {
        transaction.update(doc.ref, {
          featured: false,
          featuredOrder: null,
          updatedAt: now,
          updatedBy: adminEmail || "admin",
        });
      }
    }

    // 3. Set new order for projects in the list
    for (let index = 0; index < orderedProjectIds.length; index++) {
      const id = orderedProjectIds[index];
      const docRef = adminDb.collection("projects").doc(id);
      transaction.update(docRef, {
        featured: true,
        featuredOrder: index + 1,
        format: normalizedFormat,
        updatedAt: now,
        updatedBy: adminEmail || "admin",
      });
    }

    return {
      success: true,
      updatedCount: orderedProjectIds.length,
    };
  });
}
