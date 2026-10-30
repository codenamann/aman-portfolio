"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import localFont from "next/font/local";

const microphoneCheck = localFont({
  src: "../../fonts/Microphone-Check.woff2",
  display: "swap",
});

export default function RotatingWord({
  words = ["design", "create", "build"],
  interval = 1000,
}) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    let intervalId = null;

    const startTimer = () => {
      if (!intervalId) {
        intervalId = setInterval(() => {
          setIndex((i) => (i + 1) % words.length);
        }, interval);
      }
    };

    const stopTimer = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // IntersectionObserver: only ticks the interval when footer is actually in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          startTimer();
        } else {
          stopTimer();
        }
      },
      { rootMargin: "100px 0px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      stopTimer();
      observer.disconnect();
    };
  }, [words, interval]);

  return (
    <div ref={containerRef} className="relative h-[50px]">
      <AnimatePresence>
        <motion.div
          key={words[index]}
          initial={{ opacity: 0, filter: "blur(3px)", y: 40 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{
            opacity: 0,
            filter: "blur(3px)",
            y: -60,
            transition: { duration: 0.4 },
          }}
          transition={{ duration: 0.5 }}
          className={`absolute ${microphoneCheck.className} font-medium tracking-wide text-[#ff2d55]`}
        >
          {words[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
