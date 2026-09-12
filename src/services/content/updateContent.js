import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { validateContentSection } from "@/lib/validation/content.schema";
import { SUPPORTED_CONTENT_SECTIONS } from "@/lib/constants/limits";

/**
 * Updates or creates a content section document in Firestore `content/{sectionId}`.
 * 
 * @param {string} sectionId
 * @param {Object} contentData
 * @param {string} adminEmail
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function updateContent(sectionId, contentData, adminEmail) {
  if (!adminDb) {
    throw new Error("Firebase Admin DB is not configured on this server.");
  }

  if (!sectionId || !SUPPORTED_CONTENT_SECTIONS.includes(sectionId)) {
    throw new Error(
      `Invalid content section '${sectionId}'. Must be one of: ${SUPPORTED_CONTENT_SECTIONS.join(
        ", "
      )}`
    );
  }

  // Validate payload
  const validated = validateContentSection(sectionId, contentData);

  const now = new Date().toISOString();
  // Remove meta flags
  const { _source, _id, ...cleanData } = validated;

  const docRef = adminDb.collection("content").doc(sectionId);
  const finalPayload = {
    ...cleanData,
    updatedAt: now,
    updatedBy: adminEmail || "admin",
  };

  await docRef.set(finalPayload, { merge: true });

  return {
    success: true,
    data: finalPayload,
  };
}
