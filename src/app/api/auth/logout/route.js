import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getSessionUser,
  revokeUserSessions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";

/**
 * POST /api/auth/logout
 * Revokes Firebase user sessions and deletes the HTTP-only session cookie.
 */
export async function POST() {
  try {
    const user = await getSessionUser();

    if (user?.uid) {
      // Revoke all refresh tokens for this user in Firebase Auth
      await revokeUserSessions(user.uid);
    }

    // Delete session cookie
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("[Logout Error]", err);
    // Still clear the cookie even if revocation fails
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);

    return NextResponse.json({
      success: true,
      message: "Session cookie cleared",
    });
  }
}
