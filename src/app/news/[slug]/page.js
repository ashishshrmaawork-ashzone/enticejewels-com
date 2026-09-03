import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getFrontendSeo, getNewsEvent, getNewsEvents, getNewsPage } from "@/lib/api";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  try {
    const items = await getNewsEvents();
    return items.map((item) => ({ slug: item.slug || item.id }));
  } catch {
    return [];
  }
}

async function loadNewsItem(slug) {
  try {
    const apiItem = await getNewsEvent(slug);
    if (!apiItem) return null;
    return {
      title: apiItem.title,
      description: apiItem.excerpt,
      image: apiItem.image?.url || "/images/csr-bg.png",
      imageAlt: apiItem.image?.alt || apiItem.title,
      headerImage: apiItem.header_image?.url || apiItem.image?.url || "/images/csr-bg.png",
      headerImageAlt: apiItem.header_image?.alt || apiItem.title,
      eyebrow: apiItem.categories?.[0]?.title || "News & Events",
      contentHtml: apiItem.content || `<p>${apiItem.excerpt || ""}</p>`,
	  seo: apiItem.seo,
    };
  } catch (error) {
    console.error("News list API error:", error.message);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [item, globalSeo] = await Promise.all([loadNewsItem(slug), getFrontendSeo(`/news/${slug}/`)]);
  return {
    title: item?.seo?.title || item?.title || "News & Events",
    description: item?.seo?.description || item?.description,
    alternates: { canonical: globalSeo.canonical },
  };
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  const [item, page] = await Promise.all([loadNewsItem(slug), getNewsPage().catch(() => null)]);
  if (!item) notFound();
	const breadcrumbs = page?.breadcrumbs || { home: "Home", page: "News & Events" };
	const labels = page?.labels || { content_eyebrow: "Entice Coverage", back: "Back to News & Events" };

  return (
    <>
      <PageHero image={item.headerImage} alt={item.headerImageAlt}>
        <div className="max-w-3xl">
          <p className="text-white/85 text-xs uppercase tracking-[3px] mb-3">{item.eyebrow}</p>
          <h1 className="font-heading text-white text-3xl sm:text-4xl md:text-6xl">{item.title}</h1>
        </div>
      </PageHero>

      <Breadcrumb
        items={[
          { label: breadcrumbs.home, href: "/" },
          { label: breadcrumbs.page, href: "/news" },
          { label: item.title },
        ]}
      />

      <article className="pb-16 md:pb-24">
        <div className="container mx-auto px-5 sm:px-6 md:px-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream">
            <Image src={item.image} alt={item.title} fill priority unoptimized className="object-cover" />
          </div>

          <div className="lg:pt-4">
            <p className="text-primary text-xs uppercase tracking-[3px] mb-3">{labels.content_eyebrow}</p>
            <div
              className="text-ink-soft text-sm md:text-base leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: item.contentHtml }}
            />

            <Link
              href="/news"
              className="inline-flex items-center gap-2 mt-8 text-maroon text-xs uppercase tracking-[2px] border-b border-maroon pb-1 hover:text-primary hover:border-primary transition-colors"
            >
              <ArrowLeft size={15} /> {labels.back}
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
