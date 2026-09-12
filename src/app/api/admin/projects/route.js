import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/guard";
import { getProjects } from "@/services/projects/getProjects";
import { createProject } from "@/services/projects/createProject";

/**
 * GET /api/admin/projects
 * Protected: Admin only.
 * Query params: format, status, featured, limit
 */
export async function GET(request) {
  try {
    const { errorResponse } = await requireAdminAuth();
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || undefined;
    const status = searchParams.get("status") || undefined;
    const featuredParam = searchParams.get("featured");
    const featured =
      featuredParam !== null ? featuredParam === "true" : undefined;

    const projects = await getProjects({ format, status, featured });

    return NextResponse.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (err) {
    console.error("[Admin Projects GET Error]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/projects
 * Protected: Admin only.
 * Body: Project Object
 */
export async function POST(request) {
  try {
    const { errorResponse, user } = await requireAdminAuth();
    if (errorResponse) return errorResponse;

    const body = await request.json().catch(() => ({}));
    const result = await createProject(body, user.email);

    return NextResponse.json(
      {
        success: true,
        project: result.project,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Admin Projects POST Error]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
