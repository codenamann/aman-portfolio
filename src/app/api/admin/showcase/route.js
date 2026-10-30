import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/auth/guard";
import {
  getFeaturedShowcase,
  getFeaturedShowcaseConfig,
  updateFeaturedShowcaseSlot,
  toggleProjectInShowcase,
  setCarouselOrder,
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
 * Body: { slotKey: string, projectId: string | null } OR { action: "reorder", carouselIds: string[] }
 */
export async function PUT(request) {
  try {
    const { errorResponse } = await requireAdminAuth();
    if (errorResponse) return errorResponse;

    const body = await request.json().catch(() => ({}));
    const { slotKey, projectId, action, carouselIds } = body;

    // Action 1: Reorder full carousel list
    if (action === "reorder" && Array.isArray(carouselIds)) {
      await setCarouselOrder(carouselIds);

      try {
        revalidatePath("/projects");
        revalidatePath("/admin/projects");
      } catch (e) {}

      const resolvedShowcase = await getFeaturedShowcase();

      return NextResponse.json({
        success: true,
        message: "Carousel order updated.",
        carouselIds,
        showcase: resolvedShowcase,
      });
    }

    // Action 2: Add project to carousel
    if (action === "add" && projectId) {
      const config = await getFeaturedShowcaseConfig();
      const currentList = config.carouselIds || [];

      if (!currentList.includes(projectId)) {
        if (currentList.length >= 5) {
          return NextResponse.json(
            { success: false, error: "Maximum 5 films allowed in the cinema carousel." },
            { status: 400 }
          );
        }
        const updatedList = [...currentList, projectId];
        await setCarouselOrder(updatedList);
      }

      try {
        revalidatePath("/projects");
        revalidatePath("/admin/projects");
      } catch (e) {}

      const resolvedShowcase = await getFeaturedShowcase();
      return NextResponse.json({
        success: true,
        message: "Project added to carousel.",
        showcase: resolvedShowcase,
      });
    }

    // Action 3: Remove project from carousel
    if (action === "remove" && projectId) {
      const config = await getFeaturedShowcaseConfig();
      const currentList = config.carouselIds || [];
      const updatedList = currentList.filter((id) => id !== projectId);
      await setCarouselOrder(updatedList);

      try {
        revalidatePath("/projects");
        revalidatePath("/admin/projects");
      } catch (e) {}

      const resolvedShowcase = await getFeaturedShowcase();
      return NextResponse.json({
        success: true,
        message: "Project removed from carousel.",
        showcase: resolvedShowcase,
      });
    }

    // Action 4: Quick toggle long-form project in cinema carousel
    if (action === "toggle" && projectId) {
      const toggleResult = await toggleProjectInShowcase(projectId);

      try {
        revalidatePath("/projects");
        revalidatePath("/admin/projects");
      } catch (e) {}

      const resolvedShowcase = await getFeaturedShowcase();

      return NextResponse.json({
        success: true,
        action: toggleResult.action,
        slotNumber: toggleResult.slotNumber,
        carouselIds: toggleResult.carouselIds,
        message:
          toggleResult.action === "added"
            ? `Project added to Cinema Carousel (Slot ${toggleResult.slotNumber}).`
            : `Project removed from Cinema Carousel.`,
        config: toggleResult.config,
        showcase: resolvedShowcase,
      });
    }

    const validKeys = [...SHOWCASE_SLOT_KEYS, "spotlight", "secondaryLongForm", "shortOne", "shortTwo", "tertiaryLongForm"];
    if (!slotKey || !validKeys.includes(slotKey)) {
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
