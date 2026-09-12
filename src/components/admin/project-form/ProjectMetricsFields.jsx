import AdminFormField from "@/components/admin/ui/AdminFormField";
import AdminInput from "@/components/admin/ui/AdminInput";

/**
 * Project Metrics & Stats Fieldset
 */
export default function ProjectMetricsFields({ formData, onChange }) {
  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#141416] border border-white/10 space-y-4">
      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-400 font-mono">
        Performance Metrics & Social Proof
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AdminFormField
          label="View Count (Formatted)"
          description="Total views achieved on the video."
        >
          <AdminInput
            type="text"
            placeholder="e.g. 1.2M or 450K"
            value={formData.views}
            onChange={(e) => onChange("views", e.target.value)}
          />
        </AdminFormField>

        <AdminFormField
          label="Likes / Engagements"
          description="Total likes or engagement count."
        >
          <AdminInput
            type="text"
            placeholder="e.g. 85K"
            value={formData.likes}
            onChange={(e) => onChange("likes", e.target.value)}
          />
        </AdminFormField>
      </div>
    </div>
  );
}
