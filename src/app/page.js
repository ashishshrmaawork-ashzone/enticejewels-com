import HeroSection from "@/components/home/HeroSection";
import TreasuresSection from "@/components/home/TreasuresSection";
import ProductSlider from "@/components/home/ProductSlider";
import OurStorySection from "@/components/home/OurStorySection";
import DifferenceSection from "@/components/home/DifferenceSection";
import LegacyVideoSection from "@/components/home/LegacyVideoSection";
import CSRSection from "@/components/home/CSRSection";
import NewsEventsSection from "@/components/home/NewsEventsSection";
import SectionDepthReveal from "@/components/shared/SectionDepthReveal";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SectionDepthReveal><TreasuresSection /></SectionDepthReveal>
      <SectionDepthReveal><ProductSlider /></SectionDepthReveal>
      <SectionDepthReveal><OurStorySection /></SectionDepthReveal>
      <SectionDepthReveal><DifferenceSection /></SectionDepthReveal>
      <SectionDepthReveal><LegacyVideoSection /></SectionDepthReveal>
      <SectionDepthReveal><CSRSection /></SectionDepthReveal>
      <SectionDepthReveal><NewsEventsSection /></SectionDepthReveal>
    </>
  );
}
