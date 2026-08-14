"use client";

export default function LegacyVideoSection() {
  return (
    <section id="legacy" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-5 sm:px-6 md:px-8">
        <div
          className="relative w-full overflow-hidden shadow-xl bg-maroon"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="block w-full h-auto"
          >
            <source src="/videos/legacy.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
