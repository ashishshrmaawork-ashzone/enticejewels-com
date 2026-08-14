"use client";

import { motion } from "framer-motion";

// Fixed height so every inner-page banner is identical, edge to edge.
// Same slow Ken-Burns zoom as the home page hero — background sits in its
// own layer so the zoom never crops/shifts the image away from bg-top.
export default function PageHero({ image, alt = "", height = "h-[420px] sm:h-[520px] md:h-[662px]", children }) {
  return (
    <section role="img" aria-label={alt} className={`relative w-full ${height} overflow-hidden bg-maroon`}>
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{ duration: 14, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute inset-0 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" />
      {children && (
        <div className="relative z-10 h-full flex items-end pb-10 md:pb-14">
          <div className="container mx-auto px-5 sm:px-6 md:px-8 mix-blend-exclusion">{children}</div>
        </div>
      )}
    </section>
  );
}
