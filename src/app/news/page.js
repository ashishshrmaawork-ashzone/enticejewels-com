import NewsContent from "@/components/live/NewsContent";
export const metadata = {
  title: "News & Events"
};
export default async function Page({
  params
}) {
  return <NewsContent params={await params} />;
}
