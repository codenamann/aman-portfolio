"use client";

import { Loader2, Check } from "lucide-react";

/**
 * Standardized Admin Button Primitive with built-in mutation lifecycle states
 */
export default function AdminButton({
  children,
  variant = "primary", // "primary" | "secondary" | "danger" | "ghost"
  size = "md", // "sm" | "md" | "lg"
  loading = false,
  success = false,
  loadingText,
  successText = "Saved",
  icon = null,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  const isBusy = loading || success;
  const isDisabled = disabled || isBusy;

  const baseStyles =
    "inline-flex items-center justify-center font-medium font-sans rounded-xl transition cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden";

  const sizeStyles = {
    sm: "min-h-[36px] px-3 py-1.5 text-xs gap-1.5",
    md: "min-h-[42px] px-4 py-2 text-xs sm:text-sm gap-2",
    lg: "min-h-[48px] px-5 py-2.5 text-sm gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#e90c47] hover:bg-[#d00a3e] active:bg-[#ba0938] text-white focus:ring-1 focus:ring-[#e90c47]/50 shadow-sm",
    secondary:
      "bg-[#18181a] hover:bg-[#1f1f22] active:bg-[#242428] text-[#f2f2f2] border border-[#262628] focus:border-[#333338]",
    danger:
      "bg-[#f43f5e]/15 hover:bg-[#f43f5e]/25 text-[#f43f5e] border border-[#f43f5e]/30 focus:border-[#f43f5e]",
    ghost:
      "bg-transparent hover:bg-[#18181a] text-[#a1a1a6] hover:text-[#f2f2f2] focus:bg-[#18181a]",
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={size === "sm" ? 13 : 15} className="animate-spin shrink-0" />
          <span>{loadingText || children}</span>
        </>
      ) : success ? (
        <>
          <Check size={size === "sm" ? 13 : 15} className="text-emerald-400 shrink-0" />
          <span>{successText}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
