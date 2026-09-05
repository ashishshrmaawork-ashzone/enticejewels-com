"use client";

import { useCallback } from "react";
import LivePage from "@/components/live/LivePage";
import Image from "next/image";
import Link from "@/components/shared/ContentLink";
import { ArrowLeft } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getCsrDetail } from "@/lib/api";
async function loadCsrItem(slug) {
  const apiItem = await getCsrDetail(slug);
  if (!apiItem) return null;
  const paragraphs = (apiItem.content || "").split(/\r?\n\r?\n/).filter(Boolean);
  return {
    seo: apiItem.seo,
    title: apiItem.title,
    description: apiItem.excerpt || paragraphs[0] || "",
    image: apiItem.image?.url || "/images/csr-bg.png",
    imageAlt: apiItem.image?.alt || apiItem.title,
    headerImage: apiItem.header_image?.url || apiItem.image?.url || "/images/csr-bg.png",
    headerImageAlt: apiItem.header_image?.alt || apiItem.title,
    eyebrow: apiItem.categories?.[0]?.title || "Our CSR",
    heading: apiItem.excerpt || "A Sense of Responsibility",
    intro: paragraphs[0] || apiItem.excerpt || "",
    paragraphs: paragraphs.slice(1)
  };
}
async function loadContent({
  params
}) {
  const {
    slug
  } = await params;
  const item = await loadCsrItem(slug);
  if (!item) return null;
  return {
    slug,
    item
  };
}
function ContentView({
  item
}) {
  return <>
      <PageHero image={item.headerImage} alt={item.headerImageAlt}>
        <div className="max-w-3xl">
          <p className="text-white/85 text-xs uppercase tracking-[3px] mb-3">{item.eyebrow}</p>
          <h1 className="font-heading text-white text-3xl sm:text-4xl md:text-6xl">{item.title}</h1>
        </div>
      </PageHero>

      <Breadcrumb items={[{
      label: "Home",
      href: "/"
    }, {
      label: "Our CSR",
      href: "/#csr"
    }, {
      label: item.title
    }]} />

      <article className="pb-16 md:pb-24">
        <div className="container mx-auto px-5 sm:px-6 md:px-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream">
            <Image src={item.image} alt={item.title} fill priority unoptimized className="object-cover" />
          </div>

          <div className="lg:pt-4">
            <p className="text-primary text-xs uppercase tracking-[3px] mb-3">Giving Back</p>
            <h2 className="font-heading text-maroon text-3xl md:text-5xl leading-tight mb-6">
              {item.heading}
            </h2>
            <p className="text-ink text-base md:text-lg leading-relaxed mb-5">{item.intro}</p>
            <div className="space-y-5 text-ink-soft text-sm md:text-base leading-relaxed">
              {item.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </div>

            <Link href="/#csr" className="inline-flex items-center gap-2 mt-8 text-maroon text-xs uppercase tracking-[2px] border-b border-maroon pb-1 hover:text-primary hover:border-primary transition-colors">
              <ArrowLeft size={15} /> Back to Our CSR
            </Link>
          </div>
        </div>
      </article>
    </>;
}
export default function CsrContent({
  params
}) {
  const routeKey = JSON.stringify(params || {});
  const loader = useCallback(() => loadContent({
    params: JSON.parse(routeKey)
  }), [routeKey]);
  return <LivePage loader={loader} title="Our CSR">{data => <ContentView {...data} />}</LivePage>;
}
