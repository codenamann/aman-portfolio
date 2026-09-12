import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { projectUpdateSchema } from "@/lib/validation/project.schema";
import {
  MAX_FEATURED_SHORT_FORM,
  MAX_FEATURED_LONG_FORM,
  PROJECT_FORMATS,
} from "@/lib/constants/limits";

/**
 * Updates an existing project in Firestore.
 * 
 * @param {string} id
 * @param {Object} updateData
 * @param {string} adminEmail
 * @returns {Promise<{ success: boolean, project: Object }>}
 */
export async function updateProject(id, updateData, adminEmail) {
  if (!adminDb) {
    throw new Error("Firebase Admin DB is not configured on this server.");
  }

  if (!id) {
    throw new Error("Project ID is required for update.");
  }

  const docRef = adminDb.collection("projects").doc(id);
  const existing = await docRef.get();

  if (!existing.exists) {
    throw new Error(`Project with ID '${id}' not found.`);
  }

  const existingData = existing.data();
  const merged = { ...existingData, ...updateData, id };
  const validated = projectUpdateSchema.parse(merged);

  // If toggled from false to true, check limit
  if (validated.featured && !existingData.featured) {
    const format = validated.format || existingData.format;
    const maxAllowed =
      format === PROJECT_FORMATS.SHORT_FORM
        ? MAX_FEATURED_SHORT_FORM
        : MAX_FEATURED_LONG_FORM;

    const currentFeatured = await adminDb
      .collection("projects")
      .where("format", "==", format)
      .where("featured", "==", true)
      .get();

    if (currentFeatured.size >= maxAllowed) {
      throw new Error(
        `Cannot mark as featured: Maximum limit of ${maxAllowed} featured ${format} projects has already been reached.`
      );
    }
  }

  const now = new Date().toISOString();
  const finalDoc = {
    ...validated,
    updatedAt: now,
    updatedBy: adminEmail || "admin",
  };

  await docRef.set(finalDoc, { merge: true });

  return {
    success: true,
    project: finalDoc,
  };
}
