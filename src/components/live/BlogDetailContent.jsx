"use client";

import { useCallback } from "react";
import LivePage from "@/components/live/LivePage";
import Link from "@/components/shared/ContentLink";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";
import FeaturedCarousel from "@/components/shared/FeaturedCarousel";
import { getBlog, getBlogPage, getBlogs } from "@/lib/api";
const date = v => v ? new Date(v).toLocaleDateString("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric"
}) : "";
const minutes = h => Math.max(1, Math.round((h || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length / 200));
async function loadContent({
  params
}) {
  const {
    slug
  } = await params;
  const [post, page, all] = await Promise.all([getBlog(slug), getBlogPage(), getBlogs()]);
  if (!post) return null;
  const related = all.filter(p => p.slug !== slug).slice(0, 6).map(p => ({
    href: `/blog/${p.slug}`,
    name: p.title,
    image: p.image?.url || "/images/our-story-bg.png"
  }));
  const hero = post.header_image || post.image;
  return {
    slug,
    post,
    page,
    all,
    related,
    hero
  };
}
function ContentView({
  post,
  page,
  related,
  hero
}) {
  return <><PageHero image={hero?.url || "/images/our-story-bg.png"} alt={hero?.alt || post.title} height="h-[480px] sm:h-[560px] md:h-[760px]"><div className="max-w-3xl"><p className="text-white/85 text-xs uppercase tracking-[3px] mb-3">{post.categories?.[0]?.title || page.hero.title}</p><h1 className="font-heading text-white text-3xl sm:text-4xl md:text-6xl leading-tight mb-5">{post.title}</h1><div className="flex gap-6 text-white/80 text-xs uppercase tracking-[2px]"><span className="flex items-center gap-2"><Calendar size={14} />{date(post.published_at)}</span><span className="flex items-center gap-2"><Clock size={14} />{minutes(post.content)} {page.labels.minute_read}</span></div></div></PageHero><Breadcrumb items={[{
      label: page.breadcrumbs.home,
      href: "/"
    }, {
      label: page.breadcrumbs.page,
      href: "/blog"
    }, {
      label: post.title
    }]} /><article className="pb-16 md:pb-24"><div className="container mx-auto px-5 sm:px-6 md:px-8"><div className="text-ink text-base md:text-lg leading-loose [&_p]:mb-6 [&_img]:rounded-2xl [&_img]:my-8 [&_a]:text-primary [&_h2]:font-heading [&_h2]:text-maroon [&_h2]:text-3xl [&_h2]:mt-12 [&_h2]:mb-5" dangerouslySetInnerHTML={{
          __html: post.content
        }} /><div className="mt-10 pt-8 border-t border-black/10"><Link href="/blog" className="inline-flex items-center gap-2 text-maroon text-xs uppercase tracking-[2px] border-b border-maroon pb-1"><ArrowLeft size={15} />{page.labels.back}</Link></div></div></article>{related.length > 0 && <FeaturedCarousel title={page.labels.related} items={related} />}</>;
}
export default function BlogDetailContent({
  params
}) {
  const routeKey = JSON.stringify(params || {});
  const loader = useCallback(() => loadContent({
    params: JSON.parse(routeKey)
  }), [routeKey]);
  return <LivePage loader={loader} title="Blog">{data => <ContentView {...data} />}</LivePage>;
}
