import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/guard";
import { getProjectById } from "@/services/projects/getProjectById";
import { updateProject } from "@/services/projects/updateProject";
import { deleteProject } from "@/services/projects/deleteProject";

/**
 * GET /api/admin/projects/[id]
 */
export async function GET(request, context) {
  try {
    const { errorResponse } = await requireAdminAuth();
    if (errorResponse) return errorResponse;

    const { id } = await context.params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: `Project '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (err) {
    console.error("[Admin Project GET ID Error]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/projects/[id]
 */
export async function PUT(request, context) {
  try {
    const { errorResponse, user } = await requireAdminAuth();
    if (errorResponse) return errorResponse;

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));

    const result = await updateProject(id, body, user.email);

    return NextResponse.json({
      success: true,
      project: result.project,
    });
  } catch (err) {
    console.error("[Admin Project PUT Error]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/admin/projects/[id]
 */
export async function DELETE(request, context) {
  try {
    const { errorResponse } = await requireAdminAuth();
    if (errorResponse) return errorResponse;

    const { id } = await context.params;
    await deleteProject(id);

    return NextResponse.json({
      success: true,
      message: `Project '${id}' deleted successfully`,
    });
  } catch (err) {
    console.error("[Admin Project DELETE Error]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
