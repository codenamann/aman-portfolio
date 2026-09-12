"use client";

import { Plus, Trash2 } from "lucide-react";
import AdminImageUpload from "./AdminImageUpload";

/**
 * 2. About Bio & Work History Editor
 * Strict Zero-Default: Empty inputs when no Firestore data exists.
 * Headings ("Designing experiences that make sense.") remain static in code.
 */
export default function AboutEditor({ data = {}, onChange }) {
  const about = data || {};
  const paragraphs = Array.isArray(about.paragraphs) ? about.paragraphs : [];
  const workHistory = Array.isArray(about.workHistory) ? about.workHistory : [];

  const handleAddParagraph = () => {
    onChange({
      ...about,
      paragraphs: [...paragraphs, ""],
    });
  };

  const handleUpdateParagraph = (index, value) => {
    const next = [...paragraphs];
    next[index] = value;
    onChange({
      ...about,
      paragraphs: next,
    });
  };

  const handleRemoveParagraph = (index) => {
    onChange({
      ...about,
      paragraphs: paragraphs.filter((_, i) => i !== index),
    });
  };

  const handleAddWorkHistory = () => {
    onChange({
      ...about,
      workHistory: [
        ...workHistory,
        { id: `wh-${Date.now()}`, company: "", role: "", period: "" },
      ],
    });
  };

  const handleUpdateWorkHistory = (index, field, value) => {
    const next = [...workHistory];
    next[index] = {
      ...next[index],
      [field]: value,
    };
    onChange({
      ...about,
      workHistory: next,
    });
  };

  const handleRemoveWorkHistory = (index) => {
    onChange({
      ...about,
      workHistory: workHistory.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Story Paragraphs ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Bio Story Paragraphs</h3>
            <p className="text-xs text-white/50">
              Descriptive narrative paragraphs displayed in the About section.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddParagraph}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e90c47]/10 hover:bg-[#e90c47]/20 text-[#e90c47] text-xs font-semibold transition cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Paragraph</span>
          </button>
        </div>

        {paragraphs.length === 0 ? (
          <p className="text-xs text-white/40 italic py-2">
            No bio paragraphs configured. Click &ldquo;Add Paragraph&rdquo; to add one.
          </p>
        ) : (
          <div className="space-y-3">
            {paragraphs.map((para, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-[#1a1a1e] border border-[#2b2b30]"
              >
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] font-mono text-white/40 mb-1">
                    Paragraph {idx + 1}
                  </span>
                  <textarea
                    rows={3}
                    value={para || ""}
                    onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition leading-relaxed resize-y"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveParagraph(idx)}
                  className="p-2 mt-5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition"
                  aria-label="Delete paragraph"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Signature Graphic ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] space-y-4">
        <h3 className="text-sm font-semibold text-white">Digital Signature Graphic</h3>
        <AdminImageUpload
          value={typeof about.signature === "string" ? about.signature : about.signature?.src || ""}
          onChange={(url) => onChange({ ...about, signature: url })}
          section="about"
          label="Signature Image"
          description="Upload authentic red handwritten signature graphic PNG with transparent background."
          aspect="signature"
        />
      </div>

      {/* ── Work History ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Work History Milestones</h3>
            <p className="text-xs text-white/50">
              Career milestones displayed in the interactive collapsed stack / expanded list.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddWorkHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e90c47]/10 hover:bg-[#e90c47]/20 text-[#e90c47] text-xs font-semibold transition cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Experience</span>
          </button>
        </div>

        {workHistory.length === 0 ? (
          <p className="text-xs text-white/40 italic py-2">
            No work history entries configured. Click &ldquo;Add Experience&rdquo; to add one.
          </p>
        ) : (
          <div className="space-y-3">
            {workHistory.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-3.5 rounded-lg bg-[#1a1a1e] border border-[#2b2b30] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/70">
                    Experience #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveWorkHistory(idx)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition"
                    aria-label="Delete experience"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={item.company || ""}
                      onChange={(e) =>
                        handleUpdateWorkHistory(idx, "company", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">
                      Role / Position
                    </label>
                    <input
                      type="text"
                      value={item.role || ""}
                      onChange={(e) =>
                        handleUpdateWorkHistory(idx, "role", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">
                      Duration / Period
                    </label>
                    <input
                      type="text"
                      value={item.period || ""}
                      onChange={(e) =>
                        handleUpdateWorkHistory(idx, "period", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
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
