"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

/**
 * Editorial Fast Page Transition for Admin Panel
 * Provides a subtle 180ms opacity + 6px translateY transition
 * when navigating between admin routes, with zero layout shift.
 */
export default function AdminPageTransition({ children }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={{
        opacity: shouldReduceMotion ? 1 : 0,
        y: shouldReduceMotion ? 0 : 6,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.18,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full min-w-0 flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
