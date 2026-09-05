"use client";

import { forwardRef } from "react";
import NextLink from "next/link";
import { resolveContentRoute, withBasePath } from "@/lib/contentRoutes";

// A new CMS slug has no exported RSC payload. Let the host serve its live
// HTML shell instead of asking Next's client router for a nonexistent payload.
const ContentLink = forwardRef(function ContentLink({ href, children, prefetch, replace, scroll, shallow, locale, onNavigate, ...props }, ref) {
  if (typeof href === "string" && href.startsWith("/") && !href.startsWith("//") && resolveContentRoute(href)) {
    return <a {...props} ref={ref} href={withBasePath(href)}>{children}</a>;
  }
  return <NextLink {...props} ref={ref} href={href} prefetch={prefetch} replace={replace} scroll={scroll} shallow={shallow} locale={locale} onNavigate={onNavigate}>{children}</NextLink>;
});

export default ContentLink;
