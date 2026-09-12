import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

// Session duration: 5 days in milliseconds
export const SESSION_EXPIRES_IN = 5 * 24 * 60 * 60 * 1000;
export const SESSION_COOKIE_NAME = "__session";

/**
 * Creates a secure Firebase session cookie from an ID token
 * @param {string} idToken
 * @returns {Promise<string>}
 */
export async function createSessionCookie(idToken) {
  if (!adminAuth) {
    throw new Error("Firebase Admin Auth is not configured on the server.");
  }
  return await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRES_IN,
  });
}

/**
 * Verifies a Firebase session cookie and checks for token revocation
 * @param {string} sessionCookie
 * @returns {Promise<import("firebase-admin/auth").DecodedIdToken | null>}
 */
export async function verifySession(sessionCookie) {
  if (!adminAuth || !sessionCookie) return null;
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true // checkRevoked = true
    );
    return decodedClaims;
  } catch (err) {
    // Token is invalid, expired, or revoked
    return null;
  }
}

/**
 * Retrieves and verifies the session from the current request cookies
 * @returns {Promise<import("firebase-admin/auth").DecodedIdToken | null>}
 */
export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;
  return await verifySession(sessionCookie);
}

/**
 * Revokes all refresh tokens and active sessions for a user ID
 * @param {string} uid
 */
export async function revokeUserSessions(uid) {
  if (!adminAuth || !uid) return;
  try {
    await adminAuth.revokeRefreshTokens(uid);
  } catch (err) {
    console.error(`[Auth] Failed to revoke session for uid ${uid}:`, err.message);
  }
}
