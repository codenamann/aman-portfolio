"use client";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";
import Image from "next/image";

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
    <div
      id="hero-face-wrapper"
      className="absolute top-60 md:top-35 lg:bottom-5 xl:bottom-25 w-80 md:w-80 lg:w-110 xl:w-119 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
    >
      <motion.div
        style={{
          x: springX,
          y: springY,
        }}
      >
        <Image
          src="/bitmoji-face.webp"
          alt="Aman Shrivastava - Creative Visual Identity"
          width={480}
          height={480}
          priority
          sizes="(max-width: 640px) 320px, (max-width: 1024px) 440px, 476px"
          className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] select-none"
        />
      </motion.div>
    </div>
  );
}

