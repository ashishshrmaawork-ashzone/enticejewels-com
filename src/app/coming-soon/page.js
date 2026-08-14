import Link from "next/link";

export const metadata = {
  title: "Coming Soon",
  robots: { index: false, follow: false },
  description: "This page is being crafted — check back soon.",
};

export default function ComingSoonPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center pt-24 md:pt-0">
      <div className="container-fluid text-center py-20">
        <p className="text-primary text-xs uppercase tracking-[3px] mb-4">Entice Jewels</p>
        <h1 className="font-heading text-maroon text-4xl md:text-6xl mb-5">Coming Soon</h1>
        <p className="text-ink-soft text-sm md:text-base max-w-md mx-auto mb-8">
          This page is being crafted with the same care as our jewellery. Please check
          back soon.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-maroon text-maroon text-xs uppercase tracking-[2px] px-7 py-3 rounded-full hover:bg-maroon hover:text-white transition-colors duration-300"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
