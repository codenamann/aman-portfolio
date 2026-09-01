"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Mail, ArrowRight, ChevronDown } from "lucide-react";
import { FaInstagram } from "react-icons/fa6";
import { person } from "@/data/person";

export default function ContactDropdown({
  buttonLabel = "BOOK",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const contactOptions = [
    {
      id: "call",
      label: "Book a call",
      href: person.call?.href || "https://cal.com",
      icon: Calendar,
      isExternal: true,
    },
    {
      id: "instagram",
      label: "Message on Instagram",
      href:
        person.instagram?.dmHref ||
        person.instagram?.href ||
        "https://www.instagram.com/amann.createss?igsi=eWpkbGR6YjlzYzg=",
      icon: FaInstagram,
      isExternal: true,
    },
    {
      id: "email",
      label: "Email",
      href: person.email?.href || "mailto:shrivastavaaman176@gmail.com",
      icon: Mail,
      isExternal: false,
    },
  ];

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* ── Trigger Button: "BOOK ⚪ ⌄" ─────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="group relative cursor-pointer select-none rounded-full bg-accent px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold tracking-wider text-white shadow-md shadow-accent/25 transition-all duration-200 hover:brightness-110 active:scale-95 flex items-center gap-2 sm:gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="leading-none">{buttonLabel}</span>

        {/* Pulsing White Indicator Dot */}
        <span className="relative flex h-2 w-2 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>

        {/* Animated Chevron Icon */}
        <ChevronDown
          size={15}
          className={`shrink-0 transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
        />
      </button>

      {/* ── Floating Accordion / Dropdown Menu Card ─────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.2,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
            exit={{
              opacity: 0,
              y: -6,
              scale: 0.96,
              transition: {
                duration: 0.15,
                ease: "easeInOut",
              },
            }}
            className="absolute -right-2 top-full mt-3.5 z-50 w-72 sm:w-80 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 border border-muted/20 backdrop-blur-[20px] bg-background/50 shadow-2xl shadow-black/80"
            role="menu"
            aria-orientation="vertical"
          >
            <div className="flex flex-col gap-1">
              {contactOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <a
                    key={option.id}
                    href={option.href}
                    target={option.isExternal ? "_blank" : undefined}
                    rel={option.isExternal ? "noopener noreferrer" : undefined}
                    onClick={() => setIsOpen(false)}
                    role="menuitem"
                    className="group flex items-center justify-between gap-3 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 transition-colors duration-150 hover:bg-white/[0.06] text-foreground"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Circular icon badge */}
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-colors duration-200 group-hover:border-accent/60 group-hover:bg-accent/10">
                        <IconComponent className="h-4 w-4 text-foreground/80 transition-colors duration-200 group-hover:text-accent" />
                      </div>

                      {/* Option Label */}
                      <span className="truncate text-sm sm:text-[15px] font-medium tracking-tight text-foreground/90 transition-colors group-hover:text-foreground">
                        {option.label}
                      </span>
                    </div>

                    {/* Right Arrow */}
                    <ArrowRight className="h-4 w-4 text-muted/60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-foreground shrink-0" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
