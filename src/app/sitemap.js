import { getBlogs, getCollectionCategories, getCollectionProducts, getCsrItems, getFrontendSeo, getNewsEvents, getParentCollections } from "@/lib/api";

export const dynamic = "force-static";

export default async function sitemap() {
  const { settings } = await getFrontendSeo("/");
  const baseUrl = (settings.seo?.canonical_base || "https://enticejewels.com").replace(/\/$/, "");
  const staticPages = ["", "/about-us", "/contact", "/privacy-policy", "/news", "/blog", "/careers"];
  const [csr, news, blogs, parents] = await Promise.all([
    getCsrItems().catch(() => []), getNewsEvents().catch(() => []), getBlogs().catch(() => []), getParentCollections().catch(() => []),
  ]);
  const paths = [...staticPages, ...csr.map((item) => `/csr/${item.slug}`), ...news.map((item) => `/news/${item.slug}`), ...blogs.map((item) => `/blog/${item.slug}`)];
  for (const parent of parents) {
    paths.push(`/collections/${parent.slug}`);
    const categories = await getCollectionCategories(parent.slug).catch(() => []);
    for (const category of categories || []) {
      const routeCategory = parent.slug === "entice-fashion" ? ({ bracelets: "bracelet", earrings: "earring", necklaces: "necklace", pendants: "pendant" }[category.slug] || category.slug) : category.slug;
      paths.push(`/collections/${parent.slug}/${routeCategory}`);
      const products = await getCollectionProducts(parent.slug, category.slug).catch(() => []);
      for (const product of products || []) paths.push(`/collections/${parent.slug}/${routeCategory}/${product.slug}`);
    }
  }
  return [...new Set(paths)].map((path) => ({
    url: `${baseUrl}${path || "/"}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.includes("/collections/") ? 0.8 : 0.6,
  }));
}
