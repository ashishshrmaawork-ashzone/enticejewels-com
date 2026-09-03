"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronsRight } from "lucide-react";
import { getNewsEvents } from "@/lib/api";

export default function NewsEventsSection({ eyebrow, title, items = [], posts = [] }) {
  const [livePosts, setLivePosts] = useState(posts);
  useEffect(() => {
    let active = true;
    getNewsEvents().then((fresh) => { if (active) setLivePosts(fresh); }).catch(() => {});
    return () => { active = false; };
  }, []);
  const textItems = items.length ? items.slice(0, 2) : livePosts.slice(0, 2).map((post) => post.excerpt).filter(Boolean);
  const images = livePosts.filter((post) => post.image?.url);
  const gallery = images.length ? Array.from({ length: 4 }, (_, index) => images[index % images.length]) : [];

  return (
    <section id="news" className="relative overflow-hidden bg-[#41231f]">
      <div className="grid md:grid-cols-2 min-h-[600px] md:min-h-[640px]">
        <div className="relative flex items-center overflow-hidden">
          <Image src="/images/news-bg.png" alt="" fill unoptimized className="object-cover opacity-45" />
          <div className="absolute inset-0 bg-[#492923]/75" />
          <div className="container-fluid relative z-10 py-16 md:py-24">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p className="text-white/85 text-xs uppercase tracking-[3px] mb-3">{eyebrow || "Entice Coverage"}</p>
              <h2 className="font-heading text-white text-4xl md:text-5xl mb-8 md:mb-9">{title || "News & Events"}</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-7 sm:gap-10">
              {textItems.map((content, index) => <motion.p key={index} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: index * 0.12 }} className="text-white/90 text-sm leading-[1.65]">{content}</motion.p>)}
            </div>
            <Link href="/news" className="mt-9 inline-flex w-fit items-center gap-1 text-xs uppercase tracking-[2px] text-white transition-all hover:gap-2 hover:text-primary">
              View All News <ChevronsRight size={13} />
            </Link>
          </div>
        </div>

        <div className="relative h-[440px] md:h-auto min-h-0 overflow-hidden bg-[#2d1b18]">
          {gallery.length ? (
            <div className="marquee-track absolute inset-x-0 top-0 grid h-[200%] grid-rows-8 will-change-transform">
              {[...gallery, ...gallery].map((post, index) => (
                <div key={`${post.id}-${index}`} className="relative min-h-0 overflow-hidden group">
                  <Image src={post.image.url} alt={post.image.alt || post.title} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              ))}
            </div>
          ) : (
            <div className="absolute inset-0"><Image src="/images/news-bg.png" alt="" fill unoptimized className="object-cover" /></div>
          )}
        </div>
      </div>
    </section>
  );
}
