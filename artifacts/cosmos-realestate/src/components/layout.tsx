import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, Phone, Mail, ChevronRight, Instagram, Linkedin, Facebook } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  const headerSolid = !isHome || isScrolled;

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-400 ${
          headerSolid
            ? "bg-[hsl(222,47%,10%)] shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" data-testid="link-logo">
            <div className="flex flex-col leading-none">
              <span className="text-xl font-serif font-bold tracking-tight text-white">
                COSMOS
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase font-light text-primary">
                Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold tracking-widest uppercase transition-colors relative group ${
                  location === link.href ? "text-primary" : "text-white/85 hover:text-primary"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${
                    location === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://wa.me/919325097835"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold tracking-wider px-4 py-2 hover:bg-[#1fad54] transition-colors"
              data-testid="button-header-whatsapp"
            >
              <SiWhatsapp size={15} />
              WhatsApp
            </a>
            <Button asChild className="rounded-none px-5 tracking-widest text-xs font-bold uppercase">
              <Link href="/contact">Enquire Now</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setIsMobileMenuOpen(true)}
            data-testid="button-mobile-menu"
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-[hsl(222,47%,10%)] flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <span className="text-xl font-serif font-bold text-white">COSMOS</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white">
                <X size={28} />
              </button>
            </div>
            <nav className="flex flex-col items-center justify-center flex-1 gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-2xl font-serif transition-colors ${
                    location === link.href ? "text-primary" : "text-white/80 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-6 rounded-none px-8 py-6 text-lg">
                <Link href="/contact">Enquire Now</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer
        style={{ background: "linear-gradient(160deg, hsl(222,47%,8%) 0%, hsl(222,47%,14%) 100%)" }}
        className="text-white pt-20 pb-8"
      >
        <div className="container mx-auto px-4 md:px-8">
          {/* Top bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-14 pb-10 border-b border-white/10 gap-8">
            <div>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-serif font-bold text-white tracking-tight">COSMOS</span>
                <span className="text-primary text-sm tracking-widest uppercase font-semibold mb-1">Real Estate</span>
              </div>
              <p className="text-white/55 text-sm max-w-xs leading-relaxed">
                Pune's premier luxury real estate advisory, delivering trusted, transparent, and tailored property solutions.
              </p>
              <div className="flex gap-3 mt-5">
                <span className="text-[11px] font-bold tracking-widest text-primary border border-primary/50 px-2.5 py-1 uppercase">NAR India</span>
                <span className="text-[11px] font-bold tracking-widest text-primary border border-primary/50 px-2.5 py-1 uppercase">FMP Certified</span>
                <span className="text-[11px] font-bold tracking-widest text-primary border border-primary/50 px-2.5 py-1 uppercase">Life Member</span>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href="https://wa.me/919325097835"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-5 py-3 text-sm font-bold flex items-center gap-2 hover:bg-[#1fad54] transition-colors"
                data-testid="button-footer-whatsapp"
              >
                <SiWhatsapp size={18} />
                Chat on WhatsApp
              </a>
              <Button asChild className="rounded-none px-5 py-3 text-sm font-bold">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-6">Navigate</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 group text-sm"
                    >
                      <ChevronRight size={13} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Segments */}
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-6">Segments</h4>
              <ul className="space-y-3 text-sm text-white/60">
                {["Luxury Residential", "Commercial Offices", "Industrial & Logistics", "Land & Plots", "NRI Advisory", "Co-working Spaces"].map((s) => (
                  <li key={s} className="hover:text-primary transition-colors cursor-default">{s}</li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-2">
              <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-6">Contact Us</h4>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="text-primary" size={15} />
                  </div>
                  <div className="text-white/65 text-sm leading-relaxed">
                    No.2, "H" Building, Ground Floor, Liberty-II,<br />
                    Opp. Pizza Hut, North Main Road,<br />
                    Koregaon Park, Pune — 411001
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary" size={15} />
                  </div>
                  <div className="text-white/65 text-sm">
                    <div>+91-9325097835</div>
                    <div>+91-9823056983</div>
                    <div className="text-white/40 text-xs mt-0.5">Tel/Fax: +91 20 26152956</div>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary" size={15} />
                  </div>
                  <div className="text-white/65 text-sm">
                    <div>jatin@cosmosrealestate.in</div>
                    <div>cosmosestate@gmail.com</div>
                  </div>
                </li>
              </ul>

              {/* Social */}
              <div className="flex gap-3 mt-8">
                {[
                  { icon: Instagram, label: "Instagram" },
                  { icon: Linkedin, label: "LinkedIn" },
                  { icon: Facebook, label: "Facebook" },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/50 hover:border-primary hover:text-primary transition-colors"
                    data-testid={`social-${label.toLowerCase()}`}
                  >
                    <Icon size={16} />
                  </a>
                ))}
                <a
                  href="https://wa.me/919325097835"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]/70 hover:border-[#25D366] hover:text-[#25D366] transition-colors"
                  data-testid="social-whatsapp"
                >
                  <SiWhatsapp size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-7 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/35">
            <p>&copy; {new Date().getFullYear()} Cosmos Real Estate. All rights reserved.</p>
            <p>Jatin Arora — NAR India Life Member | FMP Certified | Koregaon Park, Pune</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/919325097835"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform hover:shadow-[#25D366]/40 group flex items-center justify-center"
        aria-label="Chat with us on WhatsApp"
        data-testid="button-whatsapp-fab"
      >
        <SiWhatsapp size={26} />
        <span className="absolute right-full mr-4 bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us
        </span>
      </a>
    </div>
  );
}
