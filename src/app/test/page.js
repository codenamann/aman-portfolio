"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function Test() {
    const targetRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"],
    });

    const rotate = useTransform(scrollYProgress, [0, 0.8], [-15, 0]);

    return (
        <div>
            <div style={{ height: "100vh" }} />
            <div ref={targetRef} className="flex items-center" style={{ height: "100vh" }}>
                <motion.div style={{ rotate, fontSize: 32 }}>
                    rotating box
                </motion.div>
            </div>
            <div style={{ height: "100vh" }} />
        </div>
    );
}