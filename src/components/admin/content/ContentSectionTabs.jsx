import Link from "next/link";
import { CONTENT_SECTIONS } from "@/lib/constants/limits";

export const CONTENT_SECTION_CONFIG = [
  { key: CONTENT_SECTIONS.PROFILE, label: "Profile & Identity" },
  { key: CONTENT_SECTIONS.ABOUT, label: "About Bio & History" },
  { key: CONTENT_SECTIONS.SERVICES, label: "Services" },
  { key: CONTENT_SECTIONS.CREATIVE_TOOLS, label: "Creative Tools" },
  { key: CONTENT_SECTIONS.TESTIMONIALS, label: "Testimonials" },
  { key: CONTENT_SECTIONS.VIEWER_REACTIONS, label: "Viewer Reactions" },
  { key: CONTENT_SECTIONS.SOCIAL_PROOF, label: "Social Proof & Logos" },
  { key: CONTENT_SECTIONS.FAQS, label: "FAQs & Discovery CTA" },
  { key: CONTENT_SECTIONS.QUOTE, label: "Philosophy Quote" },
];

/**
 * Horizontal Scrollable Tabs for Content Sections
 */
export default function ContentSectionTabs({ activeSection }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2.5 border-b border-[#262628] no-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
      {CONTENT_SECTION_CONFIG.map((sec) => {
        const isActive = sec.key === activeSection;
        return (
          <Link
            key={sec.key}
            href={`/admin/content?section=${sec.key}`}
            className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center shrink-0 ${
              isActive
                ? "bg-[#e90c47] text-white shadow-xs"
                : "bg-[#151517] text-[#a1a1a6] hover:text-[#f2f2f2] hover:bg-[#18181a] border border-[#262628]"
            }`}
          >
            {sec.label}
          </Link>
        );
      })}
    </div>
  );
}

