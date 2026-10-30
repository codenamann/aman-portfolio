"use client";

import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

const Button = forwardRef(function Button(
  {
    type = "button",
    variant = "pill",
    color = "red",
    size = "default",
    magnetic = false,
    className = "",
    children,
    onMouseMove,
    onMouseLeave,
    ...props
  },
  ref
) {
  const buttonRef = useRef(null);
  useImperativeHandle(ref, () => buttonRef.current);

  const baseStyles =
    "group relative inline-flex items-center justify-center cursor-pointer select-none rounded-full transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  const variants = {
    pill: {
      red: cn(
        baseStyles,
        "bg-accent text-white font-bold tracking-wider",
        size === "compact"
          ? "px-3.5 sm:px-4 py-1.5 sm:py-[6px] text-xs sm:text-sm gap-2 sm:gap-2.5"
          : "px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm gap-2 sm:gap-2.5",
        "shadow-[inset_1px_1px_2px_rgba(255,255,255,0.5),0_6px_10px_color-mix(in_srgb,var(--color-accent)30%,transparent_0%)] hover:shadow-none hover:opacity-90"
      ),
      black: cn(
        baseStyles,
        "bg-[#141516] border border-white/10 text-white font-bold tracking-wider",
        size === "compact"
          ? "px-3.5 sm:px-4 py-1.5 sm:py-[6px] text-xs sm:text-sm gap-2 sm:gap-2.5"
          : "px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm gap-2 sm:gap-2.5",
        "shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),0_6px_10px_rgba(0,0,0,0.5)] hover:shadow-none hover:bg-white/10"
      ),
    },
    capsule:
      "h-8 px-3.5 rounded-full border border-white/15 bg-white/4 hover:bg-white/8 hover:border-accent/30 text-foreground/80 hover:text-accent text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-sm inline-flex items-center justify-center gap-2",
    default:
      "text-md font-normal text-foreground/80 hover:text-foreground transition-colors duration-200 cursor-pointer",
  };

  const isPill = variant === "pill";
  const styles = isPill
    ? variants.pill[color] || variants.pill.red
    : variants[variant] || variants.default;

  const handleMouseMove = (e) => {
    onMouseMove?.(e);
    if (!magnetic || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(buttonRef.current, {
      x: x * 0.28,
      y: y * 0.28,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (e) => {
    onMouseLeave?.(e);
    if (!magnetic || !buttonRef.current) return;
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.65,
      ease: "elastic.out(1, 0.4)",
    });
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onMouseMove={magnetic ? handleMouseMove : onMouseMove}
      onMouseLeave={magnetic ? handleMouseLeave : onMouseLeave}
      className={cn(styles, magnetic && "will-change-transform", className)}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
