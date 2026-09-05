import PrivacyContent from "@/components/live/PrivacyContent";
export const metadata = {
  title: "Privacy Policy"
};
export default async function Page({
  params
}) {
  return <PrivacyContent params={await params} />;
}
