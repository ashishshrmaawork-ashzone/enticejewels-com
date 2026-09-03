import HomeContent from "@/components/home/HomeContent";
import { getFrontendSeo, getHomePage, getNewsEvents } from "@/lib/api";

export async function generateMetadata() {
  const globalSeo = await getFrontendSeo("/");
  return { alternates: { canonical: globalSeo.canonical } };
}

export default async function Home() {
  let sections = {};
  let newsEvents = [];
  const [homeResult, newsResult] = await Promise.allSettled([getHomePage(), getNewsEvents()]);
  if (homeResult.status === "fulfilled") sections = homeResult.value.sections || {};
  else console.error("Home API error:", homeResult.reason.message);
  if (newsResult.status === "fulfilled") newsEvents = newsResult.value;
  else console.error("News & Events API error:", newsResult.reason.message);
  return <HomeContent initialSections={sections} initialNewsEvents={newsEvents} />;
}
