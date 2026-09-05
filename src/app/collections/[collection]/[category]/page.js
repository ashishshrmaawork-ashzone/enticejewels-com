import CategoryContent from "@/components/live/CategoryContent";
import { getCollectionCategories, getParentCollections } from "@/lib/api";
const categorySlugAliases = {
  bracelets: "bracelet",
  earrings: "earring",
  necklaces: "necklace",
  pendants: "pendant"
};
export async function generateStaticParams() {
  try {
    const parents = await getParentCollections();
    const groups = await Promise.all(parents.map(async parent => ({
      parent,
      categories: (await getCollectionCategories(parent.slug)) || []
    })));
    return groups.flatMap(({
      parent,
      categories
    }) => categories.map(category => ({
      collection: parent.slug,
      category: parent.slug === "entice-fashion" ? categorySlugAliases[category.slug] || category.slug : category.slug
    })));
  } catch {
    return [];
  }
}
export const metadata = {
  title: "Collection"
};
export default async function Page({
  params
}) {
  return <CategoryContent params={await params} />;
}
