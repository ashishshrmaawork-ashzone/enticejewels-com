const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const babel = require("next/dist/compiled/babel/core");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const flush = () => new Promise(setImmediate);

function hookHarness() {
  const state = [], callbacks = [], effects = [];
  const listeners = new Map();
  let cursor = 0, scheduled = [], timer, currentLoader;
  const same = (a, b) => a && b && a.length === b.length && a.every((v, i) => v === b[i]);
  const context = {
    JSON,
    document: { visibilityState: "visible", addEventListener: (n, f) => listeners.set(n, f), removeEventListener: n => listeners.delete(n) },
    window: {
      setInterval: (f, ms) => { assert.equal(ms, 5000); timer = f; return 1; },
      clearInterval: () => { timer = null; },
      addEventListener: (n, f) => listeners.set(n, f), removeEventListener: n => listeners.delete(n),
    },
    useState(initial) {
      const i = cursor++;
      if (!(i in state)) state[i] = typeof initial === "function" ? initial() : initial;
      return [state[i], value => { state[i] = typeof value === "function" ? value(state[i]) : value; }];
    },
    useEffect(fn, deps) {
      const i = cursor++;
      if (!same(effects[i]?.deps, deps)) scheduled.push(() => {
        effects[i]?.cleanup?.();
        effects[i] = { deps, cleanup: fn() };
      });
    },
    useCallback(fn, deps) {
      const i = cursor++;
      if (!same(callbacks[i]?.deps, deps)) callbacks[i] = { fn, deps };
      return callbacks[i].fn;
    },
  };
  vm.createContext(context);
  const source = read("src/lib/useLiveContent.js").replace(/import[^;]+;/, "").replace("export default function", "function");
  vm.runInContext(source + "\nthis.hook = useLiveContent;", context);
  return {
    context,
    render(loader = currentLoader) {
      currentLoader = loader; cursor = 0; scheduled = [];
      const value = context.hook(loader);
      scheduled.forEach(fn => fn());
      return value;
    },
    tick: () => timer?.(),
    event: name => listeners.get(name)?.(),
    unmount: () => effects.forEach(effect => effect?.cleanup?.()),
    listeners,
  };
}

test("refresh updates open pages, preserves good data on errors, handles removal, and pauses hidden tabs", async () => {
  const h = hookHarness();
  let value = { title: "Original" }, failure = false, calls = 0;
  const loader = async () => { calls++; if (failure) throw Error("offline"); return value; };
  assert.equal(h.render(loader).loading, true);
  await flush(); assert.equal(h.render().data.title, "Original");
  value = { title: "Edited in WordPress" };
  await h.tick(); assert.equal(h.render().data.title, value.title);
  const saved = h.render().data;
  failure = true; await h.tick(); assert.equal(h.render().data, saved); assert(h.render().error);
  h.context.document.visibilityState = "hidden";
  const count = calls; await h.tick(); assert.equal(calls, count);
  h.context.document.visibilityState = "visible"; failure = false;
  await h.event("visibilitychange"); assert.equal(h.render().error, null);
  value = null; await h.tick(); assert.equal(h.render().loaded, true); assert.equal(h.render().data, null);
  h.unmount(); assert.equal(h.listeners.size, 0);
});

test("an old route response cannot overwrite a new route, and requests never overlap", async () => {
  const h = hookHarness(); let resolveOld, resolveNew, calls = 0;
  const old = () => { calls++; return new Promise(resolve => { resolveOld = resolve; }); };
  h.render(old); await h.tick(); assert.equal(calls, 1);
  const next = () => new Promise(resolve => { resolveNew = resolve; });
  assert.equal(h.render(next).data, null);
  resolveNew({ title: "New route" }); await flush();
  resolveOld({ title: "Old route" }); await flush();
  assert.equal(h.render().data.title, "New route");
  h.unmount();
});

test("new CMS routes resolve at root and in a deployment subfolder", () => {
  for (const base of ["", "/enticejewels.com"]) {
    const context = { process: { env: { NEXT_PUBLIC_BASE_PATH: base } }, decodeURIComponent };
    vm.createContext(context);
    vm.runInContext(read("src/lib/contentRoutes.js").replaceAll("export ", ""), context);
    for (const [url, type] of [["/blog/new-post/", "blog"], ["/news/new-event/", "news"], ["/csr/new-project/", "csr"], ["/collections/new-collection/", "collection"], ["/collections/entice-fashion/necklace/", "category"], ["/collections/entice-fashion/necklace/new-product/", "product"]]) {
      assert.equal(context.resolveContentRoute(base + url).type, type);
      assert.equal(context.withBasePath(url), base + url);
      assert.equal(context.withBasePath(base + url), base + url);
    }
    for (const url of ["/blog/", "/about-us/", "/blog/%2Fbad", "/blog/%", "/collections/a/b/c/d"]) assert.equal(context.resolveContentRoute(url), null);
  }
});

function loadModule(file, mocks = {}, extra = "") {
  const exports = {};
  const code = babel.transformSync(read(file) + extra, { presets: [require.resolve("next/babel")], envName: "test", filename: file, babelrc: false, configFile: false }).code;
  const stub = name => ({ children, ...props }) => React.createElement("section", { "data-component": name, "data-props": JSON.stringify(props) }, children);
  const localRequire = name => {
    if (name in mocks) return mocks[name];
    if (name.startsWith("@babel/runtime/")) return require(`next/dist/compiled/${name}`);
    if (name === "lucide-react") return new Proxy({}, { get: (_, key) => stub(key) });
    if (name.startsWith("@/components/") || name === "next/image") return stub(name);
    return require(name);
  };
  vm.runInNewContext(code, { exports, require: localRequire, console, process, URL, URLSearchParams, AbortSignal, fetch, setTimeout, clearTimeout }, { filename: file });
  return exports;
}

test("every migrated page loads edited content and propagates failures instead of replacing content", async () => {
  let version = "Original", failed = false, removed = false;
  const post = () => ({ id: 1, slug: "sample", title: version, excerpt: version, content: `<p>${version}</p>`, image: { url: "/image.jpg" }, custom_fields: { price: 100 }, seo: { title: version } });
  const page = () => ({ title: version, hero: { title: version }, breadcrumbs: { home: "Home", page: version }, labels: {}, seo: { title: version }, posts_per_page: 9, intro: {}, perks: [], positions: {}, form: {} });
  const category = () => ({ id: 1, slug: "necklaces", title: version, image: "/image.jpg" });
  const methods = {
    getContactPage: () => ({ ...post(), custom_fields: { entice_jewels: version } }),
    getCareersPage: page, getJobOpenings: () => [], getPrivacyPolicyPage: post,
    getThankYouPage: () => ({ heading: version }), getNewsPage: page, getBlogPage: page,
    getNewsEvent: () => removed ? null : post(), getBlog: () => removed ? null : post(),
    getBlogs: () => [post()], getCsrDetail: () => removed ? null : post(),
    getParentCollections: () => removed ? [] : [{ slug: "entice-fashion", title: version }],
    getCollectionCategories: () => [category()], getCollectionProducts: () => [post()],
    getCollectionProductDetail: () => removed ? null : post(), getGeneralSettings: () => ({}),
  };
  const api = Object.fromEntries(Object.entries(methods).map(([name, fn]) => [name, async () => { if (failed) throw Error("API offline"); return fn(); }]));
  const files = ["Contact", "Careers", "Privacy", "ThankYou", "News", "Blog", "NewsDetail", "BlogDetail", "Csr", "Collection", "Category", "Product"];
  for (const name of files) {
    const loadedModule = loadModule(`src/components/live/${name}Content.jsx`, { "@/lib/api": api }, "\nexport { loadContent, ContentView };");
    const args = { params: { slug: "sample", collection: "entice-fashion", category: "necklace", product: "sample" } };
    version = "Original";
    assert.match(renderToStaticMarkup(React.createElement(loadedModule.ContentView, await loadedModule.loadContent(args))), /Original/);
    version = "Updated";
    assert.match(renderToStaticMarkup(React.createElement(loadedModule.ContentView, await loadedModule.loadContent(args))), /Updated/);
    failed = true; await assert.rejects(loadedModule.loadContent(args), /API offline/); failed = false;
    if (["NewsDetail", "BlogDetail", "Csr", "Collection", "Category", "Product"].includes(name)) {
      removed = true; assert.equal(await loadedModule.loadContent(args), null); removed = false;
    }
  }
});

test("browser GETs bypass caches, while exports and writes keep their request semantics", async () => {
  const source = read("src/lib/api.js").replaceAll("export ", "");
  const requests = [];
  const context = { process: { env: { NEXT_PUBLIC_WORDPRESS_API_URL: "https://backend.example/wp-json/entice/v1" } }, URL, URLSearchParams, Date, AbortSignal, fetch: async (url, options) => { requests.push({ url, options }); return { ok: true, json: async () => ({}) }; } };
  vm.createContext(context); vm.runInContext(source, context);
  await context.getHomePage(); assert.equal(requests.at(-1).options.cache, undefined);
  context.window = {};
  await context.getHomePage(); assert.equal(requests.at(-1).options.cache, "no-store"); assert(new URL(requests.at(-1).url).searchParams.has("_"));
  await context.submitContactEnquiry({ name: "Test" }); assert.equal(requests.at(-1).options.method, "POST"); assert(!new URL(requests.at(-1).url).searchParams.has("_"));
});

test("listing refresh preserves the selected page and recovers when deletion removes that page", async () => {
  const h = hookHarness(); let pages = 3, title = "Original";
  h.context.document.getElementById = () => ({ scrollIntoView() {} });
  h.context.fetchPage = async page => ({ items: [{ title }], pagination: { page, total_pages: pages } });
  const source = read("src/lib/useLiveListing.js").replace(/import[^;]+;/g, "").replace("export default function", "function");
  vm.runInContext(source + '\nthis.hook = () => useLiveListing(fetchPage, 6, "blog-listing");', h.context);
  h.render(); await flush();
  h.render().go(2); h.render(); await flush();
  assert.equal(h.render().data.pagination.page, 2);
  title = "Updated"; await h.tick();
  assert.equal(h.render().data.pagination.page, 2);
  assert.equal(h.render().data.items[0].title, "Updated");
  pages = 1; await h.tick(); assert.equal(h.render().data.pagination.page, 1);
  h.unmount();
});
