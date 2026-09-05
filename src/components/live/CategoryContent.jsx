"use client";

import { useCallback } from "react";
import LivePage from "@/components/live/LivePage";
import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";
import InstagramSection from "@/components/shared/InstagramSection";
import FeaturedCarousel from "@/components/shared/FeaturedCarousel";
import CategoryTabs from "@/components/shop/CategoryTabs";
import ProductGrid from "@/components/shop/ProductGrid";
import { getCollectionCategories, getCollectionProducts, getParentCollections } from "@/lib/api";
const categorySlugAliases = {
  bracelets: "bracelet",
  earrings: "earring",
  necklaces: "necklace",
  pendants: "pendant"
};
const apiSlugAliases = Object.fromEntries(Object.entries(categorySlugAliases).map(([apiSlug, routeSlug]) => [routeSlug, apiSlug]));
async function loadCategoryPage(collectionSlug, categorySlug) {
  const apiCategorySlug = collectionSlug === "entice-fashion" ? apiSlugAliases[categorySlug] || categorySlug : categorySlug;
  const [parents, apiCategories, apiProducts] = await Promise.all([getParentCollections(), getCollectionCategories(collectionSlug), getCollectionProducts(collectionSlug, apiCategorySlug)]);
  const parent = parents.find(item => item.slug === collectionSlug);
  if (!parent || !apiCategories || apiProducts === null) return null;
  const categories = apiCategories.map(item => ({
    seo: item.seo,
    slug: collectionSlug === "entice-fashion" ? categorySlugAliases[item.slug] || item.slug : item.slug,
    label: item.title,
    image: item.collection_page_image || item.image || "/images/collection-bg.png",
    heroImage: item.header_image || item.collection_page_image || item.image || "/images/collection-bg.png",
    heroTagline: item.header_text || item.description || item.title
  }));
  const category = categories.find(item => item.slug === categorySlug);
  if (!category) return null;
  return {
    collection: {
      slug: collectionSlug,
      name: parent.title,
      categories
    },
    category,
    products: apiProducts.map(product => ({
      slug: product.slug,
      name: product.title,
      image: product.image?.url || "/images/collection-bg.png"
    }))
  };
}
async function loadContent({
  params
}) {
  const {
    collection: collectionSlug,
    category: categorySlug
  } = await params;
  const data = await loadCategoryPage(collectionSlug, categorySlug);
  if (!data) return null;
  const {
    collection,
    category,
    products
  } = data;
  const featured = collection.categories.filter(c => c.slug !== category.slug).map(c => ({
    href: `/collections/${collection.slug}/${c.slug}`,
    name: c.label,
    image: c.image
  }));
  return {
    collectionSlug,
    categorySlug,
    data,
    collection,
    category,
    products,
    featured
  };
}
function ContentView({
  collection,
  category,
  products,
  featured
}) {
  return <>
      <PageHero image={category.heroImage} alt={category.label}>
        <h1 className="font-heading text-white text-2xl md:text-4xl max-w-lg leading-snug">
          {category.heroTagline}
        </h1>
      </PageHero>

      <Breadcrumb items={[{
      label: "Collections"
    }, {
      label: collection.name,
      href: `/collections/${collection.slug}`
    }, {
      label: category.label
    }]} />

      <CategoryTabs collectionSlug={collection.slug} categories={collection.categories} activeSlug={category.slug} />
      <ProductGrid basePath={`/collections/${collection.slug}/${category.slug}`} products={products} />

      <FeaturedCarousel items={featured} />
      <InstagramSection />
    </>;
}
export default function CategoryContent({
  params
}) {
  const routeKey = JSON.stringify(params || {});
  const loader = useCallback(() => loadContent({
    params: JSON.parse(routeKey)
  }), [routeKey]);
  return <LivePage loader={loader} title="Collection">{data => <ContentView {...data} />}</LivePage>;
}
