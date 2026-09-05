import CollectionContent from "@/components/live/CollectionContent";
import { getParentCollections } from "@/lib/api";
const categorySlugAliases = {
  bracelets: "bracelet",
  earrings: "earring",
  necklaces: "necklace",
  pendants: "pendant"
};
export async function generateStaticParams() {
  try {
    const items = await getParentCollections();
    return items.map(item => ({
      collection: item.slug
    }));
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
  return <CollectionContent params={await params} />;
}
