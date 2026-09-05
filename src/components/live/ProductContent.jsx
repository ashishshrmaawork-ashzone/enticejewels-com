"use client";

import { useCallback } from "react";
import LivePage from "@/components/live/LivePage";
import Breadcrumb from "@/components/shared/Breadcrumb";
import InstagramSection from "@/components/shared/InstagramSection";
import FeaturedCarousel from "@/components/shared/FeaturedCarousel";
import ProductInfo from "@/components/shop/ProductInfo";
import { getCollectionCategories, getCollectionProductDetail, getCollectionProducts, getGeneralSettings, getParentCollections } from "@/lib/api";
const categorySlugAliases = {
  bracelets: "bracelet",
  earrings: "earring",
  necklaces: "necklace",
  pendants: "pendant"
};
const apiSlugAliases = Object.fromEntries(Object.entries(categorySlugAliases).map(([apiSlug, routeSlug]) => [routeSlug, apiSlug]));
async function loadProductPage(collectionSlug, categorySlug, productSlug) {
  const apiCategorySlug = collectionSlug === "entice-fashion" ? apiSlugAliases[categorySlug] || categorySlug : categorySlug;
  const [parents, apiCategories, apiProduct, settings] = await Promise.all([getParentCollections(), getCollectionCategories(collectionSlug), getCollectionProductDetail(collectionSlug, apiCategorySlug, productSlug), getGeneralSettings()]);
  const parent = parents.find(item => item.slug === collectionSlug);
  if (!parent || !apiCategories || !apiProduct) return null;
  const categories = apiCategories.map(item => ({
    slug: collectionSlug === "entice-fashion" ? categorySlugAliases[item.slug] || item.slug : item.slug,
    label: item.title,
    image: item.collection_page_image || item.image || "/images/collection-bg.png"
  }));
  const category = categories.find(item => item.slug === categorySlug);
  if (!category) return null;
  const productGroups = await Promise.all(apiCategories.map(async apiCategory => ({
    apiCategory,
    products: await getCollectionProducts(collectionSlug, apiCategory.slug)
  })));
  const productPageSettings = settings.product_page || {};
  const automaticRelated = productGroups.flatMap(({
    apiCategory,
    products
  }) => {
    const routeCategory = collectionSlug === "entice-fashion" ? categorySlugAliases[apiCategory.slug] || apiCategory.slug : apiCategory.slug;
    return (products || []).filter(item => item.slug !== apiProduct.slug).map(item => ({
      id: item.id,
      href: `/collections/${collectionSlug}/${routeCategory}/${item.slug}`,
      name: item.title,
      image: item.image?.url || item.header_image?.url || apiCategory.collection_page_image || apiCategory.image || "/images/collection-bg.png"
    }));
  });
  const selectedIds = apiProduct.related_product_ids || [];
  const relatedProducts = (selectedIds.length ? selectedIds.map(id => automaticRelated.find(item => item.id === id)).filter(Boolean) : automaticRelated).slice(0, Number(productPageSettings.related_limit) || 8);
  const fields = apiProduct.custom_fields || {};
  const contentText = (apiProduct.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return {
    collection: {
      slug: collectionSlug,
      name: parent.title,
      categories
    },
    category,
    featuredTitle: settings.product_featured_title || "More Featured Products",
    productPageSettings,
    relatedProducts,
    product: {
      id: apiProduct.id,
      slug: apiProduct.slug,
      name: apiProduct.title,
      image: apiProduct.image?.url || "/images/collection-bg.png",
      imageAlt: apiProduct.image?.alt || apiProduct.title,
      price: Number(fields.price || fields.product_price || 0),
      description: apiProduct.excerpt || contentText,
      returnPolicy: fields.return_policy || fields.product_return_policy || "",
      seo: apiProduct.seo || {}
    }
  };
}
async function loadContent({
  params
}) {
  const {
    collection: collectionSlug,
    category: categorySlug,
    product: productSlug
  } = await params;
  const data = await loadProductPage(collectionSlug, categorySlug, productSlug);
  if (!data) return null;
  const {
    collection,
    category,
    product,
    relatedProducts,
    featuredTitle,
    productPageSettings
  } = data;
  return {
    collectionSlug,
    categorySlug,
    productSlug,
    data,
    collection,
    category,
    product,
    relatedProducts,
    featuredTitle,
    productPageSettings
  };
}
function ContentView({
  collection,
  category,
  product,
  relatedProducts,
  featuredTitle,
  productPageSettings
}) {
  return <>
      <div className="pt-24 md:pt-32">
        <Breadcrumb items={[{
        label: productPageSettings.breadcrumb || "Collections"
      }, {
        label: collection.name,
        href: `/collections/${collection.slug}`
      }, {
        label: category.label,
        href: `/collections/${collection.slug}/${category.slug}`
      }, {
        label: product.name
      }]} />
      </div>

      <ProductInfo product={product} category={category} detailHref={`/collections/${collection.slug}/${category.slug}/${product.slug}`} settings={productPageSettings} />

      <FeaturedCarousel title={featuredTitle} items={relatedProducts} />
      <InstagramSection />
    </>;
}
export default function ProductContent({
  params
}) {
  const routeKey = JSON.stringify(params || {});
  const loader = useCallback(() => loadContent({
    params: JSON.parse(routeKey)
  }), [routeKey]);
  return <LivePage loader={loader} title="Product">{data => <ContentView {...data} />}</LivePage>;
}
