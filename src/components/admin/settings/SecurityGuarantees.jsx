import { ShieldCheck } from "lucide-react";

/**
 * Security & Architectural Guarantees Summary Card Component
 */
export default function SecurityGuarantees() {
  const guarantees = [
    {
      title: "Zero-Trust Server Authorization",
      detail:
        "Every API Route Handler independently verifies the 5-day HTTP-only session cookie and cross-references against ADMIN_EMAILS.",
    },
    {
      title: "Strict 4+4 Featured Slots",
      detail:
        "Atomic Firestore transactions guarantee max 4 Short-Form and max 4 Long-Form showcase items at all times.",
    },
    {
      title: "5-Slot Showcase Isolation",
      detail:
        "The Projects Archive showcase strictly enforces format constraints and deduplication with independent format ordering.",
    },
    {
      title: "SSRF-Safe YouTube Ingestion",
      detail:
        "Hostname validation blocks SSRF, internal network traversal, and non-HTTPS protocols.",
    },
    {
      title: "Zero-Fallback Projects",
      detail:
        "Projects are queried strictly from live Firestore at runtime without static fallbacks.",
    },
  ];

  return (
    <div className="p-4 sm:p-6 rounded-xl bg-[#151517] border border-[#262628] shadow-[0_1px_3px_rgba(0,0,0,0.5)] space-y-3">
      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#a1a1a6] font-mono flex items-center gap-2">
        <ShieldCheck size={16} className="text-[#e90c47] shrink-0" />
        <span>Security & Architectural Guarantees</span>
      </h3>
      <ul className="text-xs text-[#a1a1a6] space-y-2.5 list-disc list-inside leading-relaxed">
        {guarantees.map((g) => (
          <li key={g.title}>
            <strong className="text-[#f2f2f2]">{g.title}:</strong> {g.detail}
          </li>
        ))}
      </ul>
    </div>
  );
}
