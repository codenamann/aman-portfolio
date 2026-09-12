import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getClientApp() {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return null;
  }
  if (getApps().length > 0) {
    return getApp();
  }
  try {
    return initializeApp(firebaseConfig);
  } catch (err) {
    console.warn("[Firebase Client] App initialization skipped:", err.message);
    return null;
  }
}

export const app = getClientApp();
export const auth = app ? getAuth(app) : null;

export function isFirebaseClientConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}
