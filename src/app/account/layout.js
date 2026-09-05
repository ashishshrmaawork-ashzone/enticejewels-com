import CustomerPageContent from "@/components/live/CustomerPageContent";
export const metadata = { title: "My Account", robots: { index: false, follow: false } };
export default function Layout({ children }) { return <CustomerPageContent slug="account">{children}</CustomerPageContent>; }
