import AdminFormField from "@/components/admin/ui/AdminFormField";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminTextarea from "@/components/admin/ui/AdminTextarea";

/**
 * Reusable Editor for Simple Text Sections (Quote, Footer)
 */
export default function SimpleCopyEditor({ data = {}, onChange, sectionKey }) {
  return (
    <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] space-y-4">
      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#a1a1a6] font-mono">
        {sectionKey.toUpperCase()} Content & Copy
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Heading / Lead Text">
          <AdminInput
            type="text"
            value={data.heading || data.title || ""}
            onChange={(e) =>
              onChange({ ...data, heading: e.target.value, title: e.target.value })
            }
          />
        </AdminFormField>

        <AdminFormField label="Author / Credit / Subtext">
          <AdminInput
            type="text"
            value={data.author || data.copyright || data.subtext || ""}
            onChange={(e) =>
              onChange({
                ...data,
                author: e.target.value,
                copyright: e.target.value,
                subtext: e.target.value,
              })
            }
          />
        </AdminFormField>
      </div>

      <AdminFormField label="Primary Copy / Text">
        <AdminTextarea
          rows={3}
          value={data.text || data.quote || data.description || ""}
          onChange={(e) =>
            onChange({
              ...data,
              text: e.target.value,
              quote: e.target.value,
              description: e.target.value,
            })
          }
        />
      </AdminFormField>
    </div>
  );
}
