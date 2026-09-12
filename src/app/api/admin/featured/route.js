import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/guard";
import { getFeaturedProjects } from "@/services/projects/getFeaturedProjects";
import {
  reorderFeaturedProjects,
  toggleProjectFeatured,
} from "@/services/projects/setFeaturedStatus";
import { featuredReorderSchema } from "@/lib/validation/project.schema";
import {
  MAX_FEATURED_SHORT_FORM,
  MAX_FEATURED_LONG_FORM,
} from "@/lib/constants/limits";

/**
 * GET /api/admin/featured
 * Returns current featured projects and slot capacity stats.
 */
export async function GET() {
  try {
    const { errorResponse } = await requireAdminAuth();
    if (errorResponse) return errorResponse;

    const featured = await getFeaturedProjects();

    return NextResponse.json({
      success: true,
      limits: {
        shortFormMax: MAX_FEATURED_SHORT_FORM,
        longFormMax: MAX_FEATURED_LONG_FORM,
      },
      usage: {
        shortFormCount: featured.shortForm.length,
        longFormCount: featured.longForm.length,
      },
      featured,
    });
  } catch (err) {
    console.error("[Admin Featured GET Error]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/featured
 * Handles:
 * 1. Reordering array of up to 4 featured IDs: { format: "short-form" | "long-form", featuredIds: string[] }
 * 2. Toggling single project featured status: { projectId: string, featured: boolean }
 */
export async function PUT(request) {
  try {
    const { errorResponse, user } = await requireAdminAuth();
    if (errorResponse) return errorResponse;

    const body = await request.json().catch(() => ({}));

    // Mode 1: Reorder full list of featured projects for a format
    if (body.format && Array.isArray(body.featuredIds)) {
      const validated = featuredReorderSchema.parse(body);
      const result = await reorderFeaturedProjects(
        validated.format,
        validated.featuredIds,
        user.email
      );

      return NextResponse.json({
        success: true,
        message: `Updated featured ${validated.format} projects order successfully`,
        ...result,
      });
    }

    // Mode 2: Toggle single project
    if (body.projectId && typeof body.featured === "boolean") {
      const result = await toggleProjectFeatured(
        body.projectId,
        body.featured,
        user.email
      );

      return NextResponse.json({
        success: true,
        message: `Project featured status updated to ${body.featured}`,
        ...result,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Invalid request payload. Expected { format, featuredIds: string[] } or { projectId: string, featured: boolean }",
      },
      { status: 400 }
    );
  } catch (err) {
    console.error("[Admin Featured PUT Error]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
