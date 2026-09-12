import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/guard";
import { fetchYouTubeMetadata } from "@/services/youtube/fetchMetadata";
import { normalizeYouTubeMetadata } from "@/services/youtube/normalizeMetadata";

/**
 * POST /api/youtube/ingest
 * Body: { url: string }
 * Protected: Admin only.
 * Ingests YouTube metadata, normalizes it into a standard project payload, and returns it.
 */
export async function POST(request) {
  try {
    const { errorResponse, user } = await requireAdminAuth();
    if (errorResponse) return errorResponse;

    const body = await request.json().catch(() => ({}));
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'url' parameter" },
        { status: 400 }
      );
    }

    const fetched = await fetchYouTubeMetadata(url);
    const project = normalizeYouTubeMetadata(fetched);

    return NextResponse.json({
      success: true,
      project,
      source: fetched.source,
      isPartialMetadata: fetched.isPartialMetadata,
      unavailableFields: fetched.unavailableFields,
      warningMessage: fetched.warningMessage || null,
      adminUser: { email: user.email },
    });
  } catch (err) {
    console.error("[YouTube Ingestion Route Error]", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to ingest YouTube video",
      },
      { status: 400 }
    );
  }
}
