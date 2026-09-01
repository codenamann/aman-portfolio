"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export default function CursorBall() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, {
    stiffness: 120,
    damping: 12,
    mass: 0.5,
  });

  const y = useSpring(mouseY, {
    stiffness: 100,
    damping: 15,
    mass: 0.2,
  });

  const xOffset = useTransform(x, (value) => value + 18);
  const yOffset = useTransform(y, (value) => value + 33);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="hidden lg:block fixed w-4 h-4 rounded-full bg-accent z-[9999] pointer-events-none mix-blend-exclusion"
      style={{
        x: xOffset,
        y: yOffset,
        translateX: "-50%",
        translateY: "-50%",
      }}
    ></motion.div>
  );
}
