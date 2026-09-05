"use client";

import { useCallback } from "react";
import LivePage from "@/components/live/LivePage";
import { Gem, Globe, TrendingUp, Users } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CareersInteractive from "@/components/careers/CareersInteractive";
import { getCareersPage, getJobOpenings } from "@/lib/api";
async function loadContent() {
  const [page, jobs] = await Promise.all([getCareersPage(), getJobOpenings()]);
  const icons = [Gem, TrendingUp, Globe, Users];
  const positions = jobs.map(job => ({
    id: job.id,
    title: job.job_title,
    experience: job.experience,
    skills: job.description || job.requirement || job.qualification
  }));
  return {
    page,
    jobs,
    icons,
    positions
  };
}
function ContentView({
  page,
  icons,
  positions
}) {
  return <>
    <PageHero image={page.hero.image || "/images/about-banner-bg.png"} alt={page.hero.image_alt || page.hero.title}><h1 className="font-heading text-white text-3xl md:text-5xl">{page.hero.title}</h1></PageHero>
    <Breadcrumb items={[{
      label: page.breadcrumbs.home,
      href: "/"
    }, {
      label: page.breadcrumbs.page
    }]} />
    <section className="pb-12 md:pb-16"><div className="container mx-auto px-5 sm:px-6 md:px-8 text-center max-w-3xl"><p className="text-primary text-xs uppercase tracking-[3px] mb-3">{page.intro.eyebrow}</p><h2 className="font-heading text-maroon text-2xl md:text-4xl leading-tight mb-5">{page.intro.title}</h2><p className="text-ink-soft text-sm md:text-base leading-relaxed">{page.intro.description}</p></div></section>
    <section className="py-14 md:py-20 bg-cream"><div className="container mx-auto px-5 sm:px-6 md:px-8"><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">{page.perks.filter(perk => perk.title || perk.description).map((perk, index) => {
            const Icon = icons[index] || Gem;
            return <div key={`${perk.title}-${index}`} className="text-center bg-white rounded-2xl px-6 py-8 shadow-sm"><div className="w-14 h-14 rounded-full bg-cream mx-auto mb-5 flex items-center justify-center text-maroon"><Icon size={22} /></div><h3 className="text-maroon text-base sm:text-lg font-semibold mb-2">{perk.title}</h3><p className="text-ink-soft text-sm leading-relaxed">{perk.description}</p></div>;
          })}</div></div></section>
    <CareersInteractive positions={positions} content={page} />
  </>;
}
export default function CareersContent({
  params
}) {
  const routeKey = JSON.stringify(params || {});
  const loader = useCallback(() => loadContent({
    params: JSON.parse(routeKey)
  }), [routeKey]);
  return <LivePage loader={loader} title="Careers">{data => <ContentView {...data} />}</LivePage>;
}
