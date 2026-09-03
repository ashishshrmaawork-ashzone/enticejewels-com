"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, hydrated } = useCart();
  return (
    <main className="pb-16 md:pb-24 min-h-[45vh]">
      <section className="container mx-auto px-5 sm:px-6 md:px-8">
        {!hydrated ? null : wishlist.length === 0 ? (
          <div className="mx-auto max-w-2xl border border-maroon/10 bg-cream px-6 py-14 text-center sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-white text-primary"><Heart size={28} strokeWidth={1.5} /></div>
            <p className="mt-6 text-[10px] uppercase tracking-[3px] text-primary">Your Collection</p>
            <h2 className="mt-3 font-heading text-2xl text-maroon sm:text-3xl">Your wishlist is waiting</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">Save the Entice creations you love and revisit them whenever inspiration strikes.</p>
            <Link href="/collections/entice-fashion/" className="mt-7 inline-block bg-maroon px-8 py-3.5 text-xs uppercase tracking-[2px] text-white transition-colors hover:bg-maroon-light">Explore Products</Link>
          </div>
        ) : (
          <>
            <div className="mb-7 flex items-end justify-between border-b border-maroon/10 pb-4">
              <div><p className="text-[10px] uppercase tracking-[3px] text-primary">Saved Products</p><h2 className="mt-2 font-heading text-2xl text-maroon sm:text-3xl">Pieces You Love</h2></div>
              <p className="text-xs text-ink-soft">{wishlist.length} {wishlist.length === 1 ? "piece" : "pieces"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {wishlist.map((product) => (
                <article key={product.id} className="group overflow-hidden border border-maroon/10 bg-white transition-shadow duration-300 hover:shadow-[0_12px_35px_rgba(85,54,50,0.10)]">
                  <Link href={product.href} className="relative block aspect-square overflow-hidden bg-cream">{product.image && <Image src={product.image} alt={product.name} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-105" />}</Link>
                  <div className="p-4 sm:p-5">
                    <p className="text-[9px] uppercase tracking-[2px] text-primary">{product.category}</p>
                    <Link href={product.href} className="mt-2 block font-heading text-base leading-snug text-maroon transition-colors hover:text-primary sm:text-xl">{product.name}</Link>
                    <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
                      <button type="button" onClick={() => addToCart(product, 1)} className="flex items-center justify-center gap-2 bg-maroon px-3 py-3 text-[10px] uppercase tracking-[1px] text-white transition-colors hover:bg-maroon-light"><ShoppingBag size={14} /> Add to Cart</button>
                      <button type="button" aria-label={`Remove ${product.name} from wishlist`} onClick={() => toggleWishlist(product)} className="flex items-center justify-center border border-maroon/15 px-3 py-3 text-ink-soft transition-colors hover:border-primary hover:text-primary"><Trash2 size={15} /><span className="ml-2 text-[10px] uppercase sm:hidden">Remove</span></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
