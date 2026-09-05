"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { resolveContentRoute } from "@/lib/contentRoutes";

const components = {
  blog: dynamic(() => import("./BlogDetailContent")),
  news: dynamic(() => import("./NewsDetailContent")),
  csr: dynamic(() => import("./CsrContent")),
  collection: dynamic(() => import("./CollectionContent")),
  category: dynamic(() => import("./CategoryContent")),
  product: dynamic(() => import("./ProductContent")),
};
const subscribe = callback => {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
};
const getPath = () => window.location.pathname;
const getServerPath = () => "";

export default function LiveRoute() {
  const path = useSyncExternalStore(subscribe, getPath, getServerPath);
  if (!path) return <div className="py-32 text-center" role="status">Loading…</div>;
  const route = resolveContentRoute(path);
  if (!route) return <div className="py-32 text-center"><h1>Page not found</h1></div>;
  const Content = components[route.type];
  return <Content key={path} params={route.params} />;
}
