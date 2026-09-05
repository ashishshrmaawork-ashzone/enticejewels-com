"use client";
import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "@/components/shared/ContentLink";
import { Check } from "lucide-react";
import useLiveContent from "@/lib/useLiveContent";
import { searchProducts } from "@/lib/api";
import { useCart } from "@/context/CartContext";

function SearchProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const add = () => {
    addToCart({ id: product.id, key: product.slug, name: product.title, image: product.image?.url || "", price: product.price || 0, category: product.category.title, href: product.path }, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };
  return <article className="border border-black/10 rounded-xl overflow-hidden bg-white flex flex-col">
    <Link href={product.path} className="relative block aspect-square bg-cream">{product.image?.url ? <Image src={product.image.url} alt={product.image.alt || product.title} fill unoptimized className="object-cover" /> : <span className="absolute inset-0 grid place-items-center text-sm text-ink-soft">No image</span>}</Link>
    <div className="p-5 flex flex-col flex-1"><p className="text-primary text-[10px] uppercase tracking-[2px]">{product.collection.title} / {product.category.title}</p><Link href={product.path} className="font-heading text-maroon text-xl mt-2 hover:text-primary">{product.title}</Link><p className="text-sm text-ink-soft leading-relaxed mt-3 mb-5 line-clamp-3">{product.description || "Product details available on the product page."}</p><button type="button" onClick={add} className="mt-auto w-full py-3 bg-[#232020] text-white rounded text-xs uppercase tracking-[2px] font-semibold flex justify-center items-center gap-2">{added ? <><Check size={14} /> Added</> : "Add to Cart"}</button></div>
  </article>;
}

export default function SearchResultsClient() {
  const query = useSearchParams().get("q")?.trim() || "";
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("relevance");
  const [pageState, setPageState] = useState({ key: "", count: 1 });
  const key = JSON.stringify([query, category, sort]);
  const pageCount = pageState.key === key ? pageState.count : 1;
  const loader = useCallback(async () => {
    if (query.length < 2) return { items: [], total: 0, page: 1, pages: 0 };
    const first = await searchProducts(query, { page: 1, perPage: 12, category, sort });
    const count = Math.min(pageCount, Math.max(1, first.pages));
    const rest = await Promise.all(Array.from({ length: count - 1 }, (_, index) => searchProducts(query, { page: index + 2, perPage: 12, category, sort })));
    return { ...first, page: count, items: [first, ...rest].flatMap(result => result.items) };
  }, [query, category, sort, pageCount]);
  const { data: result, loading, error: requestError } = useLiveContent(loader);
  const data = result || { items: [], total: 0, page: 1, pages: 0 };
  const error = requestError?.message || "";
  const loadMore = () => setPageState({ key, count: data.page + 1 });
  return <main className="pt-32 md:pt-40 pb-20 min-h-[70vh]"><div className="container mx-auto px-5 sm:px-6 md:px-8">
    <div className="flex flex-wrap gap-3 mb-6"><select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-black/15 rounded px-4 py-2"><option value="">All categories</option>{(data.categories || []).map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select><select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-black/15 rounded px-4 py-2"><option value="relevance">Relevance</option><option value="newest">Newest</option><option value="title_asc">Name A–Z</option><option value="title_desc">Name Z–A</option></select></div>
    <p className="text-primary text-xs uppercase tracking-[3px]">Product Search</p><h1 className="font-heading text-maroon text-3xl md:text-5xl mt-3">Results for “{query}”</h1>
    {!loading && !error && <p className="mt-3 text-ink-soft">{data.total} product{data.total === 1 ? "" : "s"} found</p>}{error && <p className="mt-8 text-red-700">{error}</p>}{query.length < 2 && <p className="mt-10 text-ink-soft">Enter at least 2 characters in header search.</p>}{loading && !data.items.length && <p className="mt-10 text-ink-soft">Searching...</p>}{!loading && query.length >= 2 && !data.items.length && !error && <p className="mt-10 text-ink-soft">No products found.</p>}
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">{data.items.map((product) => <SearchProductCard key={product.id} product={product} />)}</section>
    {data.page < data.pages && <div className="text-center mt-10"><button type="button" disabled={loading} onClick={loadMore} className="bg-maroon text-[#fff1c1] px-8 py-3 rounded text-xs uppercase tracking-[2px] disabled:opacity-60">{loading ? "Loading..." : "Load More"}</button></div>}
  </div></main>;
}
