import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { projectSchema } from "@/lib/validation/project.schema";
import {
  MAX_FEATURED_SHORT_FORM,
  MAX_FEATURED_LONG_FORM,
  PROJECT_FORMATS,
} from "@/lib/constants/limits";

/**
 * Creates a new project in Firestore.
 * 
 * @param {Object} projectData
 * @param {string} adminEmail
 * @returns {Promise<{ success: boolean, project: Object }>}
 */
export async function createProject(projectData, adminEmail) {
  if (!adminDb) {
    throw new Error("Firebase Admin DB is not configured on this server.");
  }

  // 1. Validate data schema
  const validated = projectSchema.parse(projectData);
  const docRef = adminDb.collection("projects").doc(validated.id);

  // 2. Check if ID exists
  const existing = await docRef.get();
  if (existing.exists) {
    throw new Error(`A project with ID '${validated.id}' already exists.`);
  }

  // 3. If featured is requested, verify slot availability
  if (validated.featured) {
    const maxAllowed =
      validated.format === PROJECT_FORMATS.SHORT_FORM
        ? MAX_FEATURED_SHORT_FORM
        : MAX_FEATURED_LONG_FORM;

    const currentFeatured = await adminDb
      .collection("projects")
      .where("format", "==", validated.format)
      .where("featured", "==", true)
      .get();

    if (currentFeatured.size >= maxAllowed) {
      throw new Error(
        `Cannot mark as featured: Maximum limit of ${maxAllowed} featured ${validated.format} projects has already been reached. Please unfeature an existing project first.`
      );
    }
  }

  const now = new Date().toISOString();
  const fullDocument = {
    ...validated,
    createdAt: now,
    updatedAt: now,
    createdBy: adminEmail || "admin",
    updatedBy: adminEmail || "admin",
  };

  await docRef.set(fullDocument);

  return {
    success: true,
    project: fullDocument,
  };
}
