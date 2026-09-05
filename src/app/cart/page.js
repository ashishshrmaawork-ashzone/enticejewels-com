"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CallingRequestModal from "@/components/shared/CallingRequestModal";
import CartItemRow from "@/components/cart/CartItemRow";
import EmptyCart from "@/components/cart/EmptyCart";
import OrderSummary from "@/components/cart/OrderSummary";
import Link from "@/components/shared/ContentLink";
import Image from "next/image";

export default function CartPage() {
  const { items, updateQty, removeFromCart, clearCart, hydrated, wishlist, recent, toggleWishlist } = useCart();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <PageHero image="/images/necklace-bg.jpg" alt="Your Cart">
        <h1 className="font-heading text-white text-3xl md:text-5xl">Your Cart</h1>
      </PageHero>

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />

      <section className="pb-14 sm:pb-16 md:pb-24 min-h-[40vh]">
        <div className="container mx-auto px-5 sm:px-6 md:px-8">
          {!hydrated ? null : items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-2 divide-y divide-black/10">
                {items.map((item) => (
                  <CartItemRow key={item.key} item={item} onUpdateQty={updateQty} onRemove={removeFromCart} />
                ))}
              </div>

              <OrderSummary onCallingRequest={() => setModalOpen(true)} />
            </div>
          )}
        </div>

        <CallingRequestModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          source="cart"
          items={items}
          onSuccess={clearCart}
        />
      </section>
      {[{ title: "Wishlist", list: wishlist, action: toggleWishlist }, { title: "Recently Viewed", list: recent }].map((section) => section.list.length ? <section key={section.title} className="pb-14"><div className="container mx-auto px-5 sm:px-6 md:px-8"><h2 className="font-heading text-maroon text-2xl md:text-3xl mb-6">{section.title}</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-5">{section.list.map((product) => <article key={product.id} className="border border-black/10 rounded-xl overflow-hidden"><Link href={product.href} className="relative block aspect-square bg-cream">{product.image && <Image src={product.image} alt={product.name} fill unoptimized className="object-cover" />}</Link><div className="p-4"><Link href={product.href} className="font-heading text-maroon">{product.name}</Link>{section.action && <button type="button" onClick={() => section.action(product)} className="block mt-3 text-xs text-red-700">Remove</button>}</div></article>)}</div></div></section> : null)}
    </>
  );
}
