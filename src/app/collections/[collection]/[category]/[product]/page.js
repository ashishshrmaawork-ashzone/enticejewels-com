import Breadcrumb from "@/components/shared/Breadcrumb";
import InstagramSection from "@/components/shared/InstagramSection";
import FeaturedCarousel from "@/components/shared/FeaturedCarousel";
import ProductInfo from "@/components/shop/ProductInfo";
import { collections, getCollection, getCategory } from "@/data/collections";
import { getCategoryProducts, getProduct } from "@/data/catalog";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return Object.values(collections).flatMap((collection) =>
    collection.categories.flatMap((cat) =>
      getCategoryProducts(cat.slug).map((p) => ({
        collection: collection.slug,
        category: cat.slug,
        product: p.slug,
      }))
    )
  );
}

export async function generateMetadata({ params }) {
  const { category: categorySlug, product: productSlug } = await params;
  const product = getProduct(categorySlug, productSlug);
  return {
    title: product ? product.name : "Product",
    description: product?.description,
  };
}

export default async function ProductDetailPage({ params }) {
  const { collection: collectionSlug, category: categorySlug, product: productSlug } = await params;
  const collection = getCollection(collectionSlug);
  const category = getCategory(collectionSlug, categorySlug);
  const product = getProduct(categorySlug, productSlug);
  if (!collection || !category || !product) notFound();

  const featured = collection.categories
    .filter((c) => c.slug !== category.slug)
    .map((c) => ({
      href: `/collections/${collection.slug}/${c.slug}`,
      name: c.label,
      image: c.image,
    }));

  return (
    <>
      <div className="pt-24 md:pt-32">
        <Breadcrumb
          items={[
            { label: "Collections" },
            { label: collection.name, href: `/collections/${collection.slug}` },
          ]}
        />
      </div>

      <ProductInfo
        product={product}
        category={category}
        detailHref={`/collections/${collection.slug}/${category.slug}/${product.slug}`}
      />

      <FeaturedCarousel items={featured} />
      <InstagramSection />
    </>
  );
}
