"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronsRight } from "lucide-react";

export default function OurStorySection() {
  return (
    <section id="our-story" className="relative bg-white md:pt-24 overflow-hidden">
      <div className="relative">
        {/* Full-bleed dark background photo + #000000BF overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-full min-h-[520px] md:min-h-[660px] flex items-center overflow-hidden"
        >
          <Image src="/images/our-story-bg.png" alt="" fill unoptimized className="object-cover" />
          <div className="absolute inset-0" style={{ backgroundColor: "#000000BF" }} />

          {/* Text content stays aligned with the rest of the site's content width */}
          <div className="container-fluid relative z-10 py-12 md:py-0">
            <div className="max-w-md">
              <p className="text-white/80 text-xs uppercase tracking-[3px] mb-3">About us</p>
              <h2 className="font-heading text-white text-3xl md:text-5xl mb-6">Our Story</h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
                Entice, KGK 1905&rsquo; is a captivating tale of exquisite designs, timeless
                creations, divine luxury narrated by an unparalleled legacy. It blends
                the highest form of aestheticism, elegance and style that reflects the
                rare combination of classical and contemporary influences.
              </p>
              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8">
                Entice Jewels manifests finesse, brought to life by international
                designers &amp; craftsmen with a promise of exclusivity that
                complements the conviction of the wearer.
              </p>
              <Link
                href="/about-us"
                className="inline-flex items-center gap-1 text-primary text-xs uppercase tracking-[2px] hover:gap-2 transition-all"
              >
                Know More <ChevronsRight size={14} />
              </Link>

              {/* Mobile: image stacked below the text, still inside this same
                  background panel (so the bg photo + overlay shows behind it too) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="zoom-hover md:hidden relative h-[260px] rounded-2xl overflow-hidden shadow-xl mt-5"
              >
                <Image
                  src="/images/our-story.png"
                  alt="Entice Jewels boutique — Our Story"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Story image — overlaps the panel's top-right on desktop, aligned to the
            same right offset as container-fluid's own padding, with hover zoom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="zoom-hover hidden md:block absolute -top-40 right-5 md:right-12 xl:right-20 z-20 w-[55%] h-[100%] overflow-hidden shadow-2xl"
        >
          <Image
            src="/images/our-story.png"
            alt="Entice Jewels boutique — Our Story"
            fill
            unoptimized
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
