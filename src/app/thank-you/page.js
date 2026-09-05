import ThankYouContent from "@/components/live/ThankYouContent";
export const metadata = {
  title: "Thank You"
};
export default async function Page({
  params
}) {
  return <ThankYouContent params={await params} />;
}
