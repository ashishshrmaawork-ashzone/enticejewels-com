import PageHero from "@/components/shared/PageHero";
import AboutIntro from "@/components/about/AboutIntro";
import ExceptionalLegacy from "@/components/about/ExceptionalLegacy";
import AboutLegacyVideo from "@/components/about/AboutLegacyVideo";
import OurInspirers from "@/components/about/OurInspirers";
import OurBoutiques from "@/components/about/OurBoutiques";
import ProductSlider from "@/components/home/ProductSlider";
import { getAboutPageData, getFrontendSeo } from "@/lib/api";

export async function generateMetadata() {
  const [data, globalSeo] = await Promise.all([getAboutPageData().catch(() => ({})), getFrontendSeo("/about-us/")]);
  const page = data.about || {};
  return { title: page.seo?.title || "About Us", description: page.seo?.description || page.excerpt, alternates: { canonical: globalSeo.canonical }, openGraph: { title: page.seo?.title || page.title, description: page.seo?.description || page.excerpt, url: globalSeo.canonical, images: page.featured_image?.url ? [page.featured_image.url] : undefined } };
}

export default async function AboutUsPage() {
  let data = {};
  try {
    data = await getAboutPageData();
  } catch (error) {
    console.error("About Us API error:", error.message);
  }
  const about = data.about || {};
  const fields = about.custom_fields || {};

  return (
    <>
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
