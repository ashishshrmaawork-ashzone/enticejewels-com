"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ChevronDown, ShoppingBag, Heart, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import logoDark from "@/assets/images/logo-dark.png";
import logoWhite from "@/assets/images/logo-white.png";
import { useCart } from "@/context/CartContext";
import BookAppointmentModal from "@/components/shared/BookAppointmentModal";
import { searchProducts } from "@/lib/api";
import { useSiteSettings } from "@/context/SiteSettingsContext";

// Every item goes to its own dedicated page — never to a mid-page section.
// Items without a built page yet go to /coming-soon.
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const { totalCount, wishlist } = useCart();
  const settings = useSiteSettings();
  const navItems = settings.header_menu || [];
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchData, setSearchData] = useState({ items: [], total: 0 });
  const [searchLoading, setSearchLoading] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const navRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!menuOpen || window.innerWidth >= 768) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => event.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      // Only reveal "Book an Appointment" once the hero banner is scrolled past.
      setPastHero(window.scrollY > window.innerHeight * 0.85);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close an open dropdown/suggestions when clicking anywhere outside.
  useEffect(() => {
    const onClick = (e) => {
      if (window.innerWidth >= 768 && navRef.current && !navRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Inner pages always show the solid/white header — only the home hero gets
  // the transparent-over-image treatment.
  const solid = !isHome || scrolled || menuOpen;
  const tone = solid ? "text-black" : "text-white";
  // Same reveal behavior everywhere: only after scrolling past the banner.
  const showBookTab = pastHero;

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      return undefined;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      try {
        setSearchData(await searchProducts(term, { perPage: 5, signal: controller.signal }));
      } catch (error) {
        if (error.name !== "AbortError") setSearchData({ items: [], total: 0 });
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, 300);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query]);

  const goTo = (href) => {
    setQuery("");
    setShowSuggestions(false);
    const [path, hash] = href.split("#");
    const targetPath = path || "/";
    if (targetPath === pathname && hash) {
      document.querySelector(`#${hash}`)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(href);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2) goTo(`/search/?q=${encodeURIComponent(query.trim())}`);
  };
  const handleHeaderButton = () => {
    if (settings.header_button?.url) window.location.assign(settings.header_button.url);
    else setAppointmentOpen(true);
  };

  return (
    <>
      <header
        id="home"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          solid ? "bg-white shadow-md shadow-black/5 backdrop-blur-sm" : "bg-gradient-to-b from-black/40 to-transparent"
        }`}
      >
        <div className="container-fluid relative flex items-center justify-between py-5 md:py-6">
          <Link href="/" className="flex-shrink-0">
            <Image
              src={settings.header_logo || (solid ? logoDark : logoWhite)}
              alt="Entice Jewels"
              width={350}
              height={100}
              className="h-11 md:h-14 w-auto transition-all duration-500"
              priority
            />
          </Link>

          {/* Absolutely centered on the header regardless of logo/menu width */}
          <form
            ref={searchRef}
            onSubmit={handleSearchSubmit}
            className={`hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[240px] lg:w-[340px] xl:w-full xl:max-w-md items-center border-b pb-2 transition-colors duration-300 ${solid ? "border-black" : "border-white/50"}`}
          >
            <button type="submit" aria-label="Search" className={`flex-shrink-0 ${tone} hover:text-primary transition-colors`}>
              <Search size={16} />
            </button>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim().length < 2) {
                  setSearchData({ items: [], total: 0 });
                  setSearchLoading(false);
                }
                setShowSuggestions(true);
              }}
              onFocus={() => query.trim() && setShowSuggestions(true)}
              placeholder="Search"
              className={`flex-1 text-center bg-transparent text-sm focus:outline-none placeholder:opacity-80 ${tone} ${solid ? "placeholder:text-black" : "placeholder:text-white"}`}
            />

            <AnimatePresence>
              {showSuggestions && query.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-96 bg-white rounded-md shadow-xl border border-black/5 py-2 text-left z-[100]"
                >
                  {searchLoading ? (
                    <p className="px-4 py-3 text-sm text-ink-soft">Searching...</p>
                  ) : searchData.items.length ? (
                    <>
                    {searchData.items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.path}
                        onClick={(e) => {
                          e.preventDefault();
                          goTo(item.path);
                        }}
                        className="flex gap-3 px-4 py-2 text-sm text-black hover:text-primary hover:bg-cream transition-colors"
                      >
                        <span className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded bg-cream">
                          {item.image?.url && <Image src={item.image.url} alt="" fill unoptimized className="object-cover" />}
                        </span>
                        <span className="min-w-0"><strong className="block truncate">{item.title}</strong><small className="block text-ink-soft truncate">{item.description}</small></span>
                      </Link>
                    ))}
                    {searchData.total > 5 && (
                      <button type="button" onClick={() => goTo(`/search/?q=${encodeURIComponent(query.trim())}`)} className="w-full border-t border-black/10 mt-2 pt-3 pb-1 text-center text-xs uppercase tracking-[2px] text-maroon font-semibold">
                        View All ({searchData.total})
                      </button>
                    )}
                    </>
                  ) : (
                    <p className="px-4 py-2 text-sm text-ink-soft">{query.trim().length < 2 ? "Type at least 2 characters" : "No products found"}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="flex items-center gap-4 md:gap-5 flex-shrink-0">
            <Link href="/account" aria-label="Account" className={`flex-shrink-0 transition-colors duration-300 hover:text-primary ${tone}`}><UserRound size={20}/></Link>
            <Link href="/wishlist" aria-label="Wishlist" className={`relative flex-shrink-0 transition-colors duration-300 hover:text-primary ${tone}`}><Heart size={20} />{wishlist.length > 0 && <span className="absolute -top-2 -right-2 bg-primary text-maroon text-[10px] font-bold leading-none w-4 h-4 rounded-full flex items-center justify-center">{wishlist.length}</span>}</Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className={`relative flex-shrink-0 transition-colors duration-300 hover:text-primary ${tone}`}
            >
              <ShoppingBag size={20} />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-maroon text-[10px] font-bold leading-none w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`flex-shrink-0 flex items-center gap-2 text-sm tracking-wide transition-colors duration-300 hover:text-primary ${tone}`}
              aria-expanded={menuOpen}
            >
              Menu
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              ref={navRef}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="hidden md:block bg-white"
            >
              <div className="container-fluid flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-4">
                {navItems.map((item) =>
                  item.dropdown ? (
                    <div key={item.label} className="relative">
                      <button
                        onClick={() => setDropdownOpen((d) => (d === item.label ? null : item.label))}
                        className="flex items-center gap-1 text-sm text-black hover:text-primary transition-colors duration-300"
                      >
                        {item.label}
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${dropdownOpen === item.label ? "rotate-180" : ""}`}
                        />
                      </button>
                      {/* pt-3 keeps the hit-area continuous, no dead zone between trigger and menu */}
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 min-w-[190px] transition-all duration-200 ${
                          dropdownOpen === item.label ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1 pointer-events-none"
                        }`}
                      >
                        <div className="bg-white shadow-xl rounded-md py-2 border border-black/5">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              onClick={() => {
                                setDropdownOpen(null);
                                setMenuOpen(false);
                              }}
                              className="block px-4 py-2 text-sm text-black hover:text-primary hover:bg-cream transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-sm text-black hover:text-primary transition-colors duration-300"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-0 z-[80] bg-black/55 backdrop-blur-[2px]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
              className="md:hidden fixed top-0 right-0 bottom-0 z-[90] w-[88vw] max-w-sm bg-white shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  <Image src={settings.header_logo || logoDark} alt="Entice Jewels" width={350} height={100} className="h-11 w-auto" priority />
                </Link>
                <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-maroon">
                  <X size={21} />
                </button>
              </div>

              <nav className="px-6 py-7">
                <p className="text-primary text-[10px] uppercase tracking-[3px] mb-5">Navigation</p>
                <div className="divide-y divide-black/10">
                  {navItems.map((item) =>
                    item.dropdown ? (
                      <div key={item.label} className="py-1">
                        <button
                          type="button"
                          onClick={() => setDropdownOpen((current) => current === item.label ? null : item.label)}
                          className="w-full flex items-center justify-between py-4 text-left font-heading text-maroon text-xl"
                          aria-expanded={dropdownOpen === item.label}
                        >
                          {item.label}
                          <ChevronDown size={18} className={`transition-transform ${dropdownOpen === item.label ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {dropdownOpen === item.label && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="pb-4 pl-4 space-y-3 border-l border-primary/40">
                                {item.dropdown.map((sub) => (
                                  <Link key={sub.label} href={sub.href} onClick={() => setMenuOpen(false)} className="block text-sm text-ink-soft hover:text-primary">
                                    {sub.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="block py-4 font-heading text-maroon text-xl hover:text-primary transition-colors">
                        {item.label}
                      </Link>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleHeaderButton();
                  }}
                  className="w-full mt-8 rounded-full bg-maroon px-6 py-3.5 text-[#fff1c1] text-xs font-semibold uppercase tracking-[2px]"
                >
                  {settings.header_button?.label || "Book an Appointment"}
                </button>
              </nav>

              <div className="px-6 py-6 bg-cream text-sm text-ink-soft">
                <a href={`mailto:${settings.email || "info@enticemail.com"}`} className="block hover:text-primary">{settings.email || "info@enticemail.com"}</a>
                <a href={`tel:${settings.phone || "+919967341905"}`} className="block mt-2 hover:text-primary">{settings.phone || "+91-9967341905"}</a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Fixed vertical "Book an Appointment" tab — only after the hero banner is scrolled past */}
      <AnimatePresence>
        {showBookTab && (
          <motion.button
            type="button"
            onClick={handleHeaderButton}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ backgroundColor: "#553632", color: "#FFF1C1" }}
            className="hidden md:flex flex-col items-center gap-4 fixed right-0 top-1/2 -translate-y-1/2 z-40 rounded-l-2xl shadow-lg py-6 px-2 opacity-100 hover:opacity-90 transition-opacity duration-300"
          >
            <span
              style={{
                writingMode: "vertical-rl",
                fontFamily: "var(--font-open-sans)",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "-0.017em",
              }}
            >
              {settings.header_button?.label || "Book an Appointment"}
            </span>
            <Image src="/images/book-apoint-icon.png" alt="" width={20} height={20} unoptimized />
          </motion.button>
        )}
      </AnimatePresence>

      <BookAppointmentModal open={appointmentOpen} onClose={() => setAppointmentOpen(false)} />
    </>
  );
}
