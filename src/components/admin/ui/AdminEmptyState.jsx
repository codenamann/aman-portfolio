import { Inbox } from "lucide-react";

/**
 * Standardized Admin Empty State Component
 */
export default function AdminEmptyState({
  icon: Icon = Inbox,
  title = "No items found",
  description = "No items match your criteria or none have been created yet.",
  action,
  className = "",
}) {
  return (
    <div
      className={`py-12 sm:py-16 px-4 text-center flex flex-col items-center justify-center gap-2.5 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#18181a] border border-[#262628] flex items-center justify-center text-[#6f6f76] mb-1">
        <Icon size={22} />
      </div>
      <h4 className="text-sm font-semibold text-[#f2f2f2]">{title}</h4>
      {description && (
        <p className="text-xs text-[#a1a1a6] max-w-sm leading-relaxed font-sans">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
