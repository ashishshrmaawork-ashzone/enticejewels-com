import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="text-center py-12 sm:py-16 px-2">
      <ShoppingBag size={40} className="mx-auto text-ink-soft mb-4" />
      <p className="text-ink-soft text-sm mb-6">Your cart is empty.</p>
      <Link
        href="/collections/entice-fashion"
        className="inline-flex items-center justify-center gap-2 border border-maroon text-maroon text-xs uppercase tracking-[2px] px-6 sm:px-7 py-3 rounded-full hover:bg-maroon hover:text-white transition-colors duration-300"
      >
        Explore Collections
      </Link>
    </div>
  );
}
