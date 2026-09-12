"use client";

import { Plus, Trash2, Star } from "lucide-react";
import AdminImageUpload from "./AdminImageUpload";

/**
 * 5. Client Testimonials Editor
 * Strict Zero-Default: Empty inputs when no Firestore data exists. Rating has no default 5.
 */
export default function TestimonialsEditor({ data = {}, onChange }) {
  const content = data || {};
  const testimonials = Array.isArray(content.testimonials) ? content.testimonials : [];
  const showTestimonials = content.showTestimonials !== false;

  const handleAddTestimonial = () => {
    onChange({
      ...content,
      testimonials: [
        ...testimonials,
        {
          id: `test-${Date.now()}`,
          quote: "",
          author: "",
          role: "",
          company: "",
          avatar: "",
          rating: undefined,
        },
      ],
    });
  };

  const handleUpdateTestimonial = (index, field, value) => {
    const next = [...testimonials];
    next[index] = {
      ...next[index],
      [field]: value,
    };
    onChange({
      ...content,
      testimonials: next,
    });
  };

  const handleRemoveTestimonial = (index) => {
    onChange({
      ...content,
      testimonials: testimonials.filter((_, i) => i !== index),
    });
  };

  const handleToggleRail = () => {
    onChange({
      ...content,
      showTestimonials: !showTestimonials,
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Marquee Display Visibility ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Top Client Testimonials Rail</h3>
          <p className="text-xs text-white/50">
            Controls whether the leftward-scrolling client testimonials rail is visible on the public site.
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggleRail}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            showTestimonials
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-white/5 text-white/40 border border-white/10"
          }`}
        >
          {showTestimonials ? "Rail Visible" : "Rail Hidden"}
        </button>
      </div>

      {/* ── Testimonials List ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Client Testimonials ({testimonials.length})</h3>
            <p className="text-xs text-white/50">
              Quotes from clients displayed in the top marquee rail.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddTestimonial}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e90c47]/10 hover:bg-[#e90c47]/20 text-[#e90c47] text-xs font-semibold transition cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Testimonial</span>
          </button>
        </div>

        {testimonials.length === 0 ? (
          <p className="text-xs text-white/40 italic py-2">
            No testimonials configured. Click &ldquo;Add Testimonial&rdquo; to create one.
          </p>
        ) : (
          <div className="space-y-4">
            {testimonials.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl bg-[#1a1a1e] border border-[#2b2b30] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/80">
                    Testimonial #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTestimonial(idx)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition"
                    aria-label="Delete testimonial"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Client Quote
                  </label>
                  <textarea
                    rows={3}
                    value={item.quote || ""}
                    onChange={(e) =>
                      handleUpdateTestimonial(idx, "quote", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={item.author || ""}
                      onChange={(e) =>
                        handleUpdateTestimonial(idx, "author", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={item.role || ""}
                      onChange={(e) =>
                        handleUpdateTestimonial(idx, "role", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={item.company || ""}
                      onChange={(e) =>
                        handleUpdateTestimonial(idx, "company", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#222225]">
                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1.5">
                      Star Rating (1 - 5)
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            handleUpdateTestimonial(
                              idx,
                              "rating",
                              item.rating === star ? undefined : star
                            )
                          }
                          className={`p-1.5 rounded-md transition cursor-pointer ${
                            item.rating && item.rating >= star
                              ? "text-amber-400 bg-amber-400/10"
                              : "text-white/20 hover:text-white/40"
                          }`}
                        >
                          <Star size={16} fill={item.rating && item.rating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                      <span className="text-xs text-white/50 ml-2">
                        {item.rating ? `${item.rating} Stars` : "No rating"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <AdminImageUpload
                      value={item.avatar || ""}
                      onChange={(url) =>
                        handleUpdateTestimonial(idx, "avatar", url)
                      }
                      section="testimonials"
                      label="Client Avatar (Optional)"
                      aspect="square"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
