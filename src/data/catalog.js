import { collections } from "./collections";

// Sample catalog — 6 products per category, generated from the same reference
// image set. Swap `image` paths for real per-product photography later.
const productNames = ["Aurora", "Celeste", "Belle", "Iris", "Noor", "Ivy"];

const imageOrders = {
  necklace: [1, 2, 3, 4, 5, 6],
  rings: [2, 4, 6, 1, 3, 5],
  earring: [3, 5, 1, 6, 2, 4],
  bracelet: [4, 1, 5, 2, 6, 3],
  pendant: [5, 3, 2, 6, 4, 1],
  mangalsutra: [6, 2, 4, 3, 1, 5],
};

const categoryImages = Object.fromEntries(
  Object.entries(imageOrders).map(([category, order]) => [
    category,
    order.map((imageNumber) => `/images/necklace-${imageNumber}.jpg`),
  ])
);

function buildProducts(categoryLabel, categorySlug) {
  return productNames.map((name, i) => ({
    slug: `${categorySlug}-${i + 1}`,
    name: `${name} ${categoryLabel}`,
    price: 250000 + i * 125000,
    image: categoryImages[categorySlug]?.[i] || `/images/catalog-necklace-${(i % 6) + 1}.svg`,
    description:
      "Entice, KGK 1905' is a captivating tale of exquisite designs, timeless creations, divine luxury narrated by an unparalleled legacy. It blends the highest form of aestheticism, elegance and style that reflects the rare combination of classical",
  }));
}

export const catalog = Object.fromEntries(
  collections["entice-fashion"].categories.map((c) => [
    c.slug,
    buildProducts(c.label.replace(/s$/, ""), c.slug),
  ])
);

export const getCategoryProducts = (categorySlug) => catalog[categorySlug] || [];

export const getProduct = (categorySlug, productSlug) =>
  getCategoryProducts(categorySlug).find((p) => p.slug === productSlug);
