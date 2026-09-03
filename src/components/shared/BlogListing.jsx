"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronsRight, LoaderCircle } from "lucide-react";
import { getBlogsPaged } from "@/lib/api";

const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";

function BlogCard({ post, labels }) {
  return <article className="bw-hover group">
    <Link href={`/blog/${post.slug}`} className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-cream"><Image src={post.image?.url || "/images/our-story-bg.png"} alt={post.image?.alt || post.title} fill unoptimized className="object-cover" /></Link>
    <p className="mt-4 text-primary text-[10px] uppercase tracking-[2px]">{post.categories?.map((category) => category.title).join(" / ") || labels.featured}{post.published_at ? ` · ${formatDate(post.published_at)}` : ""}</p>
    <h2 className="font-heading mt-2 text-maroon text-xl"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
    <p className="mt-2 text-ink-soft text-sm leading-relaxed">{post.excerpt}</p>
    <Link href={`/blog/${post.slug}`} className="mt-3 inline-flex items-center gap-1 text-primary text-xs uppercase tracking-[2px]">{labels.read_more}<ChevronsRight size={13} /></Link>
  </article>;
}

function FeaturedBlog({ post, labels }) {
  return <article className="group grid md:grid-cols-2 gap-6 md:gap-10 items-center mb-12 md:mb-16">
    <Link href={`/blog/${post.slug}`} className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-cream"><Image src={post.image?.url || "/images/our-story-bg.png"} alt={post.image?.alt || post.title} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-105" /></Link>
    <div><p className="text-primary text-[10px] uppercase tracking-[2px] mb-3">{post.categories?.map((category) => category.title).join(" / ") || labels.featured}{post.published_at ? ` · ${formatDate(post.published_at)}` : ""}</p><h2 className="font-heading text-maroon text-2xl md:text-4xl leading-tight mb-4"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p className="text-ink-soft text-sm md:text-base leading-relaxed mb-5">{post.excerpt}</p><Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-primary text-xs uppercase tracking-[2px]">{labels.read_featured}<ChevronsRight size={13} /></Link></div>
  </article>;
}

export default function BlogListing({ initial, labels, perPage }) {
  const [data, setData] = useState(initial); const [loading, setLoading] = useState(false);
  async function go(page) { if (page < 1 || page > data.pagination.total_pages || page === data.pagination.page) return; setLoading(true); try { setData(await getBlogsPaged(page, perPage)); document.querySelector("#blog-listing")?.scrollIntoView({ behavior: "smooth", block: "start" }); } finally { setLoading(false); } }
  const posts = data.items || []; const featured = data.pagination.page === 1 ? data.featured : null;
  return <section id="blog-listing" className="pb-16 md:pb-24 scroll-mt-28"><div className="container mx-auto px-5 sm:px-6 md:px-8">
    {loading && <LoaderCircle className="animate-spin text-maroon mx-auto mb-5" />}
    {!posts.length && !featured ? <p className="text-center text-ink-soft">{labels.empty}</p> : <>{featured && <FeaturedBlog post={featured} labels={labels} />}<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">{posts.map((post) => <BlogCard key={post.slug} post={post} labels={labels} />)}</div></>}
    {data.pagination.total_pages > 1 && <nav className="mt-12 flex flex-wrap justify-center items-center gap-2" aria-label="Blog pagination"><button onClick={() => go(data.pagination.page - 1)} disabled={loading || data.pagination.page === 1} className="px-4 py-2 border rounded disabled:opacity-40">{labels.previous}</button>{Array.from({ length: data.pagination.total_pages }, (_, index) => index + 1).map((number) => <button key={number} onClick={() => go(number)} disabled={loading} className={`w-10 h-10 border rounded ${number === data.pagination.page ? "bg-maroon text-white" : ""}`}>{number}</button>)}<button onClick={() => go(data.pagination.page + 1)} disabled={loading || data.pagination.page === data.pagination.total_pages} className="px-4 py-2 border rounded disabled:opacity-40">{labels.next}</button></nav>}
  </div></section>;
}
