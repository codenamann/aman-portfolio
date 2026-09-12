"use client";

import { Plus, Trash2, Info } from "lucide-react";

/**
 * 8. FAQs & Discovery CTA Editor
 * Strict Zero-Default: Empty inputs when no Firestore data exists.
 * Discovery CTA reuses profile.avatar and profile.bookingUrl from content/profile.
 */
export default function FaqsEditor({ data = {}, onChange }) {
  const content = data || {};
  const faqs = Array.isArray(content.faqs) ? content.faqs : [];
  const cta = content.cta || {};

  const handleAddFaq = () => {
    onChange({
      ...content,
      faqs: [
        ...faqs,
        {
          id: `faq-${Date.now()}`,
          question: "",
          answer: "",
        },
      ],
    });
  };

  const handleUpdateFaq = (index, field, value) => {
    const next = [...faqs];
    next[index] = {
      ...next[index],
      [field]: value,
    };
    onChange({
      ...content,
      faqs: next,
    });
  };

  const handleRemoveFaq = (index) => {
    onChange({
      ...content,
      faqs: faqs.filter((_, i) => i !== index),
    });
  };

  const handleUpdateCta = (field, value) => {
    onChange({
      ...content,
      cta: {
        ...cta,
        [field]: value,
      },
    });
  };

  const ctaDescValue = Array.isArray(cta.description)
    ? cta.description.join("\n\n")
    : typeof cta.description === "string"
    ? cta.description
    : "";

  return (
    <div className="space-y-6">
      {/* ── Discovery CTA Marketing Card ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Discovery Call CTA Card</h3>
          <p className="text-xs text-white/50">
            Sticky accent card displayed alongside the FAQs accordion.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-white/80 mb-1.5">
              Card Headline (Supports multiline / Enter)
            </label>
            <textarea
              rows={2}
              value={cta.title || ""}
              onChange={(e) => handleUpdateCta("title", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a1e] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition resize-y leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/80 mb-1.5">
              Value Proposition Copy (Press Enter for new line / paragraph)
            </label>
            <textarea
              rows={4}
              value={ctaDescValue}
              onChange={(e) => handleUpdateCta("description", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a1e] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition resize-y leading-relaxed"
            />
          </div>

          <div className="p-3 rounded-lg bg-[#18181c] border border-[#26262a] flex items-center gap-2.5 text-xs text-white/60">
            <Info size={16} className="text-accent shrink-0" />
            <span>
              <strong className="text-white/80">Canonical Profile Links:</strong> The Discovery CTA card automatically uses your profile photo (<code className="text-white/80 font-mono">profile.avatar</code>) and booking URL (<code className="text-white/80 font-mono">profile.bookingUrl</code>) from Profile &amp; Identity.
            </span>
          </div>
        </div>
      </div>

      {/* ── FAQs Accordion ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Frequently Asked Questions ({faqs.length})
            </h3>
            <p className="text-xs text-white/50">
              Interactive accordion items displayed on the public site.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddFaq}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e90c47]/10 hover:bg-[#e90c47]/20 text-[#e90c47] text-xs font-semibold transition cursor-pointer"
          >
            <Plus size={13} />
            <span>Add FAQ</span>
          </button>
        </div>

        {faqs.length === 0 ? (
          <p className="text-xs text-white/40 italic py-2">
            No FAQs configured. Click &ldquo;Add FAQ&rdquo; to create one.
          </p>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={faq.id || idx}
                className="p-4 rounded-xl bg-[#1a1a1e] border border-[#2b2b30] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/80">
                    FAQ #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition"
                    aria-label="Delete FAQ"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={faq.question || ""}
                    onChange={(e) =>
                      handleUpdateFaq(idx, "question", e.target.value)
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Detailed Answer
                  </label>
                  <textarea
                    rows={3}
                    value={faq.answer || ""}
                    onChange={(e) =>
                      handleUpdateFaq(idx, "answer", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition resize-y"
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
