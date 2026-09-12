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
    "short-form": "bg-[#271d3b] text-[#d8b4fe] border border-[#3b2a5c]",
    "long-form": "bg-[#172554] text-[#93c5fd] border border-[#1e3a8a]",

    // Publication Status
    published: "bg-[#064e3b] text-[#6ee7b7] border border-[#047857]",
    draft: "bg-[#451a03] text-[#fcd34d] border border-[#78350f]",
    archived: "bg-[#18181a] text-[#a1a1a6] border border-[#262628]",

    // Featured / Spotlight
    featured: "bg-[#4c0519] text-[#fda4af] border border-[#881337] font-semibold",
    spotlight: "bg-[#451a03] text-[#fcd34d] border border-[#78350f] font-semibold",

    // Modes
    automatic: "bg-[#064e3b] text-[#6ee7b7] border border-[#047857]",
    manual: "bg-[#451a03] text-[#fcd34d] border border-[#78350f]",
    missing: "bg-[#4c0519] text-[#fda4af] border border-[#881337]",

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
