"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const heroPoster = "/images/home-banner.jpg";

function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=0&rel=0&playsinline=1` : null;
}

export default function HeroSection({ media, videoUrl }) {
  const selectedMedia = media?.url ? media : (videoUrl ? { type: getYoutubeEmbedUrl(videoUrl) ? "youtube" : "hosted", url: videoUrl } : null);
  const embedUrl = selectedMedia?.type === "youtube" ? getYoutubeEmbedUrl(selectedMedia.url) : null;
  return (
    <section className="relative h-screen h-[100svh] w-full overflow-hidden bg-maroon">
      {/*
        Placeholder Ken-Burns background until the real hero video/footage is
        supplied — swap for a <video autoPlay muted loop playsInline> once
        the client's banner film is ready (this slot is separate from the
        legacy.mp4 clip, which lives in the "Inspired to shine" section below).
      */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{ duration: 14, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute inset-0"
      >
        {selectedMedia?.type === "image" ? (
          <Image src={selectedMedia.url} alt={selectedMedia.image_alt || "Entice Couture"} fill unoptimized priority className="object-cover" />
        ) : embedUrl ? (
          <iframe src={embedUrl} title="Entice Jewels" allow="autoplay; encrypted-media" className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0 pointer-events-none" />
        ) : selectedMedia?.type === "hosted" ? (
          <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover"><source src={selectedMedia.url} />Your browser does not support HTML video.</video>
        ) : (
          <Image src={heroPoster} alt="Entice Couture" fill unoptimized priority className="object-cover" />
        )}
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/20" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.4, duration: 0.6 },
          y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/70"
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
}
