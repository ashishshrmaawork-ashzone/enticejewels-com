import Link from "next/link";
import Image from "next/image";

export default function ProductGrid({ basePath, products }) {
  if (!products.length) {
    return (
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-5 sm:px-6 md:px-8 py-16 text-center rounded-xl border border-black/10 bg-cream">
          <h2 className="font-heading text-maroon text-2xl md:text-3xl">No products found</h2>
          <p className="mt-2 text-sm text-ink-soft">Products will appear here when they are added to this category.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-16 md:pb-24">
      <div className="container mx-auto px-5 sm:px-6 md:px-8 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`${basePath}/${product.slug}`}
            className="group relative aspect-[4/5] rounded-xl overflow-hidden"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
