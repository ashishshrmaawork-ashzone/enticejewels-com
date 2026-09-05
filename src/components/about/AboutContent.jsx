"use client";
import LiveMetadata from "@/components/live/LiveMetadata";
import useLiveContent from "@/lib/useLiveContent";
import PageHero from "@/components/shared/PageHero";
import AboutIntro from "@/components/about/AboutIntro";
import ExceptionalLegacy from "@/components/about/ExceptionalLegacy";
import AboutLegacyVideo from "@/components/about/AboutLegacyVideo";
import OurInspirers from "@/components/about/OurInspirers";
import OurBoutiques from "@/components/about/OurBoutiques";
import ProductSlider from "@/components/home/ProductSlider";
import { getAboutPageData } from "@/lib/api";

export default function AboutContent() {
  const { data, error } = useLiveContent(getAboutPageData);
  if (!data) return <div className="container mx-auto px-5 py-24 text-center" role="status">{error ? "Unable to load this page. Retrying shortly…" : "Loading…"}</div>;
  const about = data.about || {};
  const fields = about.custom_fields || {};

  return (
    <>
      <LiveMetadata data={data} title="About Us" />
      <PageHero image={about.featured_image?.url || "/images/about-banner-bg.png"} alt={about.featured_image?.alt || "Entice — Our Story"}>
        <h1 className="font-heading text-white text-3xl md:text-5xl">{fields.our_story || "Our Story"}</h1>
      </PageHero>

      <AboutIntro content={fields.our_story_content} />
      <ExceptionalLegacy title={fields.an_exceptional_legacy} content={fields.an_exceptional_legacy_content} />
      <AboutLegacyVideo media={about.legacy_media} videoUrl={fields.an_exceptional_legacy_video} />
      <OurInspirers title={data.inspirers?.title} items={data.inspirers?.items} />
      <ProductSlider categories={data.categories} sectionClassName="pt-0 pb-0 md:pt-0 md:pb-0" />
      <OurBoutiques title={data.boutiques?.title} items={data.boutiques?.items} />
    </>
  );
}
