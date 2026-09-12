import { Loader2 } from "lucide-react";

/**
 * Standardized Admin Loading Spinner State
 */
export default function AdminLoadingState({
  message = "Loading data...",
  className = "",
}) {
  return (
    <div
      className={`py-14 sm:py-20 flex flex-col items-center justify-center gap-2.5 text-[#a1a1a6] ${className}`}
    >
      <Loader2 size={24} className="animate-spin text-[#e90c47]" />
      <span className="text-xs font-medium text-[#6f6f76] font-mono">{message}</span>
    </div>
  );
}
