import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/auth/guard";
import {
  getFeaturedShowcase,
  getFeaturedShowcaseConfig,
  updateFeaturedShowcaseSlot,
} from "@/services/projects/getFeaturedShowcase";
import { SHOWCASE_SLOT_KEYS } from "@/lib/constants/showcase";

/**
 * GET /api/admin/showcase
 * Returns current showcase configuration and resolved 5-slot state.
 */
export async function GET() {
  try {
    const { errorResponse } = await requireAdminAuth();
    if (errorResponse) return errorResponse;

    const showcase = await getFeaturedShowcase();

    return NextResponse.json({
      success: true,
      showcase,
    });
  } catch (err) {
    console.error("[Admin Showcase GET Error]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/showcase
 * Body: { slotKey: string, projectId: string | null }
 * Updates a specific slot in content/featured-showcase
 */
export async function PUT(request) {
  try {
    const { errorResponse } = await requireAdminAuth();
    if (errorResponse) return errorResponse;

    const body = await request.json().catch(() => ({}));
    const { slotKey, projectId } = body;

    if (!slotKey || !SHOWCASE_SLOT_KEYS.includes(slotKey)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid slot key. Must be one of: ${SHOWCASE_SLOT_KEYS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updatedConfig = await updateFeaturedShowcaseSlot({
      slotKey,
      projectId: projectId || null,
    });

    // Invalidate Projects Archive cache
    try {
      revalidatePath("/projects");
      revalidatePath("/admin/showcase");
    } catch (revalidateErr) {
      console.warn("[Admin Showcase] Revalidation notice:", revalidateErr.message);
    }

    const resolvedShowcase = await getFeaturedShowcase();

    return NextResponse.json({
      success: true,
      message: projectId
        ? `Slot "${slotKey}" manually updated.`
        : `Slot "${slotKey}" reset to automatic.`,
      config: updatedConfig,
      showcase: resolvedShowcase,
    });
  } catch (err) {
    console.error("[Admin Showcase PUT Error]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
