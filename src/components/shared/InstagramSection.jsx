"use client";
import useLiveContent from "@/lib/useLiveContent";
import Image from "next/image";
import { getInstagramFeed } from "@/lib/api";

const loadInstagram = () => getInstagramFeed(5);

export default function InstagramSection() {
  const instagramProfileUrl = process.env.NEXT_PUBLIC_INSTAGRAM_PROFILE_URL;
  if (!instagramProfileUrl) throw new Error("NEXT_PUBLIC_INSTAGRAM_PROFILE_URL is not configured");

  const { data: feed } = useLiveContent(loadInstagram);

  const posts = feed?.items?.length
    ? feed.items.map((item) => ({
        id: item.id,
        image: item.image?.url,
        alt: item.image?.alt || item.title || "Entice Instagram post",
        url: item.url || feed.profile_url,
      })).filter((item) => item.image)
    : [];

  if (!posts.length) return null;

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
      <a href={feed?.profile_url || instagramProfileUrl} target="_blank" rel="noopener noreferrer">
        <h2 className="text-white text-center font-body text-2xl sm:text-[30px] font-semibold leading-[normal] mb-8 px-5">
          {feed?.title || "Follow us on Instagram"}
        </h2>
      </a>
      <div className="container mx-auto px-5 sm:px-6 md:px-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory md:snap-none">
        <div className="flex gap-4 md:gap-5 min-w-max md:min-w-0 md:grid md:grid-cols-5 pb-2 md:pb-0">
          {posts.map((post) => (
            <a key={post.id} href={post.url} target="_blank" rel="noopener noreferrer" className="relative w-[72vw] max-w-64 sm:w-48 md:w-full aspect-[4/5] rounded-xl overflow-hidden flex-shrink-0 snap-start group">
              <Image src={post.image} alt={post.alt} fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
