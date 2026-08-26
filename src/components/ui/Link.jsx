import React from "react";
import { cn } from "@/lib/utils";

export default function Link({
  href,
  variant = "default",
  color = "red",
  className = "",
  children,
  ...props
}) {
  const variants = {
    default:
      "text-md font-normal text-foreground/80 hover:text-foreground transition-colors duration-400",
    pill: {
      black:
        "px-4.5 py-2 md:px-4 md:py-[5px] leading-tight text-md shadow-[inset_1px_1px_2px_rgba(255,255,255,0.5),0_6px_10px_color-mix(in_srgb,var(--color-accent)30%,transparent_0%)] hover:shadow-none font-normal text-foreground/95 bg-accent rounded-full transition-all hover:opacity-90",
      red: "px-4.5 py-2 md:px-4 md:py-[5px] leading-tight text-md shadow-[inset_1px_1px_2px_rgba(255,255,255,0.5),0_6px_10px_color-mix(in_srgb,var(--color-accent)30%,transparent_0%)] hover:shadow-none font-normal text-foreground/95 bg-accent rounded-full transition-all hover:opacity-90",
    },
  };

  const styles = variant == "pill" ? variants.pill[color] : variants[variant];

  return (
    <a
      href={href}
      className={cn(styles, "text-md sm:text-md", className)}
      {...props}
    >
      {children}
    </a>
  );
}
