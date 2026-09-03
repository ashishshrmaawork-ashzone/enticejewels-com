import { Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ContactForm from "@/components/contact/ContactForm";
import { getContactPage, getFrontendSeo } from "@/lib/api";

export async function generateMetadata() {
  const [page, globalSeo] = await Promise.all([getContactPage().catch(() => ({})), getFrontendSeo("/contact/")]);
  return { title: page.seo?.title || page.title || "Contact Us", description: page.seo?.description || page.excerpt, alternates: { canonical: globalSeo.canonical }, openGraph: { title: page.seo?.title || page.title, description: page.seo?.description || page.excerpt, url: globalSeo.canonical, images: page.featured_image?.url ? [page.featured_image.url] : undefined } };
}

export default async function ContactPage() {
  let contact = {};
  try {
    contact = await getContactPage();
  } catch (error) {
    console.error("Contact page API error:", error.message);
  }
  const fields = contact.custom_fields || {};
  const locations = fields.store_location || [];
  const email = fields.contact_email || "info@enticemail.com";
  const phone = fields.contact_no || "+919967341905";
  return (
    <>
      <PageHero image={contact.featured_image?.url || "/images/about-banner-bg.png"} alt={contact.featured_image?.alt || "Connect with Entice Jewels"}>
        <h1 className="font-heading text-white text-3xl sm:text-4xl md:text-6xl">{contact.excerpt || "Let’s Connect"}</h1>
      </PageHero>

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />

      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-5 sm:px-6 md:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 md:gap-12 lg:gap-16">
          <div>
            <p className="text-primary text-xs uppercase tracking-[3px] mb-3">{fields.entice_jewels || "Entice Jewels"}</p>
            <h2 className="font-heading text-maroon text-2xl sm:text-3xl md:text-4xl leading-tight mb-5">{fields.start_your_journey_with_us || "Start Your Journey With Us"}</h2>
            <p className="text-ink-soft text-sm md:text-base leading-relaxed mb-8">
              {fields.entice_jewels_detail || "Speak with our team about a creation, arrange a boutique visit, or share an enquiry. We would be delighted to assist you."}
            </p>

            <div className="space-y-5 text-sm">
              <a href={`mailto:${email}`} className="flex items-center gap-3 text-maroon hover:text-primary transition-colors">
                <Mail size={18} className="text-primary flex-shrink-0" /> {email}
              </a>
              <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-3 text-maroon hover:text-primary transition-colors">
                <Phone size={18} className="text-primary flex-shrink-0" /> {phone}
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-primary flex-shrink-0 mt-1" />
                <ul className="space-y-2 text-ink-soft">
                  {locations.map((location, index) => (
                    <li key={`${location.stote_location_address}-${index}`}>
                      {location.store_location_navigation ? (
                        <a href={location.store_location_navigation} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{location.stote_location_address}</a>
                      ) : location.stote_location_address}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
