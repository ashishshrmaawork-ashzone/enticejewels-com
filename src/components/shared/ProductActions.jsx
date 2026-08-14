"use client";

import { useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import CallingRequestModal from "@/components/shared/CallingRequestModal";
import { useCart } from "@/context/CartContext";

export default function ProductActions({ product, categoryLabel, href }) {
  const [qty, setQty] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(
      {
        key: product.slug,
        name: product.name,
        image: product.image,
        price: product.price,
        category: categoryLabel,
        href,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="w-8 h-8 rounded bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center text-sm">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          aria-label="Increase quantity"
          className="w-8 h-8 rounded bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="w-full py-3 rounded text-xs uppercase tracking-[2px] font-semibold mb-3 flex items-center justify-center gap-2 transition-colors hover:opacity-90"
        style={{ backgroundColor: added ? "#F3DF9E" : "#232020", color: added ? "#232020" : "#fff" }}
      >
        {added ? (
          <>
            <Check size={14} /> Added to Cart
          </>
        ) : (
          "Add to Cart"
        )}
      </button>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="block w-full py-3 rounded text-center text-xs uppercase tracking-[2px] font-semibold transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#553632", color: "#FFF1C1" }}
      >
        Calling Request
      </button>

      <CallingRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
