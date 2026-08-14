import Link from "next/link";
import Image from "next/image";

export default function ProductGrid({ basePath, products }) {
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
