import "server-only";
import { getApps, getApp, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function formatPrivateKey(key) {
  if (!key) return undefined;
  let formatted = key.trim();
  // Strip surrounding quotes if wrapped in single or double quotes
  if (
    (formatted.startsWith('"') && formatted.endsWith('"')) ||
    (formatted.startsWith("'") && formatted.endsWith("'"))
  ) {
    formatted = formatted.slice(1, -1);
  }
  return formatted.replace(/\\n/g, "\n");
}

function initializeAdmin() {
  const apps = getApps();
  if (apps.length > 0) {
    return getApp();
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = formatPrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY);

  if (projectId && clientEmail && privateKey) {
    try {
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        projectId,
      });
    } catch (err) {
      console.error("[Firebase Admin] Initialization failed with credentials:", err.message);
    }
  }

  return null;
}

const adminApp = initializeAdmin();

export const adminDb = adminApp ? getFirestore(adminApp) : null;
export const adminAuth = adminApp ? getAuth(adminApp) : null;

export function isFirebaseAdminConfigured() {
  return Boolean(
    adminDb &&
    adminAuth &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
}
