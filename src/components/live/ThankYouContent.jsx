"use client";

import { useCallback } from "react";
import LivePage from "@/components/live/LivePage";
import Link from "@/components/shared/ContentLink";
import { getThankYouPage } from "@/lib/api";
async function loadContent() {
  const page = await getThankYouPage();
  const image = page.image?.url || "/images/about-banner-bg.png";
  return {
    page,
    image
  };
}
function ContentView({
  page,
  image
}) {
  return <section className="relative min-h-[70vh] flex items-center justify-center bg-cover bg-center px-5 py-20 text-center" style={{
    backgroundImage: `linear-gradient(rgba(45,20,18,.74),rgba(45,20,18,.74)),url(${image})`
  }}>
      <div className="max-w-2xl rounded-sm bg-white/95 px-6 py-12 shadow-2xl sm:px-12 md:py-16">
        <p className="mb-3 text-xs uppercase tracking-[4px] text-primary">Entice Jewels</p>
        <h1 className="mb-5 font-heading text-4xl text-maroon md:text-6xl">{page.heading || "Thank You"}</h1>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-ink-soft md:text-base">{page.message || "Your request has been received. Our team will get in touch with you shortly."}</p>
        <Link href={page.button_url || "/"} className="inline-flex bg-maroon px-8 py-3 text-xs uppercase tracking-[2px] text-white transition-colors hover:bg-primary">{page.button_label || "Back to Home"}</Link>
      </div>
    </section>;
}
export default function ThankYouContent({
  params
}) {
  const routeKey = JSON.stringify(params || {});
  const loader = useCallback(() => loadContent({
    params: JSON.parse(routeKey)
  }), [routeKey]);
  return <LivePage loader={loader} title="Thank You">{data => <ContentView {...data} />}</LivePage>;
}
