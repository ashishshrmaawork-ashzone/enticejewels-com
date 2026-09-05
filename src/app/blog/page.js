import BlogContent from "@/components/live/BlogContent";
export const metadata = {
  title: "Blog"
};
export default async function Page({
  params
}) {
  return <BlogContent params={await params} />;
}
