"use client";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";

export default function HeroFace() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, {
    stiffness: 80,
    damping: 15,
    mass: 0.5,
  });

  const springY = useSpring(y, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // cursor position relative to viewport center
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;

      console.log("X", normalizedX);
      console.log("Y", normalizedY);

      // maximum movement of the face
      const maxX = 25;
      const maxY = 20;

      x.set(normalizedX * maxX);
      y.set(normalizedY * maxY);
    };

    document.addEventListener("pointermove", handleMouseMove, true);

    return () => {
      document.removeEventListener("pointermove", handleMouseMove, true);
    };
  }, [x, y]);

  return (
    <div className="absolute top-60 md:top-35 lg:bottom-5 xl:bottom-25 w-80 md:w-80 lg:w-110 xl:w-119 left-1/2 -translate-x-1/2 ">
      <motion.div
        style={{
          x: springX,
          y: springY,
        }}
      >
        <img src="/bitmoji-face.png" alt="bitmoji" className="w-full h-auto" />
      </motion.div>
    </div>
  );
}
