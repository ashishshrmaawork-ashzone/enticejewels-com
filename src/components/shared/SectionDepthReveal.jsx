"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

export default function SectionDepthReveal({ children }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 96%", "start 32%"],
  });

  const rawScale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const rawRotateX = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const rawY = useTransform(scrollYProgress, [0, 1], [64, 0]);
  const spring = { stiffness: 130, damping: 24, mass: 0.5 };
  const scale = useSpring(rawScale, spring);
  const rotateX = useSpring(rawRotateX, spring);
  const y = useSpring(rawY, spring);

  return (
    <div ref={ref} style={{ perspective: 1400 }}>
      <motion.div
        style={reduceMotion ? undefined : { scale, rotateX, y, transformOrigin: "center top" }}
        className="will-change-transform [transform-style:preserve-3d]"
      >
        {children}
      </motion.div>
    </div>
  );
}
