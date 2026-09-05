"use client";

import { useCallback } from "react";
import LivePage from "@/components/live/LivePage";
import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";
import InstagramSection from "@/components/shared/InstagramSection";
import BlogListing from "@/components/shared/BlogListing";
import { getBlogPage } from "@/lib/api";
async function loadContent() {
  const page = await getBlogPage();
  return {
    page
  };
}
function ContentView({
  page
}) {
  return <><PageHero image={page.hero.image || "/images/our-story-bg.png"} alt={page.hero.image_alt || page.hero.title}><h1 className="font-heading text-white text-3xl md:text-5xl">{page.hero.title}</h1></PageHero><Breadcrumb items={[{
      label: page.breadcrumbs.home,
      href: "/"
    }, {
      label: page.breadcrumbs.page
    }]} /><BlogListing labels={page.labels} perPage={page.posts_per_page} /><InstagramSection /></>;
}
export default function BlogContent({
  params
}) {
  const routeKey = JSON.stringify(params || {});
  const loader = useCallback(() => loadContent({
    params: JSON.parse(routeKey)
  }), [routeKey]);
  return <LivePage loader={loader} title="Blog">{data => <ContentView {...data} />}</LivePage>;
}
