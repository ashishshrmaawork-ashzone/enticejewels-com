"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "@/components/shared/ContentLink";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { FaFacebookF, FaInstagram, FaPinterestP, FaXTwitter, FaYoutube, FaLinkedinIn } from "react-icons/fa6";
import logoDark from "@/assets/images/logo-dark.png";
import { subscribeNewsletter } from "@/lib/api";
import { useSiteSettings } from "@/context/SiteSettingsContext";

function decodeMenuLabel(label = "") {
  return label
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [subscriptionError, setSubscriptionError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const settings = useSiteSettings();
  const socialLinks = [
    { icon: FaFacebookF, url: settings.social?.facebook, label: "Facebook" }, { icon: FaInstagram, url: settings.social?.instagram, label: "Instagram" },
    { icon: FaPinterestP, url: settings.social?.pinterest, label: "Pinterest" }, { icon: FaXTwitter, url: settings.social?.twitter, label: "X" },
    { icon: FaYoutube, url: settings.social?.youtube, label: "YouTube" }, { icon: FaLinkedinIn, url: settings.social?.linkedin, label: "LinkedIn" },
  ].filter((item) => item.url);

  const handleSubscribe = async (event) => {
    event.preventDefault();
    setSubmitting(true); setSubscriptionMessage(""); setSubscriptionError(false);
    try { const response = await subscribeNewsletter(email); setSubscriptionMessage(response.message); setEmail(""); }
    catch (error) { setSubscriptionMessage(error.message); setSubscriptionError(true); }
    finally { setSubmitting(false); }
  };

  return (
    <footer id="contact" className="bg-white font-body" style={{ color: "#553632" }}>
      <div className="container-fluid py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <div>
            <Image src={settings.footer_logo || logoDark} alt="Entice Jewels" width={350} height={100} className="h-14 md:h-18 w-auto" />
            {settings.footer_text && <p className="text-sm text-ink-soft mt-4 max-w-xs">{settings.footer_text}</p>}
          </div>

          <div>
            <h4 className="font-body text-base font-bold mb-4" style={{ color: "#000" }}>Contact</h4>
            <div className="space-y-3 text-sm">
              <a
                href={`mailto:${settings.email || "info@enticemail.com"}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail size={15} className="opacity-60 flex-shrink-0" /> {settings.email || "info@enticemail.com"}
              </a>
              <a
                href={`tel:${settings.phone || "+919967341905"}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Phone size={15} className="opacity-60 flex-shrink-0" /> {settings.phone || "+91-9967341905"}
              </a>
              <a href={settings.location_url || undefined} target={settings.location_url ? "_blank" : undefined} rel={settings.location_url ? "noopener noreferrer" : undefined} className="flex items-start gap-2">
                <MapPin size={15} className="opacity-60 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed whitespace-pre-line">{settings.location || "India (Jaipur, Mumbai, Borivali, Vashi)\nHong Kong | Dubai | Botswana"}</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-body text-base font-bold mb-4" style={{ color: "#000" }}>Follow</h4>
            <form onSubmit={handleSubscribe} className="flex items-center border-b border-black/20 focus-within:border-primary transition-colors mb-2 max-w-xs">
              <input
                type="email"
                required
                maxLength={191}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSubscriptionMessage("");
                }}
                aria-label="Email address for newsletter"
                autoComplete="email"
                placeholder="Your email..."
                className="w-full bg-transparent py-2 text-sm placeholder:text-black/40 focus:outline-none"
              />
              <button type="submit" disabled={submitting} aria-label="Subscribe" className="opacity-60 hover:opacity-100 hover:text-primary transition-colors flex-shrink-0 disabled:opacity-30">
                <Send size={16} />
              </button>
            </form>
            {subscriptionMessage && (
              <p className={`text-xs mb-4 ${subscriptionError ? "text-red-700" : ""}`} role="status">
                {subscriptionMessage}
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
            {(settings.footer_menu || []).map((item) => <Link key={item.id || item.href} href={item.href} target={item.target || undefined} className="hover:text-primary transition-colors">{decodeMenuLabel(item.label)}</Link>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
