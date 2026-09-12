import "server-only";
import { adminDb } from "@/lib/firebase/admin";

/**
 * Deletes a project from Firestore.
 * @param {string} id
 * @returns {Promise<{ success: boolean }>}
 */
export async function deleteProject(id) {
  if (!adminDb) {
    throw new Error("Firebase Admin DB is not configured on this server.");
  }

  if (!id) {
    throw new Error("Project ID is required.");
  }

  const docRef = adminDb.collection("projects").doc(id);
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error(`Project '${id}' does not exist.`);
  }

  await docRef.delete();

  return { success: true };
}
