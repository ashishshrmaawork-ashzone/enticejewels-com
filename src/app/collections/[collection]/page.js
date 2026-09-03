import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";
import InstagramSection from "@/components/shared/InstagramSection";
import CategoryGrid from "@/components/shop/CategoryGrid";
import CollectionQuote from "@/components/shop/CollectionQuote";
import { getCollectionCategories, getFrontendSeo, getParentCollections } from "@/lib/api";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  try {
    const items = await getParentCollections();
    return items.map((item) => ({ collection: item.slug }));
  } catch {
    return [];
  }
}

const categorySlugAliases = { bracelets: "bracelet", earrings: "earring", necklaces: "necklace", pendants: "pendant" };
const collectionDefaults = {
  "entice-fashion": "Redefines the sentiment of self-adornment, with a bold and contemporary style.",
  "entice-couture": "An exquisite expression of artistry, heritage, and timeless luxury.",
};

async function loadCollection(slug) {
  try {
    const [parents, apiCategories] = await Promise.all([getParentCollections(), getCollectionCategories(slug)]);
    const parent = parents.find((item) => item.slug === slug);
    if (!parent || !apiCategories) return null;
    return {
      slug,
      name: parent.title,
      tagline: parent.header_text || parent.description || collectionDefaults[slug] || parent.title,
      heroImage: parent.header_image || parent.collection_page_image || parent.image || "/images/collection-bg.png",
      quote: parent.quote || "Elegant, radiant, and utterly captivating.",
      categories: apiCategories.map((category) => ({
        slug: slug === "entice-fashion" ? (categorySlugAliases[category.slug] || category.slug) : category.slug,
        label: category.title,
        image: category.collection_page_image || category.image || "/images/collection-bg.png",
      })),
    };
  } catch (error) {
    console.error("Collection API error:", error.message);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { collection: collectionSlug } = await params;
  const [collection, globalSeo] = await Promise.all([loadCollection(collectionSlug), getFrontendSeo(`/collections/${collectionSlug}/`)]);
  return {
    title: collection ? collection.name : "Collection",
    description: collection?.tagline,
    alternates: { canonical: globalSeo.canonical },
  };
}

export default async function CollectionPage({ params }) {
  const { collection: collectionSlug } = await params;
  const collection = await loadCollection(collectionSlug);
  if (!collection) notFound();

  return (
    <>
      <PageHero image={collection.heroImage} alt={collection.name}>
        <h1 className="font-heading text-white text-2xl md:text-4xl max-w-xl leading-snug">
          {collection.tagline}
        </h1>
      </PageHero>

      <Breadcrumb items={[{ label: "Collections" }, { label: collection.name }]} />

      <CategoryGrid collectionSlug={collection.slug} categories={collection.categories} />
      <CollectionQuote quote={collection.quote || "Elegant, radiant, and utterly captivating."} />

      <InstagramSection />
    </>
  );
}
