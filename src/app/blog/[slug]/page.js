import BlogDetailContent from "@/components/live/BlogDetailContent";
import { getBlogs } from "@/lib/api";
export async function generateStaticParams() {
  return (await getBlogs().catch(() => [])).map(p => ({
    slug: p.slug
  }));
}
export const metadata = {
  title: "Blog"
};
export default async function Page({
  params
}) {
  return <BlogDetailContent params={await params} />;
}
