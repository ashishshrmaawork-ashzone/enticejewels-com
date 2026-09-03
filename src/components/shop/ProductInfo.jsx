import Image from "next/image";
import Accordion from "@/components/shared/Accordion";
import ProductActions from "@/components/shared/ProductActions";

function formatPrice(value, settings) {
  return `${settings.currency_symbol || "₹"}${value.toLocaleString("en-IN")}${settings.price_suffix ?? ".00"}`;
}

export default function ProductInfo({ product, category, detailHref, settings = {} }) {
  return (
    <section className="pb-16 md:pb-24">
      <div className="container mx-auto px-5 sm:px-6 md:px-8 grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-10 lg:gap-16">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
          <Image src={product.image} alt={product.imageAlt || product.name} fill unoptimized className="object-cover" />
        </div>

        <div>
          <p className="text-primary text-xs uppercase tracking-[3px] mb-2">{category.label}</p>
          <h1 className="font-heading text-maroon text-2xl md:text-3xl uppercase mb-3">
            {product.name}
          </h1>
          {product.price > 0 && <p className="text-ink text-lg mb-5">{formatPrice(product.price, settings)}</p>}
          {product.description && <p className="text-ink-soft text-sm leading-relaxed mb-8 max-w-md">{product.description}</p>}

          <div className="w-full md:max-w-xs mb-8">
            <ProductActions product={product} categoryLabel={category.label} href={detailHref} labels={settings} />
          </div>

          <Accordion
            items={[
              product.description && { title: settings.description_label || "Product Description", content: product.description },
              product.returnPolicy && { title: settings.return_policy_label || "Return Policy", content: product.returnPolicy },
            ].filter(Boolean)}
          />
        </div>
      </div>
    </section>
  );
}
