import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isAuthorizedAdmin } from "@/lib/auth/guard";

/**
 * GET /api/auth/me
 * Returns the currently authenticated user profile and admin status.
 */
export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        isAdmin: false,
        user: null,
      });
    }

    const isAdmin = isAuthorizedAdmin(user.email);

    return NextResponse.json({
      authenticated: true,
      isAdmin,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name || null,
        picture: user.picture || null,
      },
    });
  } catch (err) {
    console.error("[Me API Error]", err);
    return NextResponse.json(
      {
        authenticated: false,
        isAdmin: false,
        user: null,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
