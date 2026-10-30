/**
 * Standardized Status Badge for Admin Panel
 * Supports format, publication status, featured status, and mode badges with solid tones.
 */
export default function AdminStatusBadge({
  type = "default",
  children,
  className = "",
}) {
  const styles = {
    // Formats
    "short-form": "bg-[#18181a] text-zinc-300 border border-[#262628]",
    "long-form": "bg-[#18181a] text-zinc-300 border border-[#262628]",

    // Publication Status (2 states: active published vs muted draft)
    published: "bg-[#064e3b]/80 text-[#6ee7b7] border border-[#059669]/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] font-medium",
    draft: "bg-[#18181a] text-zinc-400 border border-[#262628]",
    archived: "bg-[#18181a] text-[#6f6f76] border border-[#262628]",

    // Featured / Spotlight (clean neutral active)
    featured: "bg-[#1f1f22] text-white border border-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] font-medium",
    spotlight: "bg-[#1f1f22] text-white border border-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] font-medium",

    // Modes
    automatic: "bg-[#18181a] text-zinc-400 border border-[#262628]",
    manual: "bg-[#1f1f22] text-white border border-zinc-700 font-medium",
    missing: "bg-[#18181a] text-rose-400 border border-rose-900/40",

    // Default Neutral
    default: "bg-[#18181a] text-[#a1a1a6] border border-[#262628]",
  }[type] || "bg-[#18181a] text-[#a1a1a6] border border-[#262628]";

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-md uppercase tracking-wider ${styles} ${className}`}
    >
      {children}
    </span>
  );
}
