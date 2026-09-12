import Image from "next/image";
import AdminFormField from "@/components/admin/ui/AdminFormField";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminSelect from "@/components/admin/ui/AdminSelect";
import { PROJECT_FORMATS } from "@/lib/constants/limits";

/**
 * Media Source & Platform Fieldset for Project Editor
 */
export default function ProjectMediaFields({ formData, onChange }) {
  const isShortForm = formData.format === PROJECT_FORMATS.SHORT_FORM;

  return (
    <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] space-y-4">
      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#a1a1a6] font-mono">
        Media Source & Formats
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField
          label="Project Video Format"
          description="Dictates whether this video belongs in Short-form (9:16) or Long-form (16:9)."
          required
        >
          <AdminSelect
            value={formData.format}
            onChange={(e) => onChange("format", e.target.value)}
          >
            <option value={PROJECT_FORMATS.SHORT_FORM}>
              Short-form (Vertical 9:16 / Reels / Shorts)
            </option>
            <option value={PROJECT_FORMATS.LONG_FORM}>
              Long-form (Horizontal 16:9 / Video Edit)
            </option>
          </AdminSelect>
        </AdminFormField>

        <AdminFormField
          label="Hosting Platform"
          description="Primary video streaming platform."
        >
          <AdminSelect
            value={formData.platform}
            onChange={(e) => onChange("platform", e.target.value)}
          >
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="vimeo">Vimeo</option>
            <option value="drive">Google Drive</option>
            <option value="other">Direct Video URL</option>
          </AdminSelect>
        </AdminFormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField
          label="YouTube Video URL"
          description="Canonical video source, embed, and preview URL."
          required
        >
          <AdminInput
            type="url"
            required
            placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
            value={formData.videoUrl}
            onChange={(e) => onChange("videoUrl", e.target.value)}
          />
        </AdminFormField>

        {/* Instagram Reel URL - ONLY for Short-form projects */}
        {isShortForm ? (
          <AdminFormField
            label="Instagram Reel URL"
            description="Optional external destination link to the published Reel on Instagram."
          >
            <AdminInput
              type="url"
              placeholder="https://www.instagram.com/reel/... (optional)"
              value={formData.instagramUrl || ""}
              onChange={(e) => onChange("instagramUrl", e.target.value)}
            />
          </AdminFormField>
        ) : (
          <AdminFormField
            label="Custom Thumbnail URL"
            description="Art-directed custom thumbnail override (leave blank to auto-use YouTube maxres)."
          >
            <AdminInput
              type="url"
              placeholder="https://img.youtube.com/... or /projects/custom.jpg"
              value={formData.thumbnail}
              onChange={(e) => onChange("thumbnail", e.target.value)}
            />
          </AdminFormField>
        )}
      </div>

      {/* For short-form projects, render Custom Thumbnail URL on full row if needed */}
      {isShortForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormField
            label="Custom Thumbnail URL"
            description="Art-directed custom thumbnail override (leave blank to auto-use YouTube maxres)."
          >
            <AdminInput
              type="url"
              placeholder="https://img.youtube.com/... or /projects/custom.jpg"
              value={formData.thumbnail}
              onChange={(e) => onChange("thumbnail", e.target.value)}
            />
          </AdminFormField>
        </div>
      )}

      {/* Thumbnail Live Preview Box */}
      {formData.thumbnail && (
        <div className="pt-2">
          <span className="text-[11px] font-mono text-[#a1a1a6] block mb-1.5">
            Thumbnail Live Preview:
          </span>
          <div className="w-48 h-28 relative rounded-xl bg-[#111113] overflow-hidden border border-[#262628]">
            <Image
              src={formData.thumbnail}
              alt="Preview"
              fill
              sizes="192px"
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
