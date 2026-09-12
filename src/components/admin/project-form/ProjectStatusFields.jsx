import AdminFormField from "@/components/admin/ui/AdminFormField";
import AdminSelect from "@/components/admin/ui/AdminSelect";
import AdminToggle from "@/components/admin/ui/AdminToggle";
import { PROJECT_STATUSES } from "@/lib/constants/limits";

/**
 * Publication Status & Showcase Eligibility Fieldset
 */
export default function ProjectStatusFields({ formData, onChange }) {
  return (
    <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] space-y-4">
      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#a1a1a6] font-mono">
        Publication & Showcase
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <AdminFormField
          label="Publication Status"
          description="Controls public visibility in portfolio archives and sections."
        >
          <AdminSelect
            value={formData.status}
            onChange={(e) => onChange("status", e.target.value)}
          >
            <option value={PROJECT_STATUSES.PUBLISHED}>
              Published (Public)
            </option>
            <option value={PROJECT_STATUSES.DRAFT}>Draft (Internal)</option>
            <option value={PROJECT_STATUSES.ARCHIVED}>
              Archived (Hidden)
            </option>
          </AdminSelect>
        </AdminFormField>

        <div className="pt-2 md:pt-4">
          <AdminToggle
            id="featured-toggle"
            checked={formData.featured}
            onChange={(val) => onChange("featured", val)}
            label="Available for Homepage Showcase"
            description="Eligible to appear in the Homepage 4+4 featured section when space permits."
          />
        </div>
      </div>
    </div>
  );
}
