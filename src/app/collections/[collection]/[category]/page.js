import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";
import InstagramSection from "@/components/shared/InstagramSection";
import FeaturedCarousel from "@/components/shared/FeaturedCarousel";
import CategoryTabs from "@/components/shop/CategoryTabs";
import ProductGrid from "@/components/shop/ProductGrid";
import { collections, getCollection, getCategory } from "@/data/collections";
import { getCategoryProducts } from "@/data/catalog";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return Object.values(collections).flatMap((collection) =>
    collection.categories.map((c) => ({ collection: collection.slug, category: c.slug }))
  );
}

export async function generateMetadata({ params }) {
  const { collection: collectionSlug, category: categorySlug } = await params;
  const category = getCategory(collectionSlug, categorySlug);
  return {
    title: category ? category.label : "Collection",
    description: category?.heroTagline,
  };
}

export default async function CategoryPage({ params }) {
  const { collection: collectionSlug, category: categorySlug } = await params;
  const collection = getCollection(collectionSlug);
  const category = getCategory(collectionSlug, categorySlug);
  if (!collection || !category) notFound();

  const products = getCategoryProducts(category.slug);

  const featured = collection.categories
    .filter((c) => c.slug !== category.slug)
    .map((c) => ({
      href: `/collections/${collection.slug}/${c.slug}`,
      name: c.label,
      image: c.image,
    }));

  return (
    <>
      <PageHero image={category.heroImage} alt={category.label}>
        <h1 className="font-heading text-white text-2xl md:text-4xl max-w-lg leading-snug">
          {category.heroTagline}
        </h1>
      </PageHero>

      <Breadcrumb
        items={[
          { label: "Collections" },
          { label: collection.name, href: `/collections/${collection.slug}` },
          { label: category.label },
        ]}
      />

      <CategoryTabs collectionSlug={collection.slug} categories={collection.categories} activeSlug={category.slug} />
      <ProductGrid basePath={`/collections/${collection.slug}/${category.slug}`} products={products} />

      <FeaturedCarousel items={featured} />
      <InstagramSection />
    </>
  );
}
