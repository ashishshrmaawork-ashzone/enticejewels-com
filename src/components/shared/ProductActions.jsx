"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, Check, Heart } from "lucide-react";
import CallingRequestModal from "@/components/shared/CallingRequestModal";
import { useCart } from "@/context/CartContext";

export default function ProductActions({ product, categoryLabel, href, labels = {} }) {
  const [qty, setQty] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart, wishlist, toggleWishlist, trackRecent } = useCart();
  const catalogProduct = { id: product.id, key: product.slug, name: product.name, image: product.image, price: product.price, category: categoryLabel, href };
  useEffect(() => { trackRecent(catalogProduct); }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
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
          aria-label={labels.decrease_quantity || "Decrease quantity"}
          className="w-8 h-8 rounded bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center text-sm">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          aria-label={labels.increase_quantity || "Increase quantity"}
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
            <Check size={14} /> {labels.added_to_cart || "Added to Cart"}
          </>
        ) : (
          labels.add_to_cart || "Add to Cart"
        )}
      </button>

      <div className="mb-3">
        <button type="button" onClick={() => toggleWishlist(catalogProduct)} className="w-full py-2.5 border border-black/15 rounded text-xs flex items-center justify-center gap-2 hover:border-primary"><Heart size={15} fill={wishlist.some((item) => item.id === product.id) ? "currentColor" : "none"} /> {wishlist.some((item) => item.id === product.id) ? "Saved" : "Wishlist"}</button>
      </div>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="block w-full py-3 rounded text-center text-xs uppercase tracking-[2px] font-semibold transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#553632", color: "#FFF1C1" }}
      >
        {labels.calling_request || "Calling Request"}
      </button>

      <CallingRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source="product"
        items={[{ id: product.id, title: product.name, slug: product.slug, category: categoryLabel, quantity: qty, price: product.price, href }]}
      />
    </div>
  );
}
