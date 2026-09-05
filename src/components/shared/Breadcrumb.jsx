import Link from "@/components/shared/ContentLink";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="container mx-auto px-5 sm:px-6 md:px-8 py-6 md:py-8">
      <ol className="flex flex-wrap items-center gap-2 text-xs md:text-sm uppercase tracking-wide">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {isLast || !item.href ? (
                <span className="text-maroon font-semibold">{item.label}</span>
              ) : (
                <Link href={item.href} className="text-ink-soft hover:text-primary transition-colors">
                  {item.label}
                </Link>
              )}
              {!isLast && <ChevronRight size={13} className="text-ink-soft" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
