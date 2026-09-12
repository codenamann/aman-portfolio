import AdminFormField from "@/components/admin/ui/AdminFormField";
import AdminInput from "@/components/admin/ui/AdminInput";

/**
 * Basic Information Fieldset for Project Editor
 * Contains only core identity fields: Slug, Title, Subtitle, Year, Duration.
 */
export default function ProjectBasicFields({ formData, onChange, isEdit }) {
  return (
    <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] space-y-4">
      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#a1a1a6] font-mono">
        Basic Project Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField
          label="Project Identifier / Slug (ID)"
          description="Unique URL identifier (lowercase, hyphens, alphanumeric)."
          required
        >
          <AdminInput
            type="text"
            required
            disabled={isEdit}
            placeholder="e.g. edit-war-challenge"
            value={formData.id}
            onChange={(e) => onChange("id", e.target.value)}
          />
        </AdminFormField>

        <AdminFormField
          label="Project Title"
          description="Public display title of the video project."
          required
        >
          <AdminInput
            type="text"
            required
            placeholder="e.g. 1M+ View Challenge Edit"
            value={formData.title}
            onChange={(e) => onChange("title", e.target.value)}
          />
        </AdminFormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <AdminFormField
            label="Subtitle / Hook"
            description="Catchy secondary line shown below the title."
          >
            <AdminInput
              type="text"
              placeholder="e.g. High-Retention Fast-Paced Edit"
              value={formData.subtitle}
              onChange={(e) => onChange("subtitle", e.target.value)}
            />
          </AdminFormField>
        </div>

        <AdminFormField
          label="Year"
          description="Release or publish year."
        >
          <AdminInput
            type="text"
            placeholder="2026"
            value={formData.year}
            onChange={(e) => onChange("year", e.target.value)}
          />
        </AdminFormField>

        <AdminFormField
          label="Duration"
          description="Length in MM:SS or H:MM:SS."
        >
          <AdminInput
            type="text"
            placeholder="e.g. 12:45 or 0:58"
            value={formData.duration}
            onChange={(e) => onChange("duration", e.target.value)}
          />
        </AdminFormField>
      </div>
    </div>
  );
}
