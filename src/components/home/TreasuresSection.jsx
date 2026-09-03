"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// Swiper's loop mode needs a generous clone buffer on both sides to loop
// cleanly with centeredSlides — with only 2 real items we repeat the list so
// there's always a slide to peek on the left AND right.
export default function TreasuresSection({ eyebrow, title, description, collections }) {
  const swiperRef = useRef(null);
  const collectionItems = collections?.length
    ? collections.map((collection) => {
        return {
          id: collection.slug,
          title: collection.title,
          image: collection.image,
          icon: collection.icon,
          description: collection.description || description,
          href: `/collections/${collection.slug}`,
        };
      })
    : [];
  if (!collectionItems.length) return null;
  const slides = collectionItems.length < 6
    ? Array.from({ length: 6 }, (_, i) => collectionItems[i % collectionItems.length])
    : collectionItems;

  return (
    <section id="treasures" className="bg-white pt-16 pb-14 md:py-24 overflow-hidden">
      <div className="container-fluid">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start mb-8 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary text-xs uppercase tracking-[3px] mb-3">{eyebrow || "Entice Brands"}</p>
            <h2 className="font-heading text-maroon text-3xl md:text-5xl">{title || "Treasures of Elegance"}</h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ color: "#232020" }}
            className="w-full leading-relaxed md:text-left uppercase tracking-normal md:tracking-wide text-sm sm:text-base md:text-[20px]"
          >
            {description || "An ode to an exquisite and unparalleled luxury ‘Entice Couture’ is a treasure to be inherited by generations."}
          </motion.p>
        </div>

        <div className="relative -mx-3 sm:mx-0">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Autoplay]}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            loop
            centeredSlides={false}
            breakpoints={{ 640: { centeredSlides: true } }}
            spaceBetween={24}
            slidesPerView="auto"
            className="!overflow-visible entice-swiper entice-coverflow"
          >
            {slides.map((item, i) => (
              <SwiperSlide
                key={`${item.id}-${i}`}
                className="!w-[77%] sm:!w-[75%] md:!w-[68%] lg:!w-[64%] xl:!w-[60%]"
              >
                <div className="bg-[#F5F5F5] rounded-[22px] sm:rounded-[28px] p-2.5 md:p-4 flex flex-col sm:flex-row gap-2.5 md:gap-4">
                  <div className="relative rounded-[18px] sm:rounded-3xl overflow-hidden bg-maroon flex-1 min-h-[220px] sm:min-h-[260px] md:min-h-[380px]">
                    <Image src={item.image} alt={item.title} fill unoptimized className="object-cover" />
                  </div>

                  <div className="bg-white rounded-[18px] sm:rounded-3xl flex-1 p-5 sm:p-6 md:p-10 flex flex-col justify-center">
                    {item.icon ? <Image src={item.icon} alt="" width={44} height={34} unoptimized className="mb-3 h-8 object-contain" /> : null}
                    <h3 className="font-heading text-maroon text-2xl md:text-3xl mb-3">{item.title}</h3>
                    <p className="text-ink-soft text-sm leading-relaxed mb-5">{item.description}</p>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 text-primary text-xs uppercase tracking-[2px] hover:gap-2 transition-all"
                    >
                      View More <ChevronsRight size={15} />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous"
            className="absolute left-0 md:left-14 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-maroon text-white hidden md:flex items-center justify-center hover:bg-primary hover:text-maroon transition-colors duration-300 shadow-lg"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next"
            className="absolute right-0 md:right-14 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-maroon text-white hidden md:flex items-center justify-center hover:bg-primary hover:text-maroon transition-colors duration-300 shadow-lg"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
