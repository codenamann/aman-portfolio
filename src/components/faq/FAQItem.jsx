"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Reusable, accessible FAQ item component with smooth accordion animation
 */
export default function FAQItem({
  item,
  index,
  isOpen = false,
  onToggle,
  className = "",
}) {
  if (!item) return null;

  const formattedNumber = String(index + 1).padStart(2, "0");
  const controlId = `faq-answer-${item.id || index}`;
  const headerId = `faq-header-${item.id || index}`;

  return (
    <div
      className={`w-full rounded-[20px] bg-[#18181b] border transition-colors ${
        isOpen ? "border-[#27272a] shadow-lg" : "border-[#27272a] hover:border-[#38383e]"
      } ${className}`}
    >
      {/* ── Accordion Header Button ────────────────────────────────────── */}
      <button
        id={headerId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={controlId}
        className="w-full px-5 sm:px-6 py-4.5 sm:py-5 flex items-center justify-between text-left cursor-pointer select-none group"
      >
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-2">
          {/* Automatic 2-digit Number */}
          <span className="font-bold text-sm sm:text-[15px] text-foreground/50 w-6 sm:w-7 shrink-0">
            {formattedNumber}
          </span>

          {/* Question Text */}
          <h3 className="font-bold text-[15px] sm:text-[17px] text-foreground tracking-tight leading-snug">
            {item.question}
          </h3>
        </div>

        {/* Plus / Minus Morphing Toggle Icon */}
        <span
          className="text-foreground/70 group-hover:text-foreground shrink-0 w-6 h-6 flex items-center justify-center relative"
          aria-hidden="true"
        >
          {/* Horizontal line */}
          <span
            className={`absolute w-3.5 h-[1.5px] bg-current transition-transform duration-300 ease-out ${
              isOpen ? "rotate-180" : ""
            }`}
          />
          {/* Vertical line */}
          <span
            className={`absolute h-3.5 w-[1.5px] bg-current transition-all duration-300 ease-out ${
              isOpen ? "rotate-90 opacity-0" : ""
            }`}
          />
        </span>
      </button>

      {/* ── Accordion Answer Region ────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={controlId}
            role="region"
            aria-labelledby={headerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.25, delay: 0.05, ease: "linear" },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.15, ease: "linear" },
              },
            }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm sm:text-[15px] text-foreground/75 leading-relaxed font-normal">
              <p>{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
