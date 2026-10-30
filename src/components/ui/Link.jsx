"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

export default function Link({
  href,
  variant = "default",
  color = "red",
  className = "",
  children,
  ...props
}) {
  const linkRef = useRef(null);

  const variants = {
    default:
      "text-md font-normal text-foreground/80 hover:text-foreground transition-colors duration-400",
    pill: {
      black:
        "inline-block px-4.5 py-2 md:px-4 md:py-[5px] leading-tight text-md shadow-[inset_1px_1px_2px_rgba(255,255,255,0.5),0_6px_10px_color-mix(in_srgb,var(--color-accent)30%,transparent_0%)] hover:shadow-none font-medium text-white bg-accent rounded-full hover:opacity-90",
      red: "inline-block px-4.5 py-2 md:px-4 md:py-[5px] leading-tight text-md shadow-[inset_1px_1px_2px_rgba(255,255,255,0.5),0_6px_10px_color-mix(in_srgb,var(--color-accent)30%,transparent_0%)] hover:shadow-none font-medium text-white bg-accent rounded-full hover:opacity-90",
    },
  };

  const isPill = variant === "pill";
  const styles = isPill ? variants.pill[color] : variants[variant];

  const handleMouseMove = (e) => {
    if (!isPill || !linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(linkRef.current, {
      x: x * 0.28,
      y: y * 0.28,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!isPill || !linkRef.current) return;
    gsap.to(linkRef.current, {
      x: 0,
      y: 0,
      duration: 0.65,
      ease: "elastic.out(1, 0.4)",
    });
  };

  return (
    <a
      ref={linkRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(styles, "text-md sm:text-md will-change-transform", className)}
      {...props}
    >
      {children}
    </a>
  );
}
