"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { newsArticles, newsGallery } from "@/data/news";

export default function NewsEventsSection() {
  const loopGallery = [...newsGallery, ...newsGallery];

  return (
    <section id="news" className="relative overflow-hidden">
      <Image src="/images/news-bg.png" alt="" fill unoptimized className="object-cover" />

      <div className="relative z-10 grid md:grid-cols-2 min-h-[560px] md:min-h-[640px]">
        <div className="container-fluid md:pr-8 py-16 md:py-24 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-white/80 text-xs uppercase tracking-[3px] mb-3">Entice Coverage</p>
            <h2 className="font-heading text-white text-3xl md:text-5xl mb-8">News &amp; Events</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-8 mb-8">
            {newsArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
              >
                <p className="text-white/75 text-sm leading-relaxed">{article.text}</p>
              </motion.div>
            ))}
          </div>

        </div>

        <div className="relative h-[300px] sm:h-[360px] md:h-full overflow-hidden">
          <div className="absolute inset-0 marquee-track flex flex-col">
            {loopGallery.map((src, i) => (
              <div key={i} className="relative w-full h-[160px] md:h-[190px] flex-shrink-0">
                <Image src={src} alt={`Entice news ${i + 1}`} fill unoptimized className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
