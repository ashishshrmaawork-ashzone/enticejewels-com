import { Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact Us",
  description: "Connect with Entice Jewels for boutique visits, jewellery enquiries, and personal assistance.",
};

const locations = [
  "Jaipur — MI Road, Jaipur, India",
  "Mumbai — Borivali (E), Mumbai, India",
  "Hong Kong — Peninsula Square, Kowloon",
  "Dubai — Almas Tower",
  "Botswana",
];

export default function ContactPage() {
  return (
    <>
      <PageHero image="/images/about-banner-bg.png" alt="Connect with Entice Jewels">
        <h1 className="font-heading text-white text-3xl sm:text-4xl md:text-6xl">Let&rsquo;s Connect</h1>
      </PageHero>

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />

      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-5 sm:px-6 md:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 md:gap-12 lg:gap-16">
          <div>
            <p className="text-primary text-xs uppercase tracking-[3px] mb-3">Entice Jewels</p>
            <h2 className="font-heading text-maroon text-3xl sm:text-4xl md:text-5xl leading-tight mb-5">Start Your Journey With Us</h2>
            <p className="text-ink-soft text-sm md:text-base leading-relaxed mb-8">
              Speak with our team about a creation, arrange a boutique visit, or share an enquiry. We would be delighted to assist you.
            </p>

            <div className="space-y-5 text-sm">
              <a href="mailto:info@enticemail.com" className="flex items-center gap-3 text-maroon hover:text-primary transition-colors">
                <Mail size={18} className="text-primary flex-shrink-0" /> info@enticemail.com
              </a>
              <a href="tel:+919967341905" className="flex items-center gap-3 text-maroon hover:text-primary transition-colors">
                <Phone size={18} className="text-primary flex-shrink-0" /> +91-9967341905
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-primary flex-shrink-0 mt-1" />
                <ul className="space-y-2 text-ink-soft">
                  {locations.map((location) => <li key={location}>{location}</li>)}
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
