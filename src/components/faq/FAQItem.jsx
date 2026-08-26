import React from "react";

/**
 * Reusable, accessible FAQ item component
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

        {/* Plus / Minus Toggle Icon */}
        <span
          className="text-foreground/70 group-hover:text-foreground text-xl sm:text-2xl font-light leading-none shrink-0 w-6 h-6 flex items-center justify-center transition-colors"
          aria-hidden="true"
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {/* ── Accordion Answer Region ────────────────────────────────────── */}
      {isOpen && (
        <div
          id={controlId}
          role="region"
          aria-labelledby={headerId}
          className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm sm:text-[15px] text-foreground/75 leading-relaxed font-normal"
        >
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  );
}
