import Link from "next/link";
import { getFrontendSeo, getThankYouPage } from "@/lib/api";

export async function generateMetadata() {
  const globalSeo = await getFrontendSeo("/thank-you/");
  return { title: "Thank You", description: "Thank you for contacting Entice Jewels. Our team will get in touch with you shortly.", robots: { index: false, follow: true }, alternates: { canonical: globalSeo.canonical } };
}

export default async function ThankYouPage() {
  const page = await getThankYouPage().catch(() => ({}));
  const image = page.image?.url || "/images/about-banner-bg.png";
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-cover bg-center px-5 py-20 text-center" style={{ backgroundImage: `linear-gradient(rgba(45,20,18,.74),rgba(45,20,18,.74)),url(${image})` }}>
      <div className="max-w-2xl rounded-sm bg-white/95 px-6 py-12 shadow-2xl sm:px-12 md:py-16">
        <p className="mb-3 text-xs uppercase tracking-[4px] text-primary">Entice Jewels</p>
        <h1 className="mb-5 font-heading text-4xl text-maroon md:text-6xl">{page.heading || "Thank You"}</h1>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-ink-soft md:text-base">{page.message || "Your request has been received. Our team will get in touch with you shortly."}</p>
        <Link href={page.button_url || "/"} className="inline-flex bg-maroon px-8 py-3 text-xs uppercase tracking-[2px] text-white transition-colors hover:bg-primary">{page.button_label || "Back to Home"}</Link>
      </div>
    </section>
  );
}
