"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CallingRequestModal from "@/components/shared/CallingRequestModal";
import CartItemRow from "@/components/cart/CartItemRow";
import EmptyCart from "@/components/cart/EmptyCart";
import OrderSummary from "@/components/cart/OrderSummary";

export default function CartPage() {
  const { items, updateQty, removeFromCart, totalPrice, hydrated } = useCart();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="pt-28 sm:pt-32 md:pt-36 pb-14 sm:pb-16 md:pb-24 min-h-[60vh]">
      <div className="container-fluid">
        <h1 className="font-heading text-maroon text-2xl sm:text-3xl md:text-4xl mb-8 sm:mb-10 md:mb-14">
          Your Cart
        </h1>

        {!hydrated ? null : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-2 divide-y divide-black/10">
              {items.map((item) => (
                <CartItemRow key={item.key} item={item} onUpdateQty={updateQty} onRemove={removeFromCart} />
              ))}
            </div>

            <OrderSummary totalPrice={totalPrice} onCallingRequest={() => setModalOpen(true)} />
          </div>
        )}
      </div>

      <CallingRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
