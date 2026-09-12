"use client";

import { Plus, Trash2 } from "lucide-react";
import AdminImageUpload from "./AdminImageUpload";

const SUPPORTED_PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "behance", label: "Behance" },
  { value: "dribbble", label: "Dribbble" },
  { value: "x", label: "X (Twitter)" },
];

/**
 * 1. Profile & Identity Editor
 * Strict Zero-Default: Empty inputs when no Firestore data exists.
 */
export default function ProfileEditor({ data = {}, onChange }) {
  const profile = data || {};
  const socialLinks = Array.isArray(profile.socialLinks) ? profile.socialLinks : [];

  const handleChange = (field, value) => {
    onChange({
      ...profile,
      [field]: value,
    });
  };

  const handleAddSocialLink = () => {
    onChange({
      ...profile,
      socialLinks: [...socialLinks, { platform: "instagram", url: "" }],
    });
  };

  const handleUpdateSocialLink = (index, field, value) => {
    const next = [...socialLinks];
    next[index] = {
      ...next[index],
      [field]: value,
    };
    onChange({
      ...profile,
      socialLinks: next,
    });
  };

  const handleRemoveSocialLink = (index) => {
    onChange({
      ...profile,
      socialLinks: socialLinks.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Core Personal Identity ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] space-y-4">
        <h3 className="text-sm font-semibold text-white">Personal Identity</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/80 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a1e] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/80 mb-1.5">
              Display Name (Navbar)
            </label>
            <input
              type="text"
              value={profile.displayName || ""}
              onChange={(e) => handleChange("displayName", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a1e] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/80 mb-1.5">
              Role / Title
            </label>
            <input
              type="text"
              value={profile.role || ""}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a1e] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/80 mb-1.5">
              Hero Tagline
            </label>
            <input
              type="text"
              value={profile.tagline || ""}
              onChange={(e) => handleChange("tagline", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a1e] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
            />
          </div>
        </div>

        {/* Profile Avatar Upload */}
        <div className="pt-2 border-t border-[#222225]">
          <AdminImageUpload
            value={profile.avatar || ""}
            onChange={(url) => handleChange("avatar", url)}
            section="profile"
            label="Profile Avatar (Canonical Portrait)"
            description="Single canonical portrait image reused across Navbar, About Sticky Card, Discovery CTA, and Philosophy Quote."
            aspect="portrait"
          />
        </div>
      </div>

      {/* ── Direct Contact Channels ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] space-y-4">
        <h3 className="text-sm font-semibold text-white">Direct Contact Channels</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/80 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a1e] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/80 mb-1.5">
              Call Booking URL (Cal.com / Calendly)
            </label>
            <input
              type="url"
              value={profile.bookingUrl || ""}
              onChange={(e) => handleChange("bookingUrl", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a1e] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
            />
          </div>
        </div>
      </div>

      {/* ── Social Profiles (Canonical Single Source) ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#141416] border border-[#222225] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Social Profiles</h3>
            <p className="text-xs text-white/50">
              Canonical social channels powering Navbar quick icons, Contact dropdown, Profile pill, and Footer.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e90c47]/10 hover:bg-[#e90c47]/20 text-[#e90c47] text-xs font-semibold transition cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Social Link</span>
          </button>
        </div>

        {socialLinks.length === 0 ? (
          <p className="text-xs text-white/40 italic py-2">
            No social links configured. Click &ldquo;Add Social Link&rdquo; to add one.
          </p>
        ) : (
          <div className="space-y-3">
            {socialLinks.map((link, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1e] border border-[#2b2b30]"
              >
                <div className="w-40 shrink-0">
                  <select
                    value={link.platform || "instagram"}
                    onChange={(e) =>
                      handleUpdateSocialLink(idx, "platform", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                  >
                    {SUPPORTED_PLATFORMS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 min-w-0">
                  <input
                    type="url"
                    value={link.url || ""}
                    onChange={(e) =>
                      handleUpdateSocialLink(idx, "url", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#141416] border border-[#2b2b30] text-white text-xs focus:outline-none focus:border-[#e90c47] transition"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveSocialLink(idx)}
                  className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition"
                  aria-label="Delete link"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
