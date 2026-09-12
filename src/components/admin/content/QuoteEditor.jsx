"use client";

import { Info } from "lucide-react";
import AdminImageUpload from "./AdminImageUpload";

/**
 * 9. Philosophy Quote Editor
 * Strict Zero-Default: Empty inputs when no Firestore data exists.
 * When type === "self", reuses content/profile (zero duplication).
 */
export default function QuoteEditor({ data = {}, onChange }) {
  const quote = data || {};
  const isSelf = quote.type !== "testimonial";

  const updateField = (field, value) => {
    onChange({ ...quote, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Philosophy Quote Highlight</h3>
          <p className="text-xs text-white/50">
            Prominent creative statement or client quote rendered below featured projects.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/80 mb-1.5">
            Quote Statement
          </label>
          <textarea
            rows={4}
            value={quote.quote || ""}
            onChange={(e) => updateField("quote", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#1a1a1e] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition resize-y leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/80 mb-1.5">
            Attribution Mode
          </label>
          <select
            value={quote.type || "self"}
            onChange={(e) => updateField("type", e.target.value)}
            className="w-full sm:w-80 px-3 py-2 rounded-lg bg-[#1a1a1e] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
          >
            <option value="self">Self Statement (Aman&apos;s Personal Philosophy)</option>
            <option value="testimonial">Guest / Client Testimonial Attribution</option>
          </select>
        </div>

        {isSelf ? (
          <div className="p-3.5 rounded-lg bg-[#18181c] border border-[#26262a] flex items-center gap-2.5 text-xs text-white/60">
            <Info size={16} className="text-accent shrink-0" />
            <span>
              <strong className="text-white/80">Canonical Profile Reuse:</strong> When set to &ldquo;Self Statement&rdquo;, the quote attribution automatically reuses your name, role, and avatar from <code className="text-white/80 font-mono">content/profile</code> with zero asset duplication.
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#1a1a1e] border border-[#2b2b30] space-y-4">
            <h4 className="text-xs font-semibold text-white/80">
              Custom Guest Attribution
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={quote.author || ""}
                  onChange={(e) => updateField("author", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={quote.role || ""}
                  onChange={(e) => updateField("role", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={quote.company || ""}
                  onChange={(e) => updateField("company", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#222225]">
              <AdminImageUpload
                value={quote.avatar || ""}
                onChange={(url) => updateField("avatar", url)}
                section="quote"
                label="Guest Avatar (Optional)"
                aspect="square"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
