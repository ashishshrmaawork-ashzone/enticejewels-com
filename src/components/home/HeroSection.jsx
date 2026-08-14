"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const heroPoster = "/images/home-banner.jpg";

export default function HeroSection() {
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
        <Image src={heroPoster} alt="Entice Couture" fill unoptimized priority className="object-cover" />
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
