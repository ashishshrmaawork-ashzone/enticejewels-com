"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function OurInspirers({ title, items }) {
  const slides = items?.length ? items.map((item, index) => ({
    id: index,
    name: item.our_inspirers_title,
    title: item.our_inspirers_designation,
    bio: item.our_inspirers_detail,
    image: item.our_inspirers_image,
  })) : [];
  if (!slides.length) return null;
  return (
    <section id="our-inspirers" className="bg-white py-16 md:py-24">
      <h2 className="font-heading text-maroon text-3xl md:text-5xl text-center mb-10 md:mb-14">
        {title || "Our Inspirers"}
      </h2>

      <div className="container mx-auto px-5 sm:px-6 md:px-8">
        <Swiper
          onSwiper={(swiper) => {
            // loop mode occasionally lands on the wrong real slide at mount;
            // force it back to the first one right after init.
            setTimeout(() => swiper.slideToLoop(0, 0), 0);
          }}
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          loop
          speed={600}
          className="entice-swiper !pb-12"
        >
          {slides.map((inspirer) => (
            <SwiperSlide key={inspirer.id}>
              {/* Fixed height (no autoHeight) — this is what caused the
                  earlier image/text mismatch with loop mode. */}
              <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center md:min-h-[480px]">
                <div>
                  <h3 className="text-maroon font-body font-bold text-base md:text-lg mb-1">
                    {inspirer.name}
                  </h3>
                  <p className="text-ink-soft text-sm mb-5">{inspirer.title}</p>
                  <p className="text-ink-soft text-sm leading-relaxed">{inspirer.bio}</p>
                </div>
                <div className="relative aspect-[440/517] md:aspect-auto md:h-[440px] rounded-2xl overflow-hidden">
                  <Image
                    src={inspirer.image}
                    alt={inspirer.name}
                    fill
                    unoptimized
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
