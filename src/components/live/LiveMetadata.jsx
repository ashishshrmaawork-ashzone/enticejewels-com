"use client";

import { useEffect } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function LiveMetadata({ data, title = "Entice Jewels", missing = false }) {
  const settings = useSiteSettings();
  useEffect(() => {
    const page = data?.post || data?.item || data?.about || data?.contact || data?.page || data?.product || data?.category || data?.collection || data?.data?.product || data?.data?.category || data?.home || {};
    const seo = page.seo || {};
    const pageTitle = missing ? "Page not found" : seo.title || page.title || page.name || page.label || title;
    const description = seo.description || page.excerpt || page.description || page.heroTagline || page.tagline || settings.seo?.default_description || "";
    const image = page.header_image?.url || page.featured_image?.url || page.image?.url || (typeof page.image === "string" ? page.image : "") || page.heroImage || settings.seo?.default_og_image || "";
    const canonical = new URL(window.location.pathname, settings.seo?.canonical_base || window.location.origin).href;
    document.title = pageTitle;
    function meta(attribute, name, content) {
      let node = document.head.querySelector(`meta[${attribute}="${name}"]`);
      if (!node) {
        node = document.createElement("meta");
        node.setAttribute(attribute, name);
        document.head.appendChild(node);
      }
      node.content = content;
    }
    meta("name", "description", description);
    meta("property", "og:title", pageTitle);
    meta("property", "og:description", description);
    meta("property", "og:url", canonical);
    meta("property", "og:image", image ? new URL(image, window.location.origin).href : "");
    meta("name", "twitter:title", pageTitle);
    meta("name", "twitter:description", description);
    meta("name", "twitter:image", image ? new URL(image, window.location.origin).href : "");
    const privatePage = /\/(account|cart|wishlist|search|thank-you)\/?$/.test(window.location.pathname);
    meta("name", "robots", `${missing || privatePage || settings.robots?.index === false ? "noindex" : "index"},${settings.robots?.follow === false ? "nofollow" : "follow"}`);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [data, title, missing, settings]);
  return null;
}
