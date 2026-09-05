"use client";

import LivePage from "@/components/live/LivePage";
import HeroSection from "@/components/home/HeroSection";
import TreasuresSection from "@/components/home/TreasuresSection";
import ProductSlider from "@/components/home/ProductSlider";
import OurStorySection from "@/components/home/OurStorySection";
import DifferenceSection from "@/components/home/DifferenceSection";
import LegacyVideoSection from "@/components/home/LegacyVideoSection";
import CSRSection from "@/components/home/CSRSection";
import NewsEventsSection from "@/components/home/NewsEventsSection";
import { getHomePage, getNewsEvents } from "@/lib/api";

async function loadHomeContent() {
  const [home, newsEvents] = await Promise.all([getHomePage(), getNewsEvents()]);
  return { home, sections: home.sections || {}, newsEvents };
}
export default function HomeContent() {
  return <LivePage loader={loadHomeContent} title="Entice Jewels">{data => <HomeView {...data} />}</LivePage>;
}
function HomeView({ sections, newsEvents }) {
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
