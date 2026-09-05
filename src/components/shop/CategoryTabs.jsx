import Link from "@/components/shared/ContentLink";
import clsx from "clsx";

export default function CategoryTabs({ collectionSlug, categories, activeSlug }) {
  return (
    <nav className="container mx-auto px-5 sm:px-6 md:px-8 pt-4 md:pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pb-8 md:pb-10 text-center">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/collections/${collectionSlug}/${c.slug}`}
          className={clsx(
            "text-xs md:text-sm uppercase tracking-wide pb-1 border-b transition-colors",
            c.slug === activeSlug
              ? "text-maroon border-maroon font-semibold"
              : "text-ink-soft border-transparent hover:text-maroon"
          )}
        >
          {c.label}
        </Link>
      ))}
    </nav>
  );
}
