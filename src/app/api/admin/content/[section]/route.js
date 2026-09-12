import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/guard";
import { getContent } from "@/services/content/getContent";
import { updateContent } from "@/services/content/updateContent";
import { SUPPORTED_CONTENT_SECTIONS } from "@/lib/constants/limits";

/**
 * GET /api/admin/content/[section]
 */
export async function GET(request, context) {
  try {
    const { errorResponse } = await requireAdminAuth();
    if (errorResponse) return errorResponse;

    const { section } = await context.params;
    if (!SUPPORTED_CONTENT_SECTIONS.includes(section)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid content section '${section}'. Valid sections: ${SUPPORTED_CONTENT_SECTIONS.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    const data = await getContent(section);

    return NextResponse.json({
      success: true,
      section,
      data,
    });
  } catch (err) {
    console.error("[Admin Content GET Error]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/content/[section]
 */
export async function PUT(request, context) {
  try {
    const { errorResponse, user } = await requireAdminAuth();
    if (errorResponse) return errorResponse;

    const { section } = await context.params;
    const body = await request.json().catch(() => ({}));

    const result = await updateContent(section, body, user.email);

    return NextResponse.json({
      success: true,
      message: `Content section '${section}' updated successfully`,
      ...result,
    });
  } catch (err) {
    console.error("[Admin Content PUT Error]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
