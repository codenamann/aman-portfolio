import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/guard";
import cloudinary from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const RASTER_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const LOGO_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

/**
 * POST /api/admin/upload
 * Authenticated server-to-server Cloudinary image upload endpoint
 */
export async function POST(request) {
  try {
    const { errorResponse } = await requireAdminAuth();
    if (errorResponse) return errorResponse;

    const formData = await request.formData();
    const file = formData.get("file");
    const section = (formData.get("section") || "general").toString().trim();

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const isLogoSection = section === "social-proof" || section === "logos";
    const allowedMimeTypes = isLogoSection ? LOGO_MIME_TYPES : RASTER_MIME_TYPES;

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file format '${file.type}'. Allowed formats: ${allowedMimeTypes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary via upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `portfolio/${section}`,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      secureUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    });
  } catch (err) {
    console.error("[Admin Upload Error]", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
