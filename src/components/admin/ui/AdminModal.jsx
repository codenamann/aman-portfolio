"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/**
 * Shared Accessible Admin Modal
 * Uses Level 3 dark depth elevation and solid surface tones with restrained 180ms entry/exit.
 */
export default function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-xl",
  footer,
}) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{
              opacity: shouldReduceMotion ? 1 : 0,
              scale: shouldReduceMotion ? 1 : 0.98,
              y: shouldReduceMotion ? 0 : 4,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.98,
              y: shouldReduceMotion ? 0 : 4,
            }}
            transition={{
              duration: 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`bg-[#151517] border border-[#262628] rounded-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden`}
            style={{
              boxShadow: "0 12px 32px 0 rgba(0, 0, 0, 0.65), 0 4px 8px 0 rgba(0, 0, 0, 0.4)",
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#262628] bg-[#18181a] shrink-0">
              <div className="min-w-0 flex-1 pr-2">
                <h3 className="text-sm sm:text-base font-semibold text-[#f2f2f2] truncate">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-[#a1a1a6] mt-0.5 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="min-w-[36px] min-h-[36px] rounded-lg text-[#a1a1a6] hover:text-[#f2f2f2] hover:bg-[#1f1f22] flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {children}
            </div>

            {/* Footer Actions if present */}
            {footer && (
              <div className="p-3.5 sm:p-4 border-t border-[#262628] bg-[#18181a] flex items-center justify-end gap-2 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
