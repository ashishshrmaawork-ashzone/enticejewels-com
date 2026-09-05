import ProductContent from "@/components/live/ProductContent";
import { getCollectionCategories, getCollectionProducts, getParentCollections } from "@/lib/api";
const categorySlugAliases = {
  bracelets: "bracelet",
  earrings: "earring",
  necklaces: "necklace",
  pendants: "pendant"
};
export async function generateStaticParams() {
  const parents = await getParentCollections();
  const routes = [];
  for (const parent of parents) {
    const categories = (await getCollectionCategories(parent.slug)) || [];
    for (const category of categories) {
      const products = (await getCollectionProducts(parent.slug, category.slug)) || [];
      const routeCategory = parent.slug === "entice-fashion" ? categorySlugAliases[category.slug] || category.slug : category.slug;
      products.forEach(product => routes.push({
        collection: parent.slug,
        category: routeCategory,
        product: product.slug
      }));
    }
  }
  return routes.length ? routes : [{
    collection: "entice-fashion",
    category: "necklace",
    product: "no-products-placeholder"
  }];
}
export const metadata = {
  title: "Product"
};
export default async function Page({
  params
}) {
  return <ProductContent params={await params} />;
}
