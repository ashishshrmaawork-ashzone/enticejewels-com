import NewsDetailContent from "@/components/live/NewsDetailContent";
import { getNewsEvents } from "@/lib/api";
export async function generateStaticParams() {
  try {
    const items = await getNewsEvents();
    return items.map(item => ({
      slug: item.slug || item.id
    }));
  } catch {
    return [];
  }
}
export const metadata = {
  title: "News & Events"
};
export default async function Page({
  params
}) {
  return <NewsDetailContent params={await params} />;
}
