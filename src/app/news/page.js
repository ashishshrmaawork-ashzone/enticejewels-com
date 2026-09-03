import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";
import InstagramSection from "@/components/shared/InstagramSection";
import NewsListing from "@/components/shared/NewsListing";
import { getFrontendSeo, getNewsEventsPaged, getNewsPage } from "@/lib/api";

const defaults = {
  hero: { title: "News & Events", image: "/images/csr-bg.png", image_alt: "News & Events" },
  breadcrumbs: { home: "Home", page: "News & Events" },
  labels: { featured: "Featured", read_featured: "Read Full Story", read_more: "Read More", empty: "No news or events are available right now.", previous: "Previous", next: "Next" },
  posts_per_page: 6,
  seo: { title: "News & Events", description: "The latest coverage, expos, and milestones from Entice Jewels." },
};

async function loadNewsPage() {
  try {
    const data = await getNewsPage();
    return {
      hero: { ...defaults.hero, ...data.hero, image: data.hero?.image || defaults.hero.image },
      breadcrumbs: { ...defaults.breadcrumbs, ...data.breadcrumbs },
      labels: { ...defaults.labels, ...data.labels },
      seo: { ...defaults.seo, ...data.seo },
    };
  } catch (error) {
    console.error("News page API error:", error.message);
    return defaults;
  }
}

export async function generateMetadata() {
  const [page, globalSeo] = await Promise.all([loadNewsPage(), getFrontendSeo("/news/")]);
  return { title: page.seo.title, description: page.seo.description, alternates: { canonical: globalSeo.canonical } };
}

export default async function NewsPage() {
  const page = await loadNewsPage();
  const initial = await getNewsEventsPaged(1, page.posts_per_page).catch(() => ({ featured: null, items: [], pagination: { page: 1, per_page: page.posts_per_page, total: 0, total_pages: 0 } }));

  return (
    <>
      <PageHero image={page.hero.image} alt={page.hero.image_alt || page.hero.title}>
        <h1 className="font-heading text-white text-3xl md:text-5xl">{page.hero.title}</h1>
      </PageHero>

      <Breadcrumb items={[{ label: page.breadcrumbs.home, href: "/" }, { label: page.breadcrumbs.page }]} />

      <NewsListing initial={initial} labels={page.labels} perPage={page.posts_per_page} />

      <InstagramSection />
    </>
  );
}
