"use client";

import { Plus, Trash2, Star, ShieldCheck } from "lucide-react";
import AdminImageUpload from "./AdminImageUpload";

/**
 * 7. Social Proof & Brand Logos Editor
 * Strict Zero-Default: Empty inputs when no Firestore data exists.
 * Social Proof Avatar Stack is 100% hardcoded in code and excluded from this editor.
 */
export default function SocialProofEditor({ data = {}, onChange }) {
  const content = data || {};
  const clientBrandLogos = Array.isArray(content.clientBrandLogos)
    ? content.clientBrandLogos
    : [];

  const handleChange = (field, value) => {
    onChange({
      ...content,
      [field]: value,
    });
  };

  const handleAddLogo = () => {
    onChange({
      ...content,
      clientBrandLogos: [...clientBrandLogos, { src: "", alt: "" }],
    });
  };

  const handleUpdateLogo = (index, field, value) => {
    const next = [...clientBrandLogos];
    next[index] = {
      ...next[index],
      [field]: value,
    };
    onChange({
      ...content,
      clientBrandLogos: next,
    });
  };

  const handleRemoveLogo = (index) => {
    onChange({
      ...content,
      clientBrandLogos: clientBrandLogos.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Key Metrics ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] space-y-4">
        <h3 className="text-sm font-semibold text-white">Social Proof Summary Metrics</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/80 mb-1.5">
              Satisfied Clients Badge Text
            </label>
            <input
              type="text"
              value={content.satisfiedClients || ""}
              onChange={(e) => handleChange("satisfiedClients", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a1e] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/80 mb-1.5">
              Star Rating Summary (1 - 5)
            </label>
            <div className="flex items-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    handleChange(
                      "rating",
                      content.rating === star ? undefined : star
                    )
                  }
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    content.rating && content.rating >= star
                      ? "text-amber-400 bg-amber-400/10"
                      : "text-white/20 hover:text-white/40"
                  }`}
                >
                  <Star
                    size={16}
                    fill={
                      content.rating && content.rating >= star
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              ))}
              <span className="text-xs text-white/50 ml-2">
                {content.rating ? `${content.rating} Stars` : "No rating"}
              </span>
            </div>
          </div>
        </div>

        {/* Informational notice regarding hardcoded avatar stack */}
        <div className="p-3 rounded-lg bg-[#18181c] border border-[#26262a] flex items-center gap-2.5 text-xs text-white/60">
          <ShieldCheck size={16} className="text-blue-400 shrink-0" />
          <span>
            <strong className="text-white/80">Avatar Stack:</strong> The social proof avatar stack is hardcoded in code (<code className="text-white/80 font-mono">/avatars/avatar1-5.jpg</code>) and does not require database management.
          </span>
        </div>
      </div>

      {/* ── Client Brand Logos Marquee ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Client Brand Logos Marquee ({clientBrandLogos.length})
            </h3>
            <p className="text-xs text-white/50">
              Trusted partner brand logos displayed in the scrolling client bar.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddLogo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e90c47]/10 hover:bg-[#e90c47]/20 text-[#e90c47] text-xs font-semibold transition cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Brand Logo</span>
          </button>
        </div>

        {clientBrandLogos.length === 0 ? (
          <p className="text-xs text-white/40 italic py-2">
            No client brand logos configured. Click &ldquo;Add Brand Logo&rdquo; to add one.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clientBrandLogos.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#1a1a1e] border border-[#2b2b30] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/80">
                    Logo #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLogo(idx)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition"
                    aria-label="Delete logo"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Brand Name / Alt Text
                  </label>
                  <input
                    type="text"
                    value={item.alt || ""}
                    onChange={(e) =>
                      handleUpdateLogo(idx, "alt", e.target.value)
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                  />
                </div>

                <div className="pt-2 border-t border-[#222225]">
                  <AdminImageUpload
                    value={item.src || ""}
                    onChange={(url) => handleUpdateLogo(idx, "src", url)}
                    section="social-proof"
                    label="Brand Logo Image"
                    description="Upload horizontal logo PNG or SVG with transparent background."
                    aspect="wide"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
