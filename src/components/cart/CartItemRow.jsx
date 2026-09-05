import Link from "@/components/shared/ContentLink";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

export function formatPrice(value) {
  return `₹${value.toLocaleString("en-IN")}.00`;
}

export default function CartItemRow({ item, onUpdateQty, onRemove }) {
  return (
    <article className="flex gap-3 sm:gap-4 md:gap-6 py-5 sm:py-6 first:pt-0 min-w-0">
      <Link href={item.href} className="relative w-20 h-24 sm:w-24 sm:h-28 md:w-32 md:h-36 rounded-lg overflow-hidden flex-shrink-0">
        <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
      </Link>

      <div className="flex-1 min-w-0 grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center gap-3 sm:gap-5">
        <div className="min-w-0">
          <p className="text-primary text-[11px] uppercase tracking-[2px] mb-1">{item.category}</p>
          <Link href={item.href} className="block font-heading text-maroon text-sm sm:text-base md:text-lg leading-snug break-words hover:text-primary transition-colors">
            {item.name}
          </Link>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2" aria-label={`Quantity: ${item.qty}`}>
            <button
              type="button"
              onClick={() => onUpdateQty(item.key, item.qty - 1)}
              aria-label="Decrease quantity"
              disabled={item.qty <= 1}
              className="w-10 h-10 rounded bg-black/5 hover:bg-black/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm" aria-live="polite">{item.qty}</span>
            <button
              type="button"
              onClick={() => onUpdateQty(item.key, item.qty + 1)}
              aria-label="Increase quantity"
              className="w-10 h-10 rounded bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.key)}
            aria-label={`Remove ${item.name}`}
            className="min-w-10 h-10 px-2 rounded flex items-center justify-center gap-1.5 text-ink-soft hover:text-maroon hover:bg-black/5 transition-colors"
          >
            <Trash2 size={17} />
            <span className="hidden min-[400px]:inline sm:hidden text-xs">Remove</span>
          </button>
        </div>
      </div>
    </article>
  );
}
