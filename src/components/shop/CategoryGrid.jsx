import Link from "next/link";
import Image from "next/image";

export default function CategoryGrid({ collectionSlug, categories }) {
  return (
    <section className="pb-14 md:pb-20">
      <div className="container mx-auto px-5 sm:px-6 md:px-8 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/collections/${collectionSlug}/${cat.slug}`}
            className="group relative aspect-[4/5] rounded-xl overflow-hidden"
          >
            <Image
              src={cat.image}
              alt={cat.label}
              fill
              unoptimized
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute inset-0 flex items-end justify-center pb-6">
              <span className="font-body text-xl md:text-2xl" style={{ color: "#FFC9C9" }}>
                {cat.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
