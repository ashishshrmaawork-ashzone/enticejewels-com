"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { products } from "@/data/products";

export default function ProductSlider({
  sectionClassName = "pb-12 md:pt-10 md:pb-24",
}) {
  const swiperRef = useRef(null);

  return (
    <section className={`bg-white ${sectionClassName}`}>
      <div className="container mx-auto px-5 sm:px-6 md:px-8">
      <div className="relative -mr-5 sm:mr-0">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          spaceBetween={12}
          slidesPerView={2.2}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 40 },
          }}
          className="entice-swiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <Link href={`/collections/entice-fashion/${product.categorySlug}`} className="group block cursor-pointer">
                <div className="relative aspect-square rounded-lg border border-black/10 bg-[#f7f6f4] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.label}
                    fill
                    unoptimized
                    className="object-contain  transition-opacity duration-500 group-hover:opacity-0"
                  />
                  <Image
                    src={product.hoverImage}
                    alt={`${product.label} styled`}
                    fill
                    unoptimized
                    className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>
                <p className="pt-4 text-sm uppercase tracking-wide" style={{ color: "#232020" }}>
                  {product.label}
                </p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous product"
          className="absolute left-1 md:-left-10 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-auto md:h-auto rounded-full md:rounded-none bg-white/85 md:bg-transparent shadow md:shadow-none hidden md:flex items-center justify-center text-black hover:text-primary transition-colors duration-300"
        >
          <ChevronLeft size={26} strokeWidth={3} />
        </button>
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next product"
          className="absolute right-1 md:-right-10 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-auto md:h-auto rounded-full md:rounded-none bg-white/85 md:bg-transparent shadow md:shadow-none hidden md:flex items-center justify-center text-black hover:text-primary transition-colors duration-300"
        >
          <ChevronRight size={26} strokeWidth={3} />
        </button>
      </div>
      </div>
    </section>
  );
}
