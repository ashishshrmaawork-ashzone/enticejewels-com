"use client";

import { useCallback } from "react";
import { getCustomerPage } from "@/lib/api";
import useLiveContent from "@/lib/useLiveContent";
import LiveMetadata from "@/components/live/LiveMetadata";
import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";

export default function CustomerPageContent({ slug, children }) {
  const loader = useCallback(() => getCustomerPage(slug), [slug]);
  const { data: page } = useLiveContent(loader);
  // Keep the form/cart subtree mounted while CMS copy refreshes.
  return <div className="[&>main]:!pt-8 [&>main>section>h1]:hidden">
    {page && <><LiveMetadata data={{ page }} title={page.title} />
      <PageHero image={page.featured_image?.url || "/images/about-banner-bg.png"} alt={page.featured_image?.alt || page.title} height="h-[360px] sm:h-[430px] md:h-[500px]">
        <h1 className="font-heading text-white text-3xl md:text-5xl">{page.title}</h1>
      </PageHero>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: page.title }]} />
      <div className="container mx-auto px-5 sm:px-6 md:px-8">{page.excerpt && <p className="text-ink-soft">{page.excerpt}</p>}{page.content && <div className="prose mt-4" dangerouslySetInnerHTML={{ __html: page.content }} />}</div>
    </>}
    {children}
  </div>;
}
