"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import TreasuresSection from "@/components/home/TreasuresSection";
import ProductSlider from "@/components/home/ProductSlider";
import OurStorySection from "@/components/home/OurStorySection";
import DifferenceSection from "@/components/home/DifferenceSection";
import LegacyVideoSection from "@/components/home/LegacyVideoSection";
import CSRSection from "@/components/home/CSRSection";
import NewsEventsSection from "@/components/home/NewsEventsSection";
import { getHomePage, getNewsEvents } from "@/lib/api";

export default function HomeContent({ initialSections = {}, initialNewsEvents = [] }) {
  const [sections, setSections] = useState(initialSections);
  const [newsEvents, setNewsEvents] = useState(initialNewsEvents);

  useEffect(() => {
    let active = true;
    Promise.allSettled([getHomePage(), getNewsEvents()]).then(([homeResult, newsResult]) => {
      if (!active) return;
      if (homeResult.status === "fulfilled") setSections(homeResult.value.sections || {});
      if (newsResult.status === "fulfilled") setNewsEvents(newsResult.value);
    });
    return () => { active = false; };
  }, []);

  return (
    <>
      <HeroSection media={sections.hero?.media} videoUrl={sections.hero?.video} />
      <TreasuresSection {...sections.brands} />
      <ProductSlider categories={sections.brands?.entice_fashion} />
      <OurStorySection {...sections.story} />
      <DifferenceSection {...sections.uniqueness} />
      <LegacyVideoSection media={sections.legacy?.media} videoUrl={sections.legacy?.video} />
      <CSRSection {...sections.csr} />
      <NewsEventsSection eyebrow={sections.news?.eyebrow} title={sections.news?.title} items={sections.news?.items} posts={newsEvents} />
    </>
  );
}
