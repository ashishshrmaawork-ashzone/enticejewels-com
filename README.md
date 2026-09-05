# Entice Jewels — Website

Next.js (App Router) + Tailwind CSS v4, exported as a fully static site — same
approach as `kgk-jewellery`. No Node process or terminal access is needed on
the server; you just upload the generated files.

## Live WordPress content

The homepage, About, contact, careers, privacy policy, thank-you page, blog and
news listings/details, CSR details, collections/categories/products, Instagram,
and account/wishlist page copy load content directly from WordPress in the
browser. Header/footer settings and product search also refresh at runtime.
Visible tabs check every five seconds and refresh when focus or connectivity
returns. Content edits do not require another build or a page reload; allow
the polling interval plus API response time. Failed refreshes retain the last
successful content and retry. Forms and the selected listing page stay intact.

After installing this code, run `npm run build` and upload the **entire contents
of `out/`, including the hidden `.htaccess` file**, once. `postbuild` prepares
the Apache rules and the correct 404 path. New blog/news/CSR and collection,
category, or product URLs use `out/live/index.html` when no exported file exists.
Apache requires `mod_rewrite` and permission to apply `.htaccess` rules. Vercel
uses the included `vercel.json` rewrites. Links to CMS detail pages request a
full document so newly published URLs do not depend on an old Next route payload.

`NEXT_PUBLIC_WORDPRESS_API_URL` must point at the public WordPress API. It must
allow browser requests from the frontend origin (CORS), and any backend/CDN
cache must return current published content. Client GETs use `no-store` and a
fresh query parameter. API or deployment URL changes require a new build because
Next embeds public environment variables into JavaScript.

Set `NEXT_PUBLIC_BASE_PATH=` for domain-root hosting, or
`NEXT_PUBLIC_BASE_PATH=/enticejewels.com` for that subfolder. The default is the
subfolder locally/on shared hosting and the domain root on Vercel. The supplied
Vercel rewrites target domain-root hosting.

Browser title/description/social meta tags refresh with content. The exported
HTML metadata and `sitemap.xml` remain build snapshots, and bots that do not run
JavaScript will not see browser-only updates. Changing site code or adding a
new page *type* still requires deployment; publishing items in existing CMS
types does not. See [Next.js static export documentation](https://nextjs.org/docs/app/guides/static-exports).

Run `npm run test:live` for refresh, race, pagination, API and page-rendering
checks. After a build, `node --test scripts/test-static-host.cjs` additionally
checks actual Apache rewrites when a local Windows XAMPP Apache installation is
available (`APACHE_BINARY` can override its path).

## Stack

- Next.js 15 (App Router), static export (`output: 'export'` in `next.config.js`)
- Tailwind CSS v4 (theme lives in `src/app/globals.css`, no `tailwind.config.js`)
- `swiper` for all carousels/sliders
- `framer-motion` for scroll and hover animations
- `lucide-react` for icons
- Fonts: **Gloock** (headings) + **Open Sans** (body), loaded via `next/font/google`

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build & deploy (no server terminal required)

```bash
npm run build
```

This produces a fully static site in the `out/` folder — plain HTML, CSS, JS,
images and video. Zip the contents of `out/` and upload/extract them to your
web server's document root (cPanel File Manager, FTP, etc.). `.htaccess` is
already included for cache headers and the 404 page. There is nothing to
run on the server — it's just static files.

## Project structure

```
src/
  app/
    layout.js        Root layout: fonts, <Header/>, <Footer/>, SEO metadata
    page.js           Home page — assembles all home sections
    globals.css       Tailwind v4 theme (colors, fonts, custom utilities)
  components/
    layout/           Header.jsx, Footer.jsx
    home/             One component per homepage section
  data/               Static content arrays consumed by the home components
public/
  images/             Placeholder SVG imagery (see note below)
  videos/legacy.mp4   "Inspired to shine" banner footage
```

## ⚠️ Placeholder imagery

Real photography wasn't available yet, so every product/story/CSR/news image
in `public/images/*.svg` is a generated placeholder (gold/maroon gradient +
label). Swap them for the client's real photos before going live — same
filenames, drop in `.jpg`/`.png` and update the `src` extension in the
matching file under `src/data/` or `src/components/home/`.

## Inner pages

The site includes About Us, the Entice Fashion collection landing page,
category listings, product details, a persistent client-side cart, and a
Coming Soon fallback for navigation items whose designs are not available yet.
