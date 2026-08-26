"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function RotatingWord({
  words = ["design", "create", "build"],
  interval = 1000,
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [words, interval]);

  return (
    <div className="relative h-[50px]">
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
          className="absolute font-microphone font-extralight tracking-wide text-accent"
        >
          {words[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
