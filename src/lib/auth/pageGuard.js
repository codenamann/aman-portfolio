import "server-only";
import { redirect } from "next/navigation";
import { getSessionUser } from "./session";
import { isAuthorizedAdmin } from "./guard";

/**
 * Server-side Page Guard for Admin Pages.
 * Verifies that the user has an active session and is an authorized administrator.
 * If unauthorized, immediately redirects to /admin/login.
 * 
 * @returns {Promise<import("firebase-admin/auth").DecodedIdToken>}
 */
export async function requireAdminPageAuth() {
  const sessionUser = await getSessionUser();
  const isAdmin = sessionUser ? isAuthorizedAdmin(sessionUser.email) : false;

  if (!isAdmin) {
    redirect("/admin/login");
  }

  return sessionUser;
}
