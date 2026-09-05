import CustomerPageContent from "@/components/live/CustomerPageContent";
export const metadata = { title: "Wishlist", robots: { index: false, follow: false } };
export default function Layout({ children }) { return <CustomerPageContent slug="wishlist">{children}</CustomerPageContent>; }
