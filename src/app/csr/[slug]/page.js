import CsrContent from "@/components/live/CsrContent";
import { getCsrItems } from "@/lib/api";
export async function generateStaticParams() {
  try {
    const items = await getCsrItems();
    return items.map(item => ({
      slug: item.slug
    }));
  } catch {
    return [];
  }
}
export const metadata = {
  title: "Our CSR"
};
export default async function Page({
  params
}) {
  return <CsrContent params={await params} />;
}
