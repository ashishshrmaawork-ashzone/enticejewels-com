import { Gloock, Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { AuthProvider } from "@/context/AuthContext";
import { getGeneralSettings } from "@/lib/api";

const gloock = Gloock({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-gloock",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

export async function generateMetadata() {
  const settings = await getGeneralSettings().catch(() => ({}));
  const robots = settings.robots || { index: true, follow: true };
  const seo = settings.seo || {};
  const canonicalBase = seo.canonical_base || "https://enticejewels.com";
  const defaultTitle = seo.default_title || "Entice Jewels | Treasures of Elegance";
  const defaultDescription = seo.default_description || "Discover exceptional fine jewellery, timeless design and master craftsmanship from Entice Jewels.";
  const defaultImage = seo.default_og_image || "/images/home-banner.jpg";
  return {
  metadataBase: new URL(canonicalBase),
  title: {
    default: defaultTitle,
    template: "%s | Entice Jewels",
  },
  description: defaultDescription,
  keywords: [
    "Entice Jewels",
    "Entice Couture",
    "luxury jewellery",
    "diamond jewellery",
    "fine jewellery brand",
    "KGK Group",
  ],
  authors: [{ name: "Entice Jewels" }],
  robots: {
    index: robots.index !== false,
    follow: robots.follow !== false,
    googleBot: { index: robots.index !== false, follow: robots.follow !== false },
  },
  openGraph: {
    type: "website",
    siteName: seo.og_site_name || "Entice Jewels",
    title: defaultTitle,
    description: defaultDescription,
    url: canonicalBase,
    images: [{ url: defaultImage }],
  },
  twitter: {
    card: seo.twitter_card || "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultImage],
  },
  icons: {
    icon: [{ url: "/images/fevicon.png", type: "image/png" }],
    shortcut: [{ url: "/images/fevicon.png", type: "image/png" }],
    apple: [{ url: "/images/fevicon.png", type: "image/png" }],
  },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${gloock.variable} ${openSans.variable}`}>
      <body className="antialiased font-body text-ink bg-white">
        <AuthProvider><CartProvider>
          <SiteSettingsProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          </SiteSettingsProvider>
        </CartProvider></AuthProvider>
      </body>
    </html>
  );
}
