"use client";

import useLiveContent from "@/lib/useLiveContent";
import LiveMetadata from "@/components/live/LiveMetadata";

export default function LivePage({ loader, title, children }) {
  const { data, error, loaded } = useLiveContent(loader);
  if (!loaded) return <div className="container mx-auto px-5 py-32 text-center min-h-[50vh]" role="status">{error ? "Unable to load this page. Retrying shortly…" : "Loading…"}</div>;
  if (data === null) return <><LiveMetadata title={title} missing /><div className="container mx-auto px-5 py-32 text-center min-h-[50vh]"><h1 className="font-heading text-3xl text-maroon">Page not found</h1><p className="mt-4">This content is no longer available.</p></div></>;
  return <><LiveMetadata data={data} title={title} />{children(data)}</>;
}
