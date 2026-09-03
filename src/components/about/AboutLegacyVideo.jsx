"use client";

import { motion } from "framer-motion";
import LegacyMedia from "@/components/shared/LegacyMedia";

// Same legacy.mp4 footage as the home page's LegacyVideoSection, but with
// tighter top/bottom padding to fit the About Us page's tighter flow.
export default function AboutLegacyVideo({ media, videoUrl }) {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-5 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-full overflow-hidden shadow-xl bg-maroon"
        >
          <LegacyMedia media={media || (videoUrl ? { type: "hosted", url: videoUrl } : null)} title="An Exceptional Legacy" />
        </motion.div>
      </div>
    </section>
  );
}
