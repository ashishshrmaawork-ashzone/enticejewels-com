import { collections } from "@/data/collections";
import { getCategoryProducts } from "@/data/catalog";
import { csrItems } from "@/data/csr";

const baseUrl = "https://enticejewels.com";

export const dynamic = "force-static";

export default function sitemap() {
  const staticPages = ["", "/about-us", "/contact", "/privacy-policy"];
  const csrPages = csrItems.map((item) => `/csr/${item.id}`);
  const collectionPages = Object.values(collections).flatMap((collection) => [
    `/collections/${collection.slug}`,
    ...collection.categories.flatMap((category) => [
      `/collections/${collection.slug}/${category.slug}`,
      ...getCategoryProducts(category.slug).map(
        (product) => `/collections/${collection.slug}/${category.slug}/${product.slug}`
      ),
    ]),
  ]);

  return [...staticPages, ...csrPages, ...collectionPages].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.includes("/collections/") ? 0.8 : 0.6,
  }));
}
