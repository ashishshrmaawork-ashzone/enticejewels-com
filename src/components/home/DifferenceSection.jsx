"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { differences } from "@/data/differences";

export default function DifferenceSection() {
  const swiperRef = useRef(null);

  return (
    <section id="difference" className="bg-white">
      <div className="text-center pt-16 md:pt-20 pb-8 md:pb-10">
        <p className="text-primary text-xs uppercase tracking-[3px] mb-3">Entice Uniqueness</p>
        <h2 className="font-heading text-maroon text-3xl md:text-5xl">What makes us different!</h2>
      </div>

      <div className="relative">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop
          speed={900}
          className="h-[560px] sm:h-[520px] md:h-[600px]"
        >
          {differences.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="relative h-full w-full">
                <Image src={item.image} alt={item.title} fill unoptimized className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/5 to-transparent" />

                <div className="relative z-10 h-full flex items-center">
                  <div className="container-fluid">
                    <h3 className="font-heading text-white text-2xl sm:text-3xl md:text-4xl leading-tight mb-5">
                      {item.title.split("\n").map((line, i, arr) => (
                        <span key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </span>
                      ))}
                    </h3>
                    <p className="text-white/85 text-sm leading-relaxed mb-6 sm:mb-8 max-w-md line-clamp-6 md:line-clamp-none min-h-[120px] sm:min-h-[100px] md:min-h-0">
                      {item.description}
                    </p>
                    <button
                      style={{ backgroundColor: "#F3DF9E", color: "#232020", fontWeight: 600 }}
                      className="text-xs uppercase tracking-[2px] px-7 py-3 rounded hover:opacity-90 transition-opacity duration-300"
                    >
                      View More
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom nav — full-bleed divider line, arrows layered on top of it */}
        <div className="absolute bottom-8 md:bottom-10 left-0 right-0 z-20">
          <div className="w-full h-px bg-white/40" />
          <div className="container-fluid flex items-center -mt-[18px]">
            <div className="w-[30px] h-0.5 bg-white flex-shrink-0" />
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous"
              className="w-9 h-9 rounded-full bg-white text-maroon flex items-center justify-center shadow-md hover:bg-primary transition-colors duration-300 flex-shrink-0"
            >
              <ChevronLeft size={15} />
            </button>
            <div className="w-5 h-0.5 bg-white flex-shrink-0" />
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next"
              className="w-9 h-9 rounded-full bg-white text-maroon flex items-center justify-center shadow-md hover:bg-primary transition-colors duration-300 flex-shrink-0"
            >
              <ChevronRight size={15} />
            </button>
            <div className="w-[30px] h-0.5 bg-white flex-shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
