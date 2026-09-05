// Fallback/demo content for News & Events and Blog. Both pages pull live data from
// the WordPress `news-events` endpoint first — these entries are used when that API
// is unreachable, and Blog also appends them after live posts so the listing has
// more than just the live test entries. `sections` (heading + paragraphs) drives the
// longer-form Blog layout; `intro`/`paragraphs` (its flattened form) keeps the
// simpler News detail page working unchanged.
export const newsItems = [
  {
    id: "china-expo-2026",
    title: "China International Expo, Hainan",
    image: "/images/news-slide-1.png",
    description: "Our show at China International Expo in Hainan was extremely successful.",
    sections: [
      {
        paragraphs: [
          "We are elated to announce that our show at China International Expo in Hainan from May 7 to 10 was extremely successful. The display of mesmerizing designs and colourful gemstones left visitors spellbound.",
        ],
      },
      {
        heading: "A Stage for Craftsmanship",
        paragraphs: [
          "Each piece on display carried the mark of generations of artistry — from hand-selected stones to settings finished entirely by hand. Visitors lingered over the couture cases, drawn in by the interplay of colour and light.",
          "Our team fielded questions on everything from gemstone provenance to bespoke commissioning, a reminder of how much curiosity fine jewellery still inspires.",
        ],
      },
      {
        heading: "Thank You",
        paragraphs: [
          "We are thankful to our team at the Expo for their efforts in bringing our collections to life on such a prestigious stage.",
        ],
      },
    ],
  },
  {
    id: "hainan-expo-2026",
    title: "Hainan Expo Highlights",
    image: "/images/news-slide-2.png",
    description: "A closer look at our showcase at the Hainan Expo this year.",
    sections: [
      {
        paragraphs: [
          "We are elated to announce that our show at China International Expo in Hainan from May 7 to 10 was extremely successful. The display of mesmerizing designs and colourful gemstones left visitors spellbound.",
        ],
      },
      {
        heading: "Highlights From the Floor",
        paragraphs: [
          "The couture booth drew steady crowds throughout the four days, with the signature floral motif pieces among the most photographed exhibits.",
        ],
      },
      {
        heading: "Looking Ahead",
        paragraphs: [
          "We are thankful to our team at the Expo for their efforts in bringing our collections to life on such a prestigious stage, and look forward to returning next year.",
        ],
      },
    ],
  },
  {
    id: "behind-the-scenes-entice-couture",
    title: "Behind the Scenes: Crafting the Entice Couture Collection",
    image: "/images/csr-1.png",
    description: "A look inside the atelier where sketches become heirloom pieces.",
    sections: [
      {
        paragraphs: [
          "Every Entice Couture piece begins as a pencil sketch long before it becomes a finished heirloom. Inside our Jaipur atelier, that journey can take anywhere from a few weeks to several months, depending on the intricacy of the design.",
        ],
      },
      {
        heading: "From Sketch to Stone",
        paragraphs: [
          "Once a design is approved, our gemologists hand-select stones that match the vision in colour, cut, and character — no two settings are ever quite the same.",
          "The setting process itself is done entirely by hand, with master craftsmen often spending days perfecting a single intricate section.",
        ],
      },
      {
        heading: "A Legacy of Detail",
        paragraphs: [
          "It's this obsession with detail, passed down across generations of artisans, that continues to define the Entice name.",
        ],
      },
    ],
  },
  {
    id: "meet-our-master-artisans",
    title: "Meet Our Master Artisans",
    image: "/images/csr-2.png",
    description: "The hands and stories behind every Entice creation.",
    sections: [
      {
        paragraphs: [
          "Behind every Entice piece is a craftsperson with decades of experience — many of whom learned the trade from their own parents and grandparents.",
        ],
      },
      {
        heading: "A Craft Passed Down",
        paragraphs: [
          "Our senior artisans have trained the next generation of setters and polishers on the same benches where they themselves once learned, keeping traditional techniques alive alongside modern precision tools.",
        ],
      },
      {
        heading: "Precision at Every Step",
        paragraphs: [
          "From stone-setting to final polish, each artisan specialises in a distinct stage of the process, ensuring that every piece meets the same exacting standard before it reaches you.",
        ],
      },
    ],
  },
  {
    id: "sustainable-sourcing-story",
    title: "The Story Behind Our Sustainable Sourcing",
    image: "/images/csr-3.png",
    description: "How we trace every stone back to a responsible origin.",
    sections: [
      {
        paragraphs: [
          "Responsible sourcing isn't a checkbox for us — it's a commitment that shapes every relationship we build with our suppliers.",
        ],
      },
      {
        heading: "Traceability, Stone by Stone",
        paragraphs: [
          "We work only with partners who can document the origin of their gemstones, ensuring every piece we create carries a story we can stand behind.",
        ],
      },
      {
        heading: "Our Ongoing Commitment",
        paragraphs: [
          "As our collections grow, so does our responsibility — one we take as seriously as the craftsmanship itself.",
        ],
      },
    ],
  },
  {
    id: "care-guide-fine-jewellery",
    title: "Care Guide: Preserving Your Fine Jewellery",
    image: "/images/csr-4.png",
    description: "Simple habits that keep your jewellery looking its best for generations.",
    sections: [
      {
        paragraphs: [
          "Fine jewellery is made to last generations, and a little care goes a long way in keeping it as radiant as the day it was made.",
        ],
      },
      {
        heading: "Everyday Habits",
        paragraphs: [
          "Store pieces separately to avoid scratching, remove jewellery before swimming or applying perfume, and give each piece a gentle wipe with a soft cloth after wear.",
        ],
      },
      {
        heading: "When to Visit Us",
        paragraphs: [
          "We recommend an annual check-up at any Entice boutique, where our team can inspect settings, clean stones professionally, and catch minor issues before they become bigger ones.",
        ],
      },
    ],
  },
];

export const getNewsItem = (slug) => newsItems.find((item) => item.id === slug);

// Flattened `intro` + `paragraphs` form, kept for the simpler News detail layout.
export const flattenSections = (item) => {
  const allParagraphs = item.sections.flatMap((section) => section.paragraphs);
  return { intro: allParagraphs[0] || "", paragraphs: allParagraphs.slice(1) };
};

// HTML form (heading + paragraphs, repeated), used by the longer-form Blog layout.
export const sectionsToHtml = (item) =>
  item.sections
    .map((section) => {
      const heading = section.heading ? `<h2>${section.heading}</h2>` : "";
      const body = section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
      return heading + body;
    })
    .join("");
