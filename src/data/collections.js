export const collections = {
  "entice-fashion": {
    slug: "entice-fashion",
    name: "Entice Fashion",
    tagline: "Redefines the sentiment of self-adornment, with a bold and contemporary style.",
    heroImage: "/images/collection-bg.png",
    categories: [
      {
        slug: "necklace",
        label: "Necklaces",
        image: "/images/collection-1.jpg",
        heroImage: "/images/necklace-bg.jpg",
        heroTagline: "Made to endure, designed to move.",
      },
      {
        slug: "rings",
        label: "Rings",
        image: "/images/collection-2.jpg",
        heroImage: "/images/necklace-bg.jpg",
        heroTagline: "A statement carried in every gesture.",
      },
      {
        slug: "earring",
        label: "Earrings",
        image: "/images/collection-3.jpg",
        heroImage: "/images/necklace-bg.jpg",
        heroTagline: "Framing every glance with brilliance.",
      },
      {
        slug: "bracelet",
        label: "Bracelets",
        image: "/images/collection-4.jpg",
        heroImage: "/images/necklace-bg.jpg",
        heroTagline: "Where elegance meets everyday grace.",
      },
      {
        slug: "pendant",
        label: "Pendants",
        image: "/images/collection-5.jpg",
        heroImage: "/images/necklace-bg.jpg",
        heroTagline: "A treasure held close to the heart.",
      },
      {
        slug: "mangalsutra",
        label: "Mangalsutra",
        image: "/images/collection-6.jpg",
        heroImage: "/images/necklace-bg.jpg",
        heroTagline: "A timeless symbol, reimagined.",
      },
    ],
  },
};

export const getCollection = (slug) => collections[slug];

export const getCategory = (collectionSlug, categorySlug) =>
  getCollection(collectionSlug)?.categories.find((c) => c.slug === categorySlug);
