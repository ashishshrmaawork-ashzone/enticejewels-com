import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";
import InstagramSection from "@/components/shared/InstagramSection";
import FeaturedCarousel from "@/components/shared/FeaturedCarousel";
import CategoryTabs from "@/components/shop/CategoryTabs";
import ProductGrid from "@/components/shop/ProductGrid";
import { getCollectionCategories, getCollectionProducts, getFrontendSeo, getParentCollections } from "@/lib/api";
import { notFound } from "next/navigation";

const categorySlugAliases = { bracelets: "bracelet", earrings: "earring", necklaces: "necklace", pendants: "pendant" };
const apiSlugAliases = Object.fromEntries(Object.entries(categorySlugAliases).map(([apiSlug, routeSlug]) => [routeSlug, apiSlug]));

export async function generateStaticParams() {
  try {
    const parents = await getParentCollections();
    const groups = await Promise.all(parents.map(async (parent) => ({ parent, categories: await getCollectionCategories(parent.slug) || [] })));
    return groups.flatMap(({ parent, categories }) => categories.map((category) => ({
      collection: parent.slug,
      category: parent.slug === "entice-fashion" ? (categorySlugAliases[category.slug] || category.slug) : category.slug,
    })));
  } catch {
    return [];
  }
}

async function loadCategoryPage(collectionSlug, categorySlug) {
  try {
    const apiCategorySlug = collectionSlug === "entice-fashion" ? (apiSlugAliases[categorySlug] || categorySlug) : categorySlug;
    const [parents, apiCategories, apiProducts] = await Promise.all([
      getParentCollections(), getCollectionCategories(collectionSlug), getCollectionProducts(collectionSlug, apiCategorySlug),
    ]);
    const parent = parents.find((item) => item.slug === collectionSlug);
    if (!parent || !apiCategories || apiProducts === null) return null;
    const categories = apiCategories.map((item) => ({
      slug: collectionSlug === "entice-fashion" ? (categorySlugAliases[item.slug] || item.slug) : item.slug,
      label: item.title,
      image: item.collection_page_image || item.image || "/images/collection-bg.png",
      heroImage: item.header_image || item.collection_page_image || item.image || "/images/collection-bg.png",
      heroTagline: item.header_text || item.description || item.title,
    }));
    const category = categories.find((item) => item.slug === categorySlug);
    if (!category) return null;
    return {
      collection: { slug: collectionSlug, name: parent.title, categories },
      category,
      products: apiProducts.map((product) => ({ slug: product.slug, name: product.title, image: product.image?.url || "/images/collection-bg.png" })),
    };
  } catch (error) {
    console.error("Category API error:", error.message);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { collection: collectionSlug, category: categorySlug } = await params;
  const [data, globalSeo] = await Promise.all([loadCategoryPage(collectionSlug, categorySlug), getFrontendSeo(`/collections/${collectionSlug}/${categorySlug}/`)]);
  const category = data?.category;
  return {
    title: category ? category.label : "Collection",
    description: category?.heroTagline,
    alternates: { canonical: globalSeo.canonical },
  };
}

export default async function CategoryPage({ params }) {
  const { collection: collectionSlug, category: categorySlug } = await params;
  const data = await loadCategoryPage(collectionSlug, categorySlug);
  if (!data) notFound();
  const { collection, category, products } = data;

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
