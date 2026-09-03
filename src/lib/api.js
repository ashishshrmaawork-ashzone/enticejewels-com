const API_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(/\/$/, "");
const customerAuthHeader = () => typeof window !== "undefined" && localStorage.getItem("entice-customer-token") ? { Authorization: `Bearer ${localStorage.getItem("entice-customer-token")}` } : {};

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not configured");
}

// Plain fetch wrapper. No automatic cache override here.
//
// Why: this project uses `output: 'export'`, which means every page must be
// fully resolvable at build time — there is no server left afterward to
// revalidate or render anything dynamically. Any GET request made from a
// Server Component (page.js, layout.js, generateStaticParams, etc.) during
// `next build` MUST use the default fetch caching behavior, or the build
// fails with "couldn't be rendered statically" / "Dynamic server usage".
//
// Functions below that are only ever called from the browser (auth, cart,
// forms, search, captcha) opt into `cache: "no-store"` explicitly in their
// own fetch options, since they run at runtime in the browser and never
// touch the static build.
const liveFetch = (url, options = {}) => fetch(url, options);

// ---------------------------------------------------------------------------
// Build-time content fetchers
// Called from Server Components / pages during `next build`.
// Must NOT use cache: "no-store" or revalidate: 0 — output: 'export' bakes
// these responses into the static HTML at build time. To pick up new
// WordPress content, re-run `next build` (e.g. trigger your deploy pipeline
// from a WordPress publish webhook).
// ---------------------------------------------------------------------------

export async function getHomePage() {
  const response = await liveFetch(`${API_BASE_URL}/home`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Unable to load home page (${response.status})`);

  const data = await response.json();
  if (!data || typeof data !== "object") throw new Error("Invalid home API response");

  // Compatibility for older backend responses during deployment.
  if (!data.sections && data.fields) {
    const fields = data.fields;
    data.sections = {
      hero: { video: fields.video },
      brands: { eyebrow: fields.entice_brands_headline, title: fields.treasures_of_elegance, description: fields.entice_brands_description },
      story: { eyebrow: fields.about_us, title: fields.our_story, content: fields.about_us_content, image: fields.about_us_image },
      uniqueness: { eyebrow: fields.entice_uniqueness, title: fields.what_makes_us_different, items: fields.entice_uniqueness_repeter },
      legacy: { video: fields.entice_uniqueness_video },
      csr: { eyebrow: fields.our_csr, title: fields.giving_back, subtitle: fields._a_sense_of_responsibility },
      news: { eyebrow: fields.entice_coverage, title: fields["news_&_events"], items: [fields["news_&_events_content_01"], fields["news_&_events_content_02"]].filter(Boolean) },
    };
  }

  return data;
}

export async function getGeneralSettings() {
  const response = await liveFetch(`${API_BASE_URL}/settings/general`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Unable to load general settings");
  return response.json();
}

// Browser-side refresh used by the global settings provider. This is a
// runtime-only call (invoked client-side after hydration), so cache:
// "no-store" is safe here — it never runs during the static build.
export async function getFreshGeneralSettings() {
  const separator = `${API_BASE_URL}/settings/general`.includes("?") ? "&" : "?";
  const response = await liveFetch(`${API_BASE_URL}/settings/general${separator}_=${Date.now()}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to refresh general settings");
  return response.json();
}

export async function getFrontendSeo(path = "/") {
  const settings = await getGeneralSettings().catch(() => ({}));
  const base = (settings.seo?.canonical_base || "https://enticejewels.com").replace(/\/$/, "");
  const route = path === "/" ? "/" : `/${String(path).replace(/^\/+|\/+$/g, "")}/`;
  return { settings, canonical: `${base}${route}` };
}

export async function getThankYouPage() {
  const response = await liveFetch(`${API_BASE_URL}/thank-you-page`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Unable to load Thank You page (${response.status})`);
  return response.json();
}

export async function getInstagramFeed(limit = 5) {
  const response = await liveFetch(`${API_BASE_URL}/instagram?limit=${limit}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Unable to load Instagram feed (${response.status})`);

  const data = await response.json();
  if (!data || !Array.isArray(data.items)) throw new Error("Invalid Instagram API response");
  return data;
}

export async function getNewsEvents() {
  const response = await liveFetch(`${API_BASE_URL}/news-events`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Unable to load news and events (${response.status})`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("Invalid news and events response");
  return data;
}

export async function getNewsPage() {
  const response = await liveFetch(`${API_BASE_URL}/news-page`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Unable to load news page (${response.status})`);
  return response.json();
}

export async function getNewsEventsPaged(page = 1, perPage = 6) {
  const response = await liveFetch(`${API_BASE_URL}/news-events-paged?page=${page}&per_page=${perPage}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Unable to load news and events (${response.status})`);
  return response.json();
}

export async function getNewsEvent(slug) {
  const response = await liveFetch(`${API_BASE_URL}/news-events/${encodeURIComponent(slug)}`, { headers: { Accept: "application/json" } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Unable to load news item (${response.status})`);
  return response.json();
}

export async function getCareersPage() {
  const response = await liveFetch(`${API_BASE_URL}/careers-page`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Unable to load careers page (${response.status})`);
  return response.json();
}

export async function getBlogPage() { const response = await liveFetch(`${API_BASE_URL}/blog-page`, { headers: { Accept: "application/json" } }); if (!response.ok) throw new Error("Unable to load blog page"); return response.json(); }
export async function getBlogs() { const response = await liveFetch(`${API_BASE_URL}/blogs`, { headers: { Accept: "application/json" } }); if (!response.ok) throw new Error("Unable to load blogs"); return response.json(); }
export async function getBlogsPaged(page = 1, perPage = 6) { const response = await liveFetch(`${API_BASE_URL}/blogs-paged?page=${page}&per_page=${perPage}`, { headers: { Accept: "application/json" } }); if (!response.ok) throw new Error("Unable to load blogs"); return response.json(); }
export async function getBlog(slug) { const response = await liveFetch(`${API_BASE_URL}/blogs/${encodeURIComponent(slug)}`, { headers: { Accept: "application/json" } }); if (!response.ok) return null; return response.json(); }

export async function getJobOpenings() {
  const response = await liveFetch(`${API_BASE_URL}/job-openings`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Unable to load job openings (${response.status})`);
  const data = await response.json();
  return Array.isArray(data.items) ? data.items : [];
}

export async function getContactPage() {
  const response = await liveFetch(`${API_BASE_URL}/contact-page`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Unable to load contact page (${response.status})`);
  return response.json();
}

export async function getPrivacyPolicyPage() {
  const response = await liveFetch(`${API_BASE_URL}/privacy-policy`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Unable to load Privacy Policy (${response.status})`);
  return response.json();
}

export async function getCsrItems() {
  const response = await liveFetch(`${API_BASE_URL}/csr`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Unable to load CSR items (${response.status})`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("Invalid CSR API response");
  return data;
}

export async function getCsrDetail(slug) {
  const response = await liveFetch(`${API_BASE_URL}/csr/${encodeURIComponent(slug)}`, { headers: { Accept: "application/json" } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Unable to load CSR detail (${response.status})`);
  return response.json();
}

export async function getAboutPageData() {
  const [aboutResponse, boutiquesResponse, inspirersResponse, categoriesResponse] = await Promise.all([
    liveFetch(`${API_BASE_URL}/about-us`, { headers: { Accept: "application/json" } }),
    liveFetch(`${API_BASE_URL}/about-us/boutiques`, { headers: { Accept: "application/json" } }),
    liveFetch(`${API_BASE_URL}/about-us/inspirers`, { headers: { Accept: "application/json" } }),
    liveFetch(`${API_BASE_URL}/entice-fashion/categories`, { headers: { Accept: "application/json" } }),
  ]);
  if (!aboutResponse.ok || !boutiquesResponse.ok || !inspirersResponse.ok || !categoriesResponse.ok) throw new Error("Unable to load About Us page data");
  const [about, boutiques, inspirers, categories] = await Promise.all([aboutResponse.json(), boutiquesResponse.json(), inspirersResponse.json(), categoriesResponse.json()]);
  return { about, boutiques, inspirers, categories };
}

export async function getParentCollections() {
  const response = await liveFetch(`${API_BASE_URL}/collections/parents`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Unable to load collections (${response.status})`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("Invalid collections response");
  return data;
}

export async function getCollectionCategories(collectionSlug) {
  const supported = ["entice-fashion", "entice-couture"];
  if (!supported.includes(collectionSlug)) return null;
  const response = await liveFetch(`${API_BASE_URL}/${collectionSlug}/categories`, { headers: { Accept: "application/json" } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Unable to load collection categories (${response.status})`);
  return response.json();
}

export async function getCollectionProducts(collectionSlug, categorySlug) {
  const response = await liveFetch(`${API_BASE_URL}/collections/${encodeURIComponent(collectionSlug)}/${encodeURIComponent(categorySlug)}/products`, { headers: { Accept: "application/json" } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Unable to load products (${response.status})`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("Invalid products response");
  return data;
}

export async function getCollectionProductDetail(collectionSlug, categorySlug, productSlug) {
  const response = await liveFetch(`${API_BASE_URL}/collections/${encodeURIComponent(collectionSlug)}/${encodeURIComponent(categorySlug)}/products/${encodeURIComponent(productSlug)}`, { headers: { Accept: "application/json" } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Unable to load product (${response.status})`);
  return response.json();
}

// ---------------------------------------------------------------------------
// Runtime-only fetchers
// Only ever called from the browser: client components, event handlers,
// useEffect, form submissions. These never execute during `next build`, so
// cache: "no-store" is safe and correct here — it keeps auth/cart/session
// state live without affecting static generation.
// ---------------------------------------------------------------------------

export async function getCatalogSession(token = "") {
  const response = await liveFetch(`${API_BASE_URL}/catalog/session`, { headers: { Accept: "application/json", ...(token ? { "X-Entice-Cart-Token": token } : {}), ...customerAuthHeader() }, cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load catalog session");
  return response.json();
}

export async function saveCatalogSession(token, state) {
  const response = await liveFetch(`${API_BASE_URL}/catalog/session`, { method: "PUT", headers: { Accept: "application/json", "Content-Type": "application/json", ...(token ? { "X-Entice-Cart-Token": token } : {}), ...customerAuthHeader() }, body: JSON.stringify(state) });
  if (!response.ok) throw new Error("Unable to save catalog session");
  return response.json();
}

async function customerRequest(path, body, method = "POST") { const response = await liveFetch(`${API_BASE_URL}/customers/${path}`, { method, headers: { Accept: "application/json", "Content-Type": "application/json", ...customerAuthHeader() }, ...(body ? { body: JSON.stringify(body) } : {}), cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.message || "Account request failed"); return data; }
export const registerCustomer = (form) => customerRequest("register", form);
export const loginCustomer = (form) => customerRequest("login", form);
export const forgotCustomerPassword = (email) => customerRequest("forgot-password", { email });
export const getCurrentCustomer = () => customerRequest("me", null, "GET");
export async function getCustomerPage(slug) { const response = await liveFetch(`${API_BASE_URL}/customer-pages/${encodeURIComponent(slug)}`, { headers: { Accept: "application/json" }, cache: "no-store" }); if (!response.ok) throw new Error("Unable to load customer page"); return response.json(); }

export async function subscribeNewsletter(email) {
  const response = await liveFetch(`${API_BASE_URL}/newsletter/subscribers`, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ email, website: "" }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to subscribe");
  return data;
}

export async function submitCareerApplication(formData) {
  const response = await liveFetch(`${API_BASE_URL}/career-applications`, { method: "POST", headers: { Accept: "application/json" }, body: formData });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to submit application");
  return data;
}

export async function submitContactEnquiry(form) {
  const response = await liveFetch(`${API_BASE_URL}/contact/enquiries`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ ...form, website: "" }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to send your message");
  return data;
}

export async function getContactCaptcha() {
  const response = await liveFetch(`${API_BASE_URL}/contact/captcha`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to load captcha");
  return data;
}

export async function submitAppointment(form) {
  const response = await liveFetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ ...form, website: "" }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to book the appointment");
  return data;
}

export async function submitCallingRequest(payload) {
  const endpointBySource = {
    product: "product/enquiries",
    cart: "cart/enquiries",
    checkout: "checkout/enquiries",
  };
  const endpoint = endpointBySource[payload.source];
  if (!endpoint) throw new Error("Invalid calling request source");
  const { source, ...requestPayload } = payload;
  const response = await liveFetch(`${API_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ ...requestPayload, website: "" }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to submit calling request");
  return data;
}

export async function searchProducts(query, { page = 1, perPage = 5, category = "", sort = "relevance", signal } = {}) {
  const params = new URLSearchParams({ q: query, page: String(page), per_page: String(perPage) });
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);
  const response = await liveFetch(`${API_BASE_URL}/products/search?${params}`, { headers: { Accept: "application/json" }, cache: "no-store", signal });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to search products");
  return data;
}