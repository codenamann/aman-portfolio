import AdminFormField from "@/components/admin/ui/AdminFormField";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminTextarea from "@/components/admin/ui/AdminTextarea";

/**
 * Creative Copy, Deliverables, and Tools Fieldset
 */
export default function ProjectCopyFields({ formData, onChange }) {
  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#141416] border border-white/10 space-y-4">
      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-400 font-mono">
        Creative Copy & Deliverables
      </h3>

      <AdminFormField
        label="Project Overview & Story"
        description="Paragraph summary explaining the creative vision, pacing, or edit challenges."
      >
        <AdminTextarea
          rows={4}
          placeholder="Describe the editorial process, hook strategy, sound design, or color grade..."
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </AdminFormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField
          label="Deliverables (One per line)"
          description="Specific editing assets delivered."
        >
          <AdminTextarea
            rows={3}
            placeholder="1x 4K Master Video&#10;3x Vertical Teaser Shorts&#10;Custom YouTube Thumbnail"
            value={formData.deliverables}
            onChange={(e) => onChange("deliverables", e.target.value)}
          />
        </AdminFormField>

        <AdminFormField
          label="Tools & Software (Comma-separated)"
          description="Editing software, plugins, and DAWs used."
        >
          <AdminInput
            type="text"
            placeholder="Premiere Pro, After Effects, DaVinci Resolve"
            value={formData.tools}
            onChange={(e) => onChange("tools", e.target.value)}
          />
        </AdminFormField>
      </div>
    </div>
  );
}
