import "server-only";
import { getSessionUser } from "./session";
import { NextResponse } from "next/server";

/**
 * Returns the list of authorized admin emails from environment variables.
 * Supports comma-separated emails in ADMIN_EMAILS or single ADMIN_EMAIL.
 * @returns {string[]}
 */
export function getAdminEmails() {
  const envList =
    process.env.ADMIN_EMAILS ||
    process.env.ADMIN_EMAIL ||
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
    "";

  return envList
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Checks if a given email is in the authorized admin list.
 * @param {string | null | undefined} email
 * @returns {boolean}
 */
export function isAuthorizedAdmin(email) {
  if (!email) return false;
  const adminEmails = getAdminEmails();
  // If no admin emails are configured in development, allow any verified Firebase user for initial setup
  if (adminEmails.length === 0 && process.env.NODE_ENV === "development") {
    console.warn(
      "[Auth Guard] No ADMIN_EMAILS configured in environment. In development mode, allowing authenticated user."
    );
    return true;
  }
  return adminEmails.includes(email.trim().toLowerCase());
}

/**
 * Guard for Route Handlers and Server Actions.
 * Validates the session cookie and verifies that the user is an authorized admin.
 * 
 * @returns {Promise<{ user: import("firebase-admin/auth").DecodedIdToken, errorResponse: NextResponse | null }>}
 */
export async function requireAdminAuth() {
  const user = await getSessionUser();

  if (!user) {
    return {
      errorResponse: NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Missing or invalid session. Please sign in.",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      ),
      user: null,
    };
  }

  if (!isAuthorizedAdmin(user.email)) {
    return {
      errorResponse: NextResponse.json(
        {
          success: false,
          error: `Forbidden: Email '${user.email}' is not authorized as an administrator.`,
          code: "FORBIDDEN",
        },
        { status: 403 }
      ),
      user: null,
    };
  }

  return { errorResponse: null, user };
}
