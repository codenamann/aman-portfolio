import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createSessionCookie,
  verifySession,
  SESSION_COOKIE_NAME,
  SESSION_EXPIRES_IN,
} from "@/lib/auth/session";
import { isAuthorizedAdmin } from "@/lib/auth/guard";

/**
 * POST /api/auth/session
 * Body: { idToken: string }
 * Exchanges a Firebase Client ID token for an HTTP-only session cookie.
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { idToken } = body;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid idToken" },
        { status: 400 }
      );
    }

    // 1. Create session cookie
    const sessionCookie = await createSessionCookie(idToken);

    // 2. Verify claims
    const decodedClaims = await verifySession(sessionCookie);
    if (!decodedClaims) {
      return NextResponse.json(
        { success: false, error: "Failed to verify generated session" },
        { status: 401 }
      );
    }

    // 3. Check Admin Authorization
    const isAdmin = isAuthorizedAdmin(decodedClaims.email);
    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: `Access denied. Email '${decodedClaims.email}' is not in the authorized administrator list.`,
          code: "FORBIDDEN",
        },
        { status: 403 }
      );
    }

    // 4. Set HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      maxAge: Math.floor(SESSION_EXPIRES_IN / 1000), // seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        name: decodedClaims.name || null,
        picture: decodedClaims.picture || null,
        isAdmin: true,
      },
    });
  } catch (err) {
    console.error("[Session Route Error]", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal server error during session creation",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/session
 * Verifies the current session cookie
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    const decodedClaims = await verifySession(sessionCookie);
    if (!decodedClaims) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    const isAdmin = isAuthorizedAdmin(decodedClaims.email);

    return NextResponse.json({
      authenticated: true,
      isAdmin,
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        name: decodedClaims.name || null,
        picture: decodedClaims.picture || null,
      },
    });
  } catch (err) {
    console.error("[Session GET Error]", err);
    return NextResponse.json(
      { authenticated: false, error: err.message },
      { status: 500 }
    );
  }
}
