"use client";

import { Plus, Trash2 } from "lucide-react";
import AdminImageUpload from "./AdminImageUpload";

/**
 * 6. Viewer Reactions Editor
 * Strict Zero-Default: Empty inputs when no Firestore data exists.
 */
export default function ViewerReactionsEditor({ data = {}, onChange }) {
  const content = data || {};
  const reactions = Array.isArray(content.reactions) ? content.reactions : [];
  const showViewerReactions = content.showViewerReactions !== false;

  const handleAddReaction = () => {
    onChange({
      ...content,
      reactions: [
        ...reactions,
        {
          id: `react-${Date.now()}`,
          username: "",
          comment: "",
          age: "",
          likes: "",
          avatar: "",
        },
      ],
    });
  };

  const handleUpdateReaction = (index, field, value) => {
    const next = [...reactions];
    next[index] = {
      ...next[index],
      [field]: value,
    };
    onChange({
      ...content,
      reactions: next,
    });
  };

  const handleRemoveReaction = (index) => {
    onChange({
      ...content,
      reactions: reactions.filter((_, i) => i !== index),
    });
  };

  const handleToggleRail = () => {
    onChange({
      ...content,
      showViewerReactions: !showViewerReactions,
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Marquee Display Visibility ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Bottom Viewer Reactions Rail</h3>
          <p className="text-xs text-white/50">
            Controls whether the rightward-scrolling community comments rail is visible on the public site.
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggleRail}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            showViewerReactions
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-white/5 text-white/40 border border-white/10"
          }`}
        >
          {showViewerReactions ? "Rail Visible" : "Rail Hidden"}
        </button>
      </div>

      {/* ── Reactions List ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Viewer Comments ({reactions.length})</h3>
            <p className="text-xs text-white/50">
              Audience feedback and YouTube/social comments displayed in the bottom marquee rail.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddReaction}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e90c47]/10 hover:bg-[#e90c47]/20 text-[#e90c47] text-xs font-semibold transition cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Comment</span>
          </button>
        </div>

        {reactions.length === 0 ? (
          <p className="text-xs text-white/40 italic py-2">
            No viewer reactions configured. Click &ldquo;Add Comment&rdquo; to create one.
          </p>
        ) : (
          <div className="space-y-4">
            {reactions.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl bg-[#1a1a1e] border border-[#2b2b30] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/80">
                    Reaction #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveReaction(idx)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition"
                    aria-label="Delete reaction"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">
                      Username / Handle
                    </label>
                    <input
                      type="text"
                      value={item.username || ""}
                      onChange={(e) =>
                        handleUpdateReaction(idx, "username", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">
                      Timestamp / Age
                    </label>
                    <input
                      type="text"
                      value={item.age || ""}
                      onChange={(e) =>
                        handleUpdateReaction(idx, "age", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">
                      Likes Metric
                    </label>
                    <input
                      type="text"
                      value={item.likes || ""}
                      onChange={(e) =>
                        handleUpdateReaction(idx, "likes", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Comment Text
                  </label>
                  <textarea
                    rows={2}
                    value={item.comment || ""}
                    onChange={(e) =>
                      handleUpdateReaction(idx, "comment", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition resize-y"
                  />
                </div>

                <div className="pt-2 border-t border-[#222225]">
                  <AdminImageUpload
                    value={item.avatar || ""}
                    onChange={(url) =>
                      handleUpdateReaction(idx, "avatar", url)
                    }
                    section="viewer-reactions"
                    label="Commenter Avatar (Optional)"
                    aspect="square"
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
