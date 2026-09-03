"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function FeaturedCarousel({ title = "More Featured Products", items }) {
  const swiperRef = useRef(null);

  if (!items?.length) return null;

  return (
    <section className="pb-16 md:pb-24">
      <div className="container mx-auto px-5 sm:px-6 md:px-8">
        <p className="text-ink-soft text-xs md:text-sm uppercase tracking-[3px] mb-6">{title}</p>

        <div className="relative">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={12}
            slidesPerView={1.35}
            breakpoints={{ 480: { slidesPerView: 2, spaceBetween: 20 }, 768: { slidesPerView: 3, spaceBetween: 28 } }}
          >
            {items.map((item) => (
              <SwiperSlide key={item.href}>
                <Link href={item.href} className="group relative block aspect-[12/13] rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  <span className="absolute bottom-4 left-0 right-0 text-center font-heading text-white text-lg md:text-xl">
                    {item.name}
                  </span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous"
            className="absolute left-1 md:-left-10 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-auto md:h-auto rounded-full md:rounded-none bg-white/90 md:bg-transparent shadow-md md:shadow-none flex items-center justify-center text-black hover:text-primary transition-colors duration-300"
          >
            <ChevronLeft size={26} strokeWidth={3} />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next"
            className="absolute right-1 md:-right-10 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-auto md:h-auto rounded-full md:rounded-none bg-white/90 md:bg-transparent shadow-md md:shadow-none flex items-center justify-center text-black hover:text-primary transition-colors duration-300"
          >
            <ChevronRight size={26} strokeWidth={3} />
          </button>
        </div>
      </div>
    </section>
  );
}
