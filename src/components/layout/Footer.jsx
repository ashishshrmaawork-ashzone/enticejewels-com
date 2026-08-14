"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { FaFacebookF, FaInstagram, FaPinterestP } from "react-icons/fa6";
import logoDark from "@/assets/images/logo-dark.png";

const socialLinks = [
  { icon: FaFacebookF, url: "https://www.facebook.com/EnticeByKGK", label: "Facebook" },
  { icon: FaInstagram, url: "https://www.instagram.com/entice_fashion_", label: "Instagram" },
  { icon: FaPinterestP, url: "https://in.pinterest.com/enticebykgk/", label: "Pinterest" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscriptionStarted, setSubscriptionStarted] = useState(false);

  const handleSubscribe = (event) => {
    event.preventDefault();
    setSubscriptionStarted(true);
  };

  return (
    <footer id="contact" className="bg-white font-body" style={{ color: "#553632" }}>
      <div className="container-fluid py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <div>
            <Image src={logoDark} alt="Entice Jewels" className="h-14 md:h-18 w-auto" />
          </div>

          <div>
            <h4 className="font-body text-base font-bold mb-4" style={{ color: "#000" }}>Contact</h4>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:info@enticemail.com"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail size={15} className="opacity-60 flex-shrink-0" /> info@enticemail.com
              </a>
              <a
                href="tel:+919967341905"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Phone size={15} className="opacity-60 flex-shrink-0" /> +91-9967341905
              </a>
              <div className="flex items-start gap-2">
                <MapPin size={15} className="opacity-60 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  India (Jaipur, Mumbai, Borivali, Vashi)
                  <br />
                  Hong Kong&nbsp; | &nbsp;Dubai&nbsp; | &nbsp;Botswana
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-body text-base font-bold mb-4" style={{ color: "#000" }}>Follow</h4>
            <form onSubmit={handleSubscribe} className="flex items-center border-b border-black/20 focus-within:border-primary transition-colors mb-2 max-w-xs">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSubscriptionStarted(false);
                }}
                aria-label="Email address for newsletter"
                autoComplete="email"
                placeholder="Your email..."
                className="w-full bg-transparent py-2 text-sm placeholder:text-black/40 focus:outline-none"
              />
              <button type="submit" aria-label="Subscribe" className="opacity-60 hover:opacity-100 hover:text-primary transition-colors flex-shrink-0">
                <Send size={16} />
              </button>
            </form>
            {subscriptionStarted && (
              <p className="text-xs mb-4" role="status">
                Thank you. Your subscription request has been recorded.
              </p>
            )}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ backgroundColor: "#F3DF9E" }}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/10">
        <div className="container-fluid py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} - Entice | All Rights Reserved</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5">
            <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/contact" className="hover:text-primary transition-colors">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
