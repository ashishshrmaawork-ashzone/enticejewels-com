"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function Accordion({ items }) {
  const [open, setOpen] = useState(null);

  return (
    <div>
      {items.map((item, i) => (
        <div key={item.title} className="border-b border-black/10">
          <button
            type="button"
            onClick={() => setOpen((o) => (o === i ? null : i))}
            className="w-full flex items-center justify-between py-4 text-left"
          >
            <span className="text-sm md:text-base text-ink">{item.title}</span>
            {open === i ? <Minus size={16} className="text-maroon" /> : <Plus size={16} className="text-maroon" />}
          </button>
          {open === i && (
            <div className="pb-4 text-sm text-ink-soft leading-relaxed">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
