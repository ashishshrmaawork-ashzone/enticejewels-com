import HeroSection from "@/components/home/HeroSection";
import TreasuresSection from "@/components/home/TreasuresSection";
import ProductSlider from "@/components/home/ProductSlider";
import OurStorySection from "@/components/home/OurStorySection";
import DifferenceSection from "@/components/home/DifferenceSection";
import LegacyVideoSection from "@/components/home/LegacyVideoSection";
import CSRSection from "@/components/home/CSRSection";
import NewsEventsSection from "@/components/home/NewsEventsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TreasuresSection />
      <ProductSlider />
      <OurStorySection />
      <DifferenceSection />
      <LegacyVideoSection />
      <CSRSection />
      <NewsEventsSection />
    </>
  );
}
