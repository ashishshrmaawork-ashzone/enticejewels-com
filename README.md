# Entice Jewels — Website

Next.js (App Router) + Tailwind CSS v4, exported as a fully static site — same
approach as `kgk-jewellery`. No Node process or terminal access is needed on
the server; you just upload the generated files.

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
