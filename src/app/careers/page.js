import CareersContent from "@/components/live/CareersContent";
export const metadata = {
  title: "Careers"
};
export default async function Page({
  params
}) {
  return <CareersContent params={await params} />;
}
