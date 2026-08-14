import { Gloock, Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";

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

export const metadata = {
  metadataBase: new URL("https://enticejewels.com"),
  title: {
    default: "Entice Jewels | Treasures of Elegance",
    template: "%s | Entice Jewels",
  },
  description:
    "Entice Jewels crafts exquisite, unparalleled luxury fine jewellery — an ode to timeless design, exceptional craftsmanship and generations of legacy.",
  keywords: [
    "Entice Jewels",
    "Entice Couture",
    "luxury jewellery",
    "diamond jewellery",
    "fine jewellery brand",
    "KGK Group",
  ],
  authors: [{ name: "Entice Jewels" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Entice Jewels",
    title: "Entice Jewels | Treasures of Elegance",
    description:
      "An ode to an exquisite and unparalleled luxury — Entice Couture is a treasure to be inherited by generations.",
    url: "https://enticejewels.com",
    images: [{ url: "/images/home-banner.jpg", width: 1920, height: 1080 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Entice Jewels | Treasures of Elegance",
    description:
      "An ode to an exquisite and unparalleled luxury — Entice Couture is a treasure to be inherited by generations.",
    images: ["/images/home-banner.jpg"],
  },
  icons: { icon: "/images/entice-fashion-icon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${gloock.variable} ${openSans.variable}`}>
      <body className="antialiased font-body text-ink bg-white">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
