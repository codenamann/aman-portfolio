"use client";

import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

/**
 * Standardized Dismissible Alert for Admin Feedback
 */
export default function AdminAlert({
  type = "info",
  message,
  onDismiss,
  className = "",
}) {
  if (!message) return null;

  const config = {
    success: {
      icon: CheckCircle2,
      containerClass: "bg-emerald-950/30 border-emerald-500/30 text-emerald-300",
      iconClass: "text-emerald-400",
    },
    error: {
      icon: AlertCircle,
      containerClass: "bg-rose-950/30 border-rose-500/30 text-rose-300",
      iconClass: "text-rose-400",
    },
    warning: {
      icon: AlertTriangle,
      containerClass: "bg-amber-950/30 border-amber-500/30 text-amber-300",
      iconClass: "text-amber-400",
    },
    info: {
      icon: Info,
      containerClass: "bg-blue-950/30 border-blue-500/30 text-blue-300",
      iconClass: "text-blue-400",
    },
  }[type] || {
    icon: Info,
    containerClass: "bg-zinc-900 border-white/10 text-zinc-300",
    iconClass: "text-zinc-400",
  };

  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`p-3.5 sm:p-4 rounded-xl border text-xs flex items-start gap-2.5 break-words ${config.containerClass} ${className}`}
    >
      <Icon size={16} className={`shrink-0 mt-0.5 ${config.iconClass}`} />
      <div className="flex-1 leading-relaxed">{message}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="p-1 hover:bg-white/10 rounded transition-colors shrink-0"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
