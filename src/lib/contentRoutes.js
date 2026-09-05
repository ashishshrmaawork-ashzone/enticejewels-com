export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withoutBasePath(path) {
  return basePath && (path === basePath || path.startsWith(`${basePath}/`)) ? path.slice(basePath.length) || "/" : path;
}

export function withBasePath(path) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${basePath}${withoutBasePath(path)}`;
}

export function resolveContentRoute(path) {
  let parts;
  try {
    parts = withoutBasePath(path.split(/[?#]/)[0]).split("/").filter(Boolean).map(decodeURIComponent);
  } catch {
    return null;
  }
  if (parts.some(part => part.includes("/") || part === "." || part === "..")) return null;
  const [section, collection, category, product] = parts;
  if (["blog", "news", "csr"].includes(section) && parts.length === 2) return { type: section, params: { slug: collection } };
  if (section !== "collections") return null;
  if (parts.length === 2) return { type: "collection", params: { collection } };
  if (parts.length === 3) return { type: "category", params: { collection, category } };
  if (parts.length === 4) return { type: "product", params: { collection, category, product } };
  return null;
}
