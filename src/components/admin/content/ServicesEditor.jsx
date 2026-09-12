"use client";

import { useState } from "react";
import { Plus, Trash2, Video, Sparkles, Palette, Music, Film, X } from "lucide-react";

const ICON_OPTIONS = [
  { value: "shortform", label: "Video / Short-form", icon: Video },
  { value: "motion", label: "Sparkles / Motion Graphics", icon: Sparkles },
  { value: "color", label: "Palette / Color Grading", icon: Palette },
  { value: "sound", label: "Music / Sound Design", icon: Music },
  { value: "brand", label: "Film / Brand Storytelling", icon: Film },
];

const VARIANT_OPTIONS = [
  { value: "dark", label: "Dark Card (Standard Theme, Positive Tilt)" },
  { value: "accent", label: "Accent Card (Red Theme, Negative Tilt)" },
];

function ServiceTagManager({ tags = [], onChange }) {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    const trimmed = inputValue.trim().replace(/^,+|,+$/g, "");
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium text-white/70">
        Capability Tags ({tags.length})
      </label>

      {/* Chip list */}
      <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg bg-[#141416] border border-[#2b2b30]">
        {tags.map((tag, tagIdx) => (
          <span
            key={tagIdx}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#25252a] text-white/90 text-xs border border-white/10 select-none group"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tagIdx)}
              className="text-white/40 hover:text-red-400 transition cursor-pointer p-0.5 rounded-full hover:bg-white/10"
              aria-label={`Remove ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        {/* Input box */}
        <div className="flex-1 min-w-[120px] flex items-center gap-1.5">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAddTag}
            className="w-full bg-transparent text-white text-xs focus:outline-none placeholder:text-white/20 py-1"
          />
        </div>
      </div>
      <p className="text-[10px] text-white/40">
        Type a tag name and press <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[9px]">Enter</kbd> or <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[9px]">,</kbd> to add.
      </p>
    </div>
  );
}

/**
 * 3. Services Editor
 * Strict Zero-Default: Empty inputs when no Firestore data exists.
 * Section Heading ("What I help you to Shape...") is static in code.
 */
export default function ServicesEditor({ data = {}, onChange }) {
  const content = data || {};
  const services = Array.isArray(content.services) ? content.services : [];

  const handleAddService = () => {
    onChange({
      ...content,
      services: [
        ...services,
        {
          id: `svc-${Date.now()}`,
          title: "",
          description: "",
          icon: "shortform",
          tags: [],
          variant: "dark",
        },
      ],
    });
  };

  const handleUpdateService = (index, field, value) => {
    const next = [...services];
    next[index] = {
      ...next[index],
      [field]: value,
    };
    onChange({
      ...content,
      services: next,
    });
  };

  const handleRemoveService = (index) => {
    onChange({
      ...content,
      services: services.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Service Offerings</h3>
            <p className="text-xs text-white/50">
              Interactive 3D stacking cards displayed in the Services section.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddService}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e90c47]/10 hover:bg-[#e90c47]/20 text-[#e90c47] text-xs font-semibold transition cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Service</span>
          </button>
        </div>

        {services.length === 0 ? (
          <p className="text-xs text-white/40 italic py-2">
            No services configured. Click &ldquo;Add Service&rdquo; to create one.
          </p>
        ) : (
          <div className="space-y-4">
            {services.map((svc, idx) => (
              <div
                key={svc.id || idx}
                className="p-4 rounded-xl bg-[#1a1a1e] border border-[#2b2b30] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/80">
                    Service #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(idx)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition"
                    aria-label="Delete service"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={svc.title || ""}
                      onChange={(e) =>
                        handleUpdateService(idx, "title", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">
                      Lucide Icon
                    </label>
                    <select
                      value={svc.icon || "shortform"}
                      onChange={(e) =>
                        handleUpdateService(idx, "icon", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">
                    Description Copy
                  </label>
                  <textarea
                    rows={3}
                    value={svc.description || ""}
                    onChange={(e) =>
                      handleUpdateService(idx, "description", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <ServiceTagManager
                      tags={Array.isArray(svc.tags) ? svc.tags : []}
                      onChange={(newTags) =>
                        handleUpdateService(idx, "tags", newTags)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">
                      Visual Variant & Scroll Rotation
                    </label>
                    <select
                      value={svc.variant || "dark"}
                      onChange={(e) =>
                        handleUpdateService(idx, "variant", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                    >
                      {VARIANT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
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
