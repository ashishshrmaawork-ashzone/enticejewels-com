import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getFrontendSeo, getPrivacyPolicyPage } from "@/lib/api";

const fallbackPage = {
  title: "Privacy Policy",
  excerpt: "Learn how Entice Jewels collects, uses, protects, and shares personal information.",
  content: "<p>Our privacy policy is temporarily unavailable. Please contact us at info@enticemail.com for privacy-related questions.</p>",
};

export async function generateMetadata() {
  const [page, globalSeo] = await Promise.all([getPrivacyPolicyPage().catch(() => null), getFrontendSeo("/privacy-policy/")]);
  return {
    title: page?.seo?.title || page?.title || "Privacy Policy",
    description: page?.seo?.description || page?.excerpt || "Read the Entice Jewels privacy policy.",
    alternates: { canonical: globalSeo.canonical },
  };
}

export default async function PrivacyPolicyPage() {
  const page = await getPrivacyPolicyPage().catch(() => fallbackPage);
  return (
    <>
      <div className="pt-[84px] md:pt-[104px]">
        <div className="h-5 bg-maroon bg-[url('/images/about-banner-bg.png')] bg-cover bg-center" aria-hidden="true" />
      </div>
      <nav aria-label="Breadcrumb" className="mx-auto w-full px-5 py-7 sm:px-6 md:w-[87%] md:px-0 md:py-9">
        <ol className="flex items-center gap-2.5 text-sm uppercase tracking-wide">
          <li><Link href="/" className="text-ink-soft transition-colors hover:text-primary">Home</Link></li>
          <li aria-hidden="true"><ChevronRight size={14} className="text-ink-soft" /></li>
          <li className="font-semibold text-maroon" aria-current="page">{page.title}</li>
        </ol>
      </nav>
      <article className="pb-16 md:pb-24">
        <div className="mx-auto w-full px-5 sm:px-6 md:w-[87%] md:px-0">
          <div
            className="text-ink-soft [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&>p:first-child]:!mb-3 [&>p:first-child]:!text-base [&>p:nth-child(2)]:!mb-11 [&>p:nth-child(2)]:!text-lg [&>p:nth-child(2)]:!leading-[1.7] [&>p:nth-child(2)]:!text-ink md:[&>p:nth-child(2)]:!text-xl [&_section]:!mb-0 [&_section+section]:!mt-10 md:[&_section+section]:!mt-11 [&_section_h2]:!mb-3 [&_section_h2]:!font-body [&_section_h2]:!text-2xl [&_section_h2]:!font-semibold [&_section_h2]:!leading-snug [&_section_h2]:!text-maroon md:[&_section_h2]:!text-[28px] [&_section_p]:!text-base [&_section_p]:!leading-[1.75] [&_section_p]:!text-ink-soft md:[&_section_p]:!text-[17px] [&_section_p+p]:!mt-3"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </article>
    </>
  );
}
