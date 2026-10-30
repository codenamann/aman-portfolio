import AdminFormField from "@/components/admin/ui/AdminFormField";
import AdminInput from "@/components/admin/ui/AdminInput";

function slugify(text) {
  return (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .slice(0, 60);
}

/**
 * Basic Information Fieldset for Project Editor
 * Contains only core identity fields: Slug, Title, Subtitle, Year, Duration.
 */
export default function ProjectBasicFields({ formData, onChange, isEdit }) {
  const handleTitleChange = (val) => {
    onChange("title", val);
    // Auto-populate slug if empty or previous slug matched previous title
    if (!isEdit && (!formData.id || formData.id === slugify(formData.title))) {
      onChange("id", slugify(val));
    }
  };

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
          <div className="relative">
            <AdminInput
              type="text"
              required
              disabled={isEdit}
              placeholder="e.g. edit-war-challenge"
              value={formData.id}
              onChange={(e) => onChange("id", slugify(e.target.value))}
            />
            {!isEdit && formData.title && formData.id !== slugify(formData.title) && (
              <button
                type="button"
                onClick={() => onChange("id", slugify(formData.title))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-2 py-0.5 rounded bg-[#1f1f22] hover:bg-[#252529] text-zinc-300 hover:text-white border border-[#333338] transition cursor-pointer"
                title="Auto-generate from Title"
              >
                Sync with Title
              </button>
            )}
          </div>
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
            onChange={(e) => handleTitleChange(e.target.value)}
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
