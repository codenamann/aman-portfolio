import { AlertCircle, RotateCcw } from "lucide-react";
import AdminButton from "./AdminButton";

/**
 * Standard Inline Error State Component for Admin Pages
 */
export default function AdminErrorState({
  title = "Unable to load data",
  description = "A database or network error occurred while loading this section.",
  onRetry = null,
  className = "",
}) {
  return (
    <div
      role="alert"
      className={`p-8 sm:p-12 rounded-2xl bg-[#151517] border border-[#262628] text-center flex flex-col items-center justify-center gap-3.5 my-6 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
        <AlertCircle size={22} />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-sm sm:text-base font-semibold text-[#f2f2f2] tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-[#a1a1a6] leading-relaxed">
          {description}
        </p>
      </div>
      {onRetry && (
        <div className="pt-2">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={onRetry}
            icon={<RotateCcw size={13} />}
          >
            Retry Request
          </AdminButton>
        </div>
      )}
    </div>
  );
}
