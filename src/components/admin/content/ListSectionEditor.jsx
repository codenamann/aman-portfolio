import { Plus, Trash2 } from "lucide-react";
import AdminFormField from "@/components/admin/ui/AdminFormField";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminTextarea from "@/components/admin/ui/AdminTextarea";

/**
 * Reusable Editor for List-Based Sections (Services, Testimonials, Reactions, FAQs)
 */
export default function ListSectionEditor({
  sectionKey,
  data = {},
  onChange,
  itemLabel = "Item",
}) {
  const items = Array.isArray(data.items)
    ? data.items
    : Array.isArray(data)
    ? data
    : [];

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, items: updated });
  };

  const handleAddItem = () => {
    const newItem = { id: `item-${Date.now()}`, title: "", text: "" };
    onChange({ ...data, items: [...items, newItem] });
  };

  const handleRemoveItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    onChange({ ...data, items: updated });
  };

  return (
    <div className="space-y-4">
      {/* Optional Top Section Metadata */}
      <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] space-y-4">
        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#a1a1a6] font-mono">
          Section Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormField label="Section Heading">
            <AdminInput
              type="text"
              value={data.title || data.heading || ""}
              onChange={(e) =>
                onChange({ ...data, title: e.target.value, heading: e.target.value })
              }
              placeholder="e.g. Services / Client Testimonials"
            />
          </AdminFormField>
          <AdminFormField label="Section Subtitle">
            <AdminInput
              type="text"
              value={data.subtitle || ""}
              onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
              placeholder="e.g. What creators say about working together"
            />
          </AdminFormField>
        </div>
      </div>

      {/* Item Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#a1a1a6]">
            {itemLabel}s ({items.length})
          </h4>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181a] hover:bg-[#1f1f22] text-[#f2f2f2] text-xs font-semibold border border-[#262628] transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Add {itemLabel}</span>
          </button>
        </div>

        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-4 sm:p-5 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] space-y-3 relative group"
          >
            <div className="flex items-center justify-between border-b border-[#262628] pb-2">
              <span className="text-[11px] font-mono text-[#6f6f76] font-bold">
                #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="p-1 text-[#6f6f76] hover:text-red-400 transition rounded"
                title="Remove item"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminFormField label="Title / Name / Author">
                <AdminInput
                  type="text"
                  value={item.title || item.name || item.author || item.question || ""}
                  onChange={(e) =>
                    handleItemChange(
                      idx,
                      item.question !== undefined
                        ? "question"
                        : item.author !== undefined
                        ? "author"
                        : item.name !== undefined
                        ? "name"
                        : "title",
                      e.target.value
                    )
                  }
                  placeholder="Title or Name"
                />
              </AdminFormField>

              <AdminFormField label="Role / Category / Subtext">
                <AdminInput
                  type="text"
                  value={item.role || item.category || item.tag || item.platform || ""}
                  onChange={(e) =>
                    handleItemChange(
                      idx,
                      item.role !== undefined
                        ? "role"
                        : item.category !== undefined
                        ? "category"
                        : item.platform !== undefined
                        ? "platform"
                        : "tag",
                      e.target.value
                    )
                  }
                  placeholder="e.g. YouTube Creator or Motion Design"
                />
              </AdminFormField>
            </div>

            <AdminFormField label="Description / Quote / Answer">
              <AdminTextarea
                rows={2}
                value={item.description || item.quote || item.text || item.answer || ""}
                onChange={(e) =>
                  handleItemChange(
                    idx,
                    item.answer !== undefined
                      ? "answer"
                      : item.quote !== undefined
                      ? "quote"
                      : item.description !== undefined
                      ? "description"
                      : "text",
                    e.target.value
                  )
                }
                placeholder="Content text..."
              />
            </AdminFormField>
          </div>
        ))}
      </div>
    </div>
  );
}
