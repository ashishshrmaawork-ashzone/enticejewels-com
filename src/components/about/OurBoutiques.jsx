"use client";

import { useState } from "react";
import Image from "next/image";
import { boutiques } from "@/data/boutiques";

export default function OurBoutiques() {
  const [activeId, setActiveId] = useState(boutiques[0].id);

  return (
    <section className="bg-white py-16 md:py-24">
      <h2 className="font-heading text-maroon text-3xl md:text-5xl text-center mb-10 md:mb-14">
        Our Boutiques
      </h2>
      <div
        className="container mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-2 gap-2.5 sm:gap-3 md:flex md:h-[440px] lg:h-[500px] md:gap-4"
        onMouseLeave={() => setActiveId(boutiques[0].id)}
      >
        {boutiques.map((b) => {
          const active = activeId === b.id;

          return (
          <article
            key={b.id}
            tabIndex={0}
            onMouseEnter={() => setActiveId(b.id)}
            onFocus={() => setActiveId(b.id)}
            onClick={() => setActiveId(b.id)}
            className={`group relative aspect-[3/4] md:aspect-auto overflow-hidden rounded-[22px] md:min-w-0 cursor-pointer outline-none ring-primary transition-[flex] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 ${
              active ? "md:flex-[1.75]" : "md:flex-1"
            }`}
            aria-label={`${b.city}, ${b.address}`}
          >
            <Image
              src={b.image}
              alt={b.city}
              fill
              sizes="(max-width: 767px) 50vw, 35vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.2)_38%,rgba(0,0,0,0.08)_70%)] transition-opacity duration-500 group-hover:opacity-90" />
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 text-center transition-opacity duration-300 ${
                active ? "md:opacity-100" : "md:opacity-0"
              }`}
            >
              <div className="px-2 py-3">
                <h3 className="text-white font-body text-base sm:text-lg md:text-2xl font-medium uppercase tracking-[0.06em] sm:tracking-[0.08em] [text-shadow:0_2px_12px_rgba(0,0,0,0.95)]">
                  {b.city}
                </h3>
                <span className="block w-9 h-px bg-white/80 mx-auto my-2" />
                <p className="text-white text-[10px] sm:text-[11px] md:text-sm uppercase tracking-wide leading-snug [text-shadow:0_2px_10px_rgba(0,0,0,1)] md:whitespace-nowrap">
                  {b.address}
                </p>
              </div>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}
