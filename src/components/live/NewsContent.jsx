"use client";

import { useCallback } from "react";
import LivePage from "@/components/live/LivePage";
import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";
import InstagramSection from "@/components/shared/InstagramSection";
import NewsListing from "@/components/shared/NewsListing";
import { getNewsPage } from "@/lib/api";
const defaults = {
  hero: {
    title: "News & Events",
    image: "/images/csr-bg.png",
    image_alt: "News & Events"
  },
  breadcrumbs: {
    home: "Home",
    page: "News & Events"
  },
  labels: {
    featured: "Featured",
    read_featured: "Read Full Story",
    read_more: "Read More",
    empty: "No news or events are available right now.",
    previous: "Previous",
    next: "Next"
  },
  posts_per_page: 6,
  seo: {
    title: "News & Events",
    description: "The latest coverage, expos, and milestones from Entice Jewels."
  }
};
async function loadNewsPage() {
  const data = await getNewsPage();
  return {
    hero: {
      ...defaults.hero,
      ...data.hero,
      image: data.hero?.image || defaults.hero.image
    },
    breadcrumbs: {
      ...defaults.breadcrumbs,
      ...data.breadcrumbs
    },
    labels: {
      ...defaults.labels,
      ...data.labels
    },
    posts_per_page: Number(data.posts_per_page) || defaults.posts_per_page,
    seo: {
      ...defaults.seo,
      ...data.seo
    }
  };
}
async function loadContent() {
  const page = await loadNewsPage();
  return {
    page
  };
}
function ContentView({
  page
}) {
  return <>
      <PageHero image={page.hero.image} alt={page.hero.image_alt || page.hero.title}>
        <h1 className="font-heading text-white text-3xl md:text-5xl">{page.hero.title}</h1>
      </PageHero>

      <Breadcrumb items={[{
      label: page.breadcrumbs.home,
      href: "/"
    }, {
      label: page.breadcrumbs.page
    }]} />

      <NewsListing labels={page.labels} perPage={page.posts_per_page} />

      <InstagramSection />
    </>;
}
export default function NewsContent({
  params
}) {
  const routeKey = JSON.stringify(params || {});
  const loader = useCallback(() => loadContent({
    params: JSON.parse(routeKey)
  }), [routeKey]);
  return <LivePage loader={loader} title="News & Events">{data => <ContentView {...data} />}</LivePage>;
}
