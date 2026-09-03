"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import OpenPositionsAccordion from "./OpenPositionsAccordion";
import CareerApplicationForm from "./CareerApplicationForm";

export default function CareersInteractive({ positions, content }) {
  const settings = useSiteSettings();
  const email = settings.email || "info@enticemail.com";
  const [selectedPosition, setSelectedPosition] = useState("");
  const formRef = useRef(null);

  const handleApply = (title) => {
    setSelectedPosition(title);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="pt-16 md:pt-20 pb-16 md:pb-24">
        <div className="container mx-auto px-5 sm:px-6 md:px-8 text-center">
          <p className="text-primary text-xs uppercase tracking-[3px] mb-3">{content.positions.eyebrow}</p>
          <h2 className="font-heading text-maroon text-2xl md:text-4xl mb-10">{content.positions.title}</h2>
        </div>
        <div className="container mx-auto px-5 sm:px-6 md:px-8">
          <OpenPositionsAccordion positions={positions} onApply={handleApply} labels={content.positions} />
        </div>
      </section>

      <section ref={formRef} className="pb-16 md:pb-24 scroll-mt-24">
        <div className="container mx-auto px-5 sm:px-6 md:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full rounded-3xl overflow-hidden bg-cream order-2 lg:order-1">
              <Image src={content.form.image || "/images/Boutiques-1.png"} alt={content.form.image_alt || content.form.title} fill unoptimized className="object-cover" />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="font-heading text-maroon text-2xl md:text-4xl mb-4">{content.form.title}</h2>
              <p className="text-ink-soft text-sm md:text-base leading-relaxed mb-8">
                {content.form.description} <a href={`mailto:${email}`} className="text-primary hover:underline">{email}</a>
              </p>
              <CareerApplicationForm positions={positions} selectedPosition={selectedPosition} content={content.form} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
