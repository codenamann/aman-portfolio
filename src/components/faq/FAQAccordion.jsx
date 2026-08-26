"use client";

import React, { useState } from "react";
import FAQItem from "./FAQItem";

/**
 * Reusable FAQ Accordion container managing open/closed item states
 */
export default function FAQAccordion({ items = [], className = "" }) {
  // First item open by default as shown in the visual reference
  const [openIndex, setOpenIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={`flex flex-col gap-3 sm:gap-3.5 w-full ${className}`}>
      {items.map((item, index) => (
        <FAQItem
          key={item.id || index}
          item={item}
          index={index}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}
