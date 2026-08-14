import Image from "next/image";
import Accordion from "@/components/shared/Accordion";
import ProductActions from "@/components/shared/ProductActions";

function formatPrice(value) {
  return `₹${value.toLocaleString("en-IN")}.00`;
}

export default function ProductInfo({ product, category, detailHref }) {
  return (
    <section className="pb-16 md:pb-24">
      <div className="container mx-auto px-5 sm:px-6 md:px-8 grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-10 lg:gap-16">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
          <Image src={product.image} alt={product.name} fill unoptimized className="object-cover" />
        </div>

        <div>
          <p className="text-primary text-xs uppercase tracking-[3px] mb-2">{category.label}</p>
          <h1 className="font-heading text-maroon text-2xl md:text-3xl uppercase mb-3">
            {product.name}
          </h1>
          <p className="text-ink text-lg mb-5">{formatPrice(product.price)}</p>
          <p className="text-ink-soft text-sm leading-relaxed mb-8 max-w-md">
            {product.description}
          </p>

          <div className="w-full md:max-w-xs mb-8">
            <ProductActions product={product} categoryLabel={category.label} href={detailHref} />
          </div>

          <Accordion
            items={[
              { title: "Product Description", content: product.description },
              {
                title: "Return Policy",
                content:
                  "As Entice creations are made to order and certified, returns are handled case-by-case — please reach out via Calling Request and our team will assist you.",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
