import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";
import InstagramSection from "@/components/shared/InstagramSection";
import CategoryGrid from "@/components/shop/CategoryGrid";
import CollectionQuote from "@/components/shop/CollectionQuote";
import { collections, getCollection } from "@/data/collections";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return Object.keys(collections).map((collection) => ({ collection }));
}

export async function generateMetadata({ params }) {
  const { collection: collectionSlug } = await params;
  const collection = getCollection(collectionSlug);
  return {
    title: collection ? collection.name : "Collection",
    description: collection?.tagline,
  };
}

export default async function CollectionPage({ params }) {
  const { collection: collectionSlug } = await params;
  const collection = getCollection(collectionSlug);
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
      <CollectionQuote quote="Elegant, radiant, and utterly captivating." />

      <InstagramSection />
    </>
  );
}
