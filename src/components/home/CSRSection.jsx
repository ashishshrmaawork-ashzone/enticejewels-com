"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function CSRSection({ eyebrow, title, subtitle, items }) {
  const swiperRef = useRef(null);
  const slides = items?.length ? items.map((item) => ({
    id: item.slug,
    title: item.title,
    image: item.image?.url || "/images/csr-1.png",
    description: item.excerpt || item.content,
  })) : [];

  if (!slides.length) return null;

  return (
    <section id="csr" className="relative bg-white">
      <div className="absolute top-0 left-0 right-0 h-[420px] md:h-[520px] overflow-hidden">
        <Image src="/images/csr-bg.png" alt="" fill unoptimized className="object-cover" />
      </div>

      <div className="relative z-10 container-fluid text-center pt-16 md:pt-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-white/85 text-xs uppercase tracking-[3px] mb-3"
        >
          {eyebrow || "Our CSR"}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-white text-3xl md:text-5xl leading-tight"
        >
          {title || "Giving Back —"}<br className="hidden md:block" /> {subtitle || "A Sense of Responsibility"}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative bg-white max-w-4xl mx-auto mt-8 sm:mt-10 md:mt-14 px-4 sm:px-10 md:px-14 pt-8 sm:pt-10 md:pt-14 pb-10 sm:pb-12 md:pb-16"
        >
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={28}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 2 } }}
          >
            {slides.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="bw-hover group cursor-pointer text-center">
                  <Link href={`/csr/${item.id}`} className="relative block aspect-[4/3] overflow-hidden">
                    <Image src={item.image} alt={item.title} fill unoptimized className="object-cover" />
                  </Link>
                  <h3 className="font-body mt-5 text-maroon text-sm uppercase tracking-[2px] font-semibold">
                    <Link href={`/csr/${item.id}`} className="hover:text-primary transition-colors">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-ink-soft text-sm leading-relaxed">{item.description}</p>
                  <Link
                    href={`/csr/${item.id}`}
                    className="mt-3 inline-flex items-center justify-center gap-1 text-primary text-xs uppercase tracking-[2px] group-hover:gap-2 transition-all"
                  >
                    Read More <ChevronsRight size={13} />
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous"
            className="absolute left-0.5 sm:left-2 md:left-4 top-[38%] -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/85 shadow-sm text-black/70 hover:text-primary transition-colors duration-300 z-10"
          >
            <ChevronLeft size={26} />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next"
            className="absolute right-0.5 sm:right-2 md:right-4 top-[38%] -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/85 shadow-sm text-black/70 hover:text-primary transition-colors duration-300 z-10"
          >
            <ChevronRight size={26} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
