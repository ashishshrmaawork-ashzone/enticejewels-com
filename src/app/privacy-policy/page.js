import PageHero from "@/components/shared/PageHero";
import Breadcrumb from "@/components/shared/Breadcrumb";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn how Entice Jewels collects, uses, protects, and shares personal information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "We may collect personal details you provide, including your name, email address, telephone number, and billing information.",
      "We may also receive usage information such as IP address, browser and device details, time spent on the site, and data collected through cookies or similar technologies. You may disable cookies in your browser, although parts of the website may then work differently.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "Information may be used to provide and improve our services, process transactions, send order or service updates, respond to enquiries, communicate offers, personalise your experience, prevent fraud, and meet legal obligations.",
    ],
  },
  {
    title: "3. How We Protect Your Information",
    content: [
      "We use reasonable safeguards, including secure systems and encryption where appropriate, to protect personal data. No internet transmission or electronic storage method is completely secure, so absolute security cannot be guaranteed.",
    ],
  },
  {
    title: "4. Sharing Your Information",
    content: [
      "Personal data may be shared with service providers that support our operations, such as payment, supply, and delivery partners. Information may also be disclosed to meet legal requirements, protect rights or safety, or as part of a merger, acquisition, or asset transfer.",
    ],
  },
  {
    title: "5. Your Rights",
    content: [
      "Depending on applicable law, you may request access to, correction of, or deletion of your information; object to or restrict processing; or withdraw consent where consent is the legal basis. Contact us at info@enticemail.com to make a request.",
    ],
  },
  {
    title: "6. Children’s Privacy",
    content: [
      "The website is not intended for children under 13, and we do not knowingly solicit their personal data. If such information is identified without verified parental consent, we will take steps to delete it promptly.",
    ],
  },
  {
    title: "7. Links to Other Websites",
    content: [
      "Our website may link to third-party sites. Entice Jewels is not responsible for their content or privacy practices, and we encourage you to review their policies separately.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    content: [
      "We may revise this policy periodically. Updates take effect when they are posted on this page, so please review it from time to time.",
    ],
  },
  {
    title: "9. Contact Us",
    content: [
      "For privacy questions or concerns, contact Entice Jewels at info@enticemail.com or +91-9967341905.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero image="/images/about-banner-bg.png" alt="Entice Jewels privacy policy">
        <h1 className="font-heading text-white text-3xl sm:text-4xl md:text-6xl">Privacy Policy</h1>
      </PageHero>

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />

      <article className="pb-16 md:pb-24">
        <div className="container mx-auto px-5 sm:px-6 md:px-8">
          <p className="text-sm text-ink-soft mb-3">Effective date: November 25, 2025</p>
          <p className="text-sm sm:text-base md:text-lg text-ink leading-relaxed mb-10">
            Entice Jewels is committed to protecting your privacy. This policy describes how information is collected, used, safeguarded, and shared when you visit our website or use our services. By using the website, you acknowledge this policy.
          </p>

          <div className="space-y-9">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-body font-semibold text-maroon text-xl md:text-2xl mb-3">{section.title}</h2>
                <div className="space-y-3 text-ink-soft text-sm md:text-base leading-relaxed">
                  {section.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
