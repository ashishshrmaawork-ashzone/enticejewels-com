import ContactContent from "@/components/live/ContactContent";
export const metadata = {
  title: "Contact Us"
};
export default async function Page({
  params
}) {
  return <ContactContent params={await params} />;
}
