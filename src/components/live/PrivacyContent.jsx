"use client";

import { useCallback } from "react";
import LivePage from "@/components/live/LivePage";
import Link from "@/components/shared/ContentLink";
import { ChevronRight } from "lucide-react";
import { getPrivacyPolicyPage } from "@/lib/api";
async function loadContent() {
  const page = await getPrivacyPolicyPage();
  return {
    page
  };
}
function ContentView({
  page
}) {
  return <>
      <div className="pt-[84px] md:pt-[104px]">
        <div className="h-5 bg-maroon bg-[url('/images/about-banner-bg.png')] bg-cover bg-center" aria-hidden="true" />
      </div>
      <nav aria-label="Breadcrumb" className="mx-auto w-full px-5 py-7 sm:px-6 md:w-[87%] md:px-0 md:py-9">
        <ol className="flex items-center gap-2.5 text-sm uppercase tracking-wide">
          <li><Link href="/" className="text-ink-soft transition-colors hover:text-primary">Home</Link></li>
          <li aria-hidden="true"><ChevronRight size={14} className="text-ink-soft" /></li>
          <li className="font-semibold text-maroon" aria-current="page">{page.title}</li>
        </ol>
      </nav>
      <article className="pb-16 md:pb-24">
        <div className="mx-auto w-full px-5 sm:px-6 md:w-[87%] md:px-0">
          <div className="text-ink-soft [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&>p:first-child]:!mb-3 [&>p:first-child]:!text-base [&>p:nth-child(2)]:!mb-11 [&>p:nth-child(2)]:!text-lg [&>p:nth-child(2)]:!leading-[1.7] [&>p:nth-child(2)]:!text-ink md:[&>p:nth-child(2)]:!text-xl [&_section]:!mb-0 [&_section+section]:!mt-10 md:[&_section+section]:!mt-11 [&_section_h2]:!mb-3 [&_section_h2]:!font-body [&_section_h2]:!text-2xl [&_section_h2]:!font-semibold [&_section_h2]:!leading-snug [&_section_h2]:!text-maroon md:[&_section_h2]:!text-[28px] [&_section_p]:!text-base [&_section_p]:!leading-[1.75] [&_section_p]:!text-ink-soft md:[&_section_p]:!text-[17px] [&_section_p+p]:!mt-3" dangerouslySetInnerHTML={{
          __html: page.content
        }} />
        </div>
      </article>
    </>;
}
export default function PrivacyContent({
  params
}) {
  const routeKey = JSON.stringify(params || {});
  const loader = useCallback(() => loadContent({
    params: JSON.parse(routeKey)
  }), [routeKey]);
  return <LivePage loader={loader} title="Privacy Policy">{data => <ContentView {...data} />}</LivePage>;
}
