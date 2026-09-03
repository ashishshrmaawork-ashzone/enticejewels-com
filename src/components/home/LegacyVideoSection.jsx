"use client";

import { motion } from "framer-motion";
import LegacyMedia from "@/components/shared/LegacyMedia";

export default function LegacyVideoSection({ media, videoUrl }) {
  return (
    <section id="legacy" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-5 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-full overflow-hidden shadow-xl bg-maroon"
        >
          <LegacyMedia media={media || (videoUrl ? { type: "hosted", url: videoUrl } : null)} />
        </motion.div>
      </div>
    </section>
  );
}
