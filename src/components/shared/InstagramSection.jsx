import Image from "next/image";
import { instagramPosts } from "@/data/instagram";

export default function InstagramSection() {
  return (
    <section
      className="py-14 md:py-16"
      style={{
        backgroundColor: "rgb(0 0 0 / 55%)",
        backgroundImage: "url(/images/insta-bg.png)",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      <h2 className="text-white text-center font-body text-2xl sm:text-[30px] font-semibold leading-[normal] mb-8 px-5">
        Follow us on Instagram
      </h2>
      <div className="container mx-auto px-5 sm:px-6 md:px-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory md:snap-none">
        <div className="flex gap-4 md:gap-5 min-w-max md:min-w-0 md:grid md:grid-cols-5 pb-2 md:pb-0">
          {instagramPosts.map((src, i) => (
            <div key={i} className="relative w-[72vw] max-w-64 sm:w-48 md:w-full aspect-[4/5] rounded-xl overflow-hidden flex-shrink-0 snap-start">
              <Image src={src} alt={`Instagram post ${i + 1}`} fill unoptimized className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
