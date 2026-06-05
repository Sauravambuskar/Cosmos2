import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, Phone, Mail, ChevronRight } from "lucide-react";
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <span className={`text-2xl font-serif font-bold tracking-tight ${isScrolled ? "text-primary" : "text-white drop-shadow-md"}`}>
              COSMOS
            </span>
            <span className={`text-sm tracking-widest uppercase font-light hidden md:inline-block ${isScrolled ? "text-foreground" : "text-white/90 drop-shadow-md"}`}>
              Real Estate
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary ${
                  location === link.href
                    ? "text-primary"
                    : isScrolled
                    ? "text-foreground/80"
                    : "text-white drop-shadow-md"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button asChild variant={isScrolled ? "default" : "secondary"} className="rounded-none px-6 tracking-wide">
              <Link href="/contact">Enquire Now</Link>
            </Button>
          </div>

          <button
            className={`md:hidden ${isScrolled ? "text-foreground" : "text-white drop-shadow-md"}`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-background flex flex-col"
          >
            <div className="p-6 flex justify-end">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <X size={32} />
              </button>
            </div>
            <nav className="flex flex-col items-center justify-center flex-1 gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-2xl font-serif ${
                    location === link.href ? "text-primary" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-8 rounded-none px-8 py-6 text-lg">
                <Link href="/contact">Enquire Now</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-secondary text-secondary-foreground pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <h3 className="text-2xl font-serif font-bold text-primary mb-6">COSMOS</h3>
              <p className="text-secondary-foreground/70 mb-6 leading-relaxed">
                Premium real estate advisory and brokerage services in Pune. Delivering excellence and trust for over two decades.
              </p>
              <div className="flex gap-4">
                <span className="text-xs font-semibold tracking-wider text-primary border border-primary px-2 py-1 rounded">NAR INDIA</span>
                <span className="text-xs font-semibold tracking-wider text-primary border border-primary px-2 py-1 rounded">FMP CERTIFIED</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-serif mb-6 text-white">Quick Links</h4>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-secondary-foreground/70 hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-lg font-serif mb-6 text-white">Contact Us</h4>
              <ul className="space-y-4 text-secondary-foreground/70">
                <li className="flex items-start gap-4">
                  <MapPin className="text-primary shrink-0 mt-1" size={20} />
                  <span>
                    No.2, "H" Building, Ground Floor, Liberty-II,<br />
                    Opp. Pizza Hut, North Main Road,<br />
                    Koregaon Park, Pune - 411001
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="text-primary shrink-0" size={20} />
                  <span>+91-9325097835 / +91-9823056983</span>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="text-primary shrink-0" size={20} />
                  <span>jatin@cosmosrealestate.in</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary-foreground/50">
            <p>&copy; 2024 Cosmos Real Estate. All rights reserved.</p>
            <p>Designed for Luxury</p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/919325097835"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform hover:shadow-2xl group flex items-center justify-center"
        aria-label="Chat with us on WhatsApp"
      >
        <SiWhatsapp size={28} />
        <span className="absolute right-full mr-4 bg-white text-black text-sm font-medium px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us
        </span>
      </a>
    </div>
  );
}
