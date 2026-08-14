import PageHero from "@/components/shared/PageHero";
import AboutIntro from "@/components/about/AboutIntro";
import ExceptionalLegacy from "@/components/about/ExceptionalLegacy";
import AboutLegacyVideo from "@/components/about/AboutLegacyVideo";
import OurInspirers from "@/components/about/OurInspirers";
import OurBoutiques from "@/components/about/OurBoutiques";
import ProductSlider from "@/components/home/ProductSlider";

export const metadata = {
  title: "About Us",
  description:
    "Entice, KGK 1905' is a captivating tale of exquisite designs, timeless creations and divine luxury — discover our story, our inspirers, and our boutiques.",
};

export default function AboutUsPage() {
  return (
    <>
      <PageHero image="/images/about-banner-bg.png" alt="Entice — Our Story">
        <h1 className="font-heading text-white text-3xl md:text-5xl">Our Story</h1>
      </PageHero>

      <AboutIntro />
      <ExceptionalLegacy />
      <AboutLegacyVideo />
      <OurInspirers />
      <ProductSlider sectionClassName="pt-0 pb-0 md:pt-0 md:pb-0" />
      <OurBoutiques />
    </>
  );
}
