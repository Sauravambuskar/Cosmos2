import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, MapPin, Phone, Mail, ChevronRight, ChevronDown,
  Instagram, Linkedin, Facebook, Home, Building, Warehouse, Building2
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";

/* ─── Properties mega-menu data ─── */
const propertiesMenu = [
  {
    category: "🏠 Residential",
    items: [
      { label: "Apartments / Flats", sub: "1–6 BHK across Pune" },
      { label: "Bungalows", sub: "Standalone luxury homes" },
      { label: "Villas & Penthouses", sub: "Exclusive gated estates" },
      { label: "Row Houses & Duplexes", sub: "Premium community living" },
      { label: "Plots / Land", sub: "Buy & develop your way" },
    ],
  },
  {
    category: "🏢 Commercial",
    items: [
      { label: "Office Spaces", sub: "Bare shell & fitted" },
      { label: "Co-working Spaces", sub: "Flexible memberships" },
      { label: "Managed Offices", sub: "Ready-to-move setups" },
      { label: "Shops & Showrooms", sub: "High-street retail" },
      { label: "Hotels", sub: "Hospitality assets" },
    ],
  },
  {
    category: "🏭 Industrial",
    items: [
      { label: "Warehouses & Sheds", sub: "Logistics & storage" },
      { label: "Industrial Plants", sub: "Manufacturing units" },
      { label: "SEZ / IT Parks", sub: "Tech corridor units" },
    ],
  },
];

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/properties", label: "Properties", hasDropdown: true },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

const footerNav = navLinks.map(l => ({ href: l.href, label: l.label }));

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobilePropertiesOpen, setMobilePropertiesOpen] = useState(false);
  const [location] = useLocation();
  const megaRef = useRef<HTMLDivElement>(null);

  const isHome = location === "/";
  const headerSolid = !isHome || isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMegaOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">

      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerSolid ? "bg-[hsl(222,47%,10%)] shadow-lg py-3" : "bg-transparent py-5"}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" data-testid="link-logo">
            <div className="flex flex-col leading-none">
              <span className="text-xl font-serif font-bold tracking-tight text-white">COSMOS</span>
              <span className="text-[10px] tracking-[0.25em] uppercase font-light text-primary">Real Estate</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" ref={megaRef}>
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={`text-xs font-semibold tracking-widest uppercase transition-colors flex items-center gap-1 relative group ${location.startsWith("/properties") ? "text-primary" : "text-white/85 hover:text-primary"}`}
                  >
                    {link.label}
                    <ChevronDown size={12} className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
                    <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${location.startsWith("/properties") ? "w-full" : "w-0 group-hover:w-full"}`} />
                  </Link>

                  {/* Mega Menu */}
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] bg-[hsl(222,47%,10%)] border border-white/10 shadow-2xl p-6 grid grid-cols-3 gap-6"
                      >
                        {propertiesMenu.map((group) => (
                          <div key={group.category}>
                            <div className="text-primary text-xs font-bold tracking-widest uppercase mb-4 pb-2 border-b border-white/10">
                              {group.category}
                            </div>
                            <ul className="space-y-3">
                              {group.items.map((item) => (
                                <li key={item.label}>
                                  <Link
                                    href="/properties"
                                    className="group/item flex flex-col hover:text-primary transition-colors"
                                  >
                                    <span className="text-white/85 text-sm font-semibold group-hover/item:text-primary leading-tight">{item.label}</span>
                                    <span className="text-white/35 text-xs mt-0.5">{item.sub}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <div className="col-span-3 pt-4 border-t border-white/10 flex justify-between items-center">
                          <span className="text-white/40 text-xs">Pune's premier real estate — 500+ properties transacted</span>
                          <Link href="/properties" className="text-primary text-xs font-bold tracking-wider hover:underline flex items-center gap-1">
                            View All Listings <ChevronRight size={12} />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-semibold tracking-widest uppercase transition-colors relative group ${location === link.href ? "text-primary" : "text-white/85 hover:text-primary"}`}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${location === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />
                </Link>
              )
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="https://wa.me/919325097835" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold tracking-wider px-4 py-2 hover:bg-[#1fad54] transition-colors"
              data-testid="button-header-whatsapp">
              <SiWhatsapp size={15} /> WhatsApp
            </a>
            <Button asChild className="rounded-none px-5 tracking-widest text-xs font-bold uppercase">
              <Link href="/contact">Enquire Now</Link>
            </Button>
          </div>

          <button className="md:hidden text-white p-1" onClick={() => setIsMobileMenuOpen(true)} data-testid="button-mobile-menu">
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-[hsl(222,47%,10%)] flex flex-col overflow-y-auto"
          >
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <span className="text-xl font-serif font-bold text-white">COSMOS</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white"><X size={28} /></button>
            </div>

            <nav className="flex flex-col px-6 py-8 gap-1">
              {navLinks.map((link) => (
                link.hasDropdown ? (
                  <div key={link.href}>
                    <button
                      onClick={() => setMobilePropertiesOpen(v => !v)}
                      className="w-full flex items-center justify-between py-4 border-b border-white/10 text-white/80 font-semibold text-lg"
                    >
                      Properties
                      <ChevronDown size={18} className={`transition-transform ${mobilePropertiesOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {mobilePropertiesOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-4">
                          {propertiesMenu.map((group) => (
                            <div key={group.category} className="py-3">
                              <div className="text-primary text-xs font-bold tracking-widest uppercase mb-2">{group.category}</div>
                              {group.items.map((item) => (
                                <Link key={item.label} href="/properties"
                                  className="block py-1.5 text-white/60 hover:text-primary text-sm font-medium transition-colors">
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link key={link.href} href={link.href}
                    className={`py-4 border-b border-white/10 text-lg font-semibold transition-colors ${location === link.href ? "text-primary" : "text-white/80 hover:text-primary"}`}>
                    {link.label}
                  </Link>
                )
              ))}
            </nav>

            <div className="px-6 pb-8 flex flex-col gap-3">
              <a href="https://wa.me/919325097835" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 text-sm">
                <SiWhatsapp size={18} /> Chat on WhatsApp
              </a>
              <Button asChild className="rounded-none py-3 text-sm font-bold">
                <Link href="/contact">Enquire Now</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div key={location}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }} className="flex-grow flex flex-col">
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer style={{ background: "linear-gradient(160deg, hsl(222,47%,8%) 0%, hsl(222,47%,14%) 100%)" }} className="text-white pt-20 pb-8">
        <div className="container mx-auto px-4 md:px-8">

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-14 pb-10 border-b border-white/10 gap-8">
            <div>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-serif font-bold text-white tracking-tight">COSMOS</span>
                <span className="text-primary text-sm tracking-widest uppercase font-semibold mb-1">Real Estate</span>
              </div>
              <p className="text-white/55 text-sm max-w-xs leading-relaxed">
                Pune's premier luxury real estate advisory — trusted by 1000+ clients across residential, commercial and industrial segments.
              </p>
              <div className="flex gap-2 mt-5 flex-wrap">
                {["NAR India", "FMP Certified", "Life Member"].map(b => (
                  <span key={b} className="text-[11px] font-bold tracking-widest text-primary border border-primary/50 px-2.5 py-1 uppercase">{b}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <a href="https://wa.me/919325097835" target="_blank" rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-5 py-3 text-sm font-bold flex items-center gap-2 hover:bg-[#1fad54] transition-colors"
                data-testid="button-footer-whatsapp">
                <SiWhatsapp size={18} /> Chat on WhatsApp
              </a>
              <Button asChild className="rounded-none px-5 py-3 text-sm font-bold">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-14">
            {/* Navigate */}
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-5">Navigate</h4>
              <ul className="space-y-2.5">
                {footerNav.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/55 hover:text-primary transition-colors flex items-center gap-1.5 group text-sm">
                      <ChevronRight size={12} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Residential */}
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-5 flex items-center gap-1.5"><Home size={12} /> Residential</h4>
              <ul className="space-y-2 text-sm text-white/55">
                {["Apartments", "Bungalows", "Villas", "Row Houses", "Duplexes", "Plots"].map(s => (
                  <li key={s}><Link href="/properties" className="hover:text-primary transition-colors">{s}</Link></li>
                ))}
              </ul>
            </div>

            {/* Commercial */}
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-5 flex items-center gap-1.5"><Building size={12} /> Commercial</h4>
              <ul className="space-y-2 text-sm text-white/55">
                {["Office Spaces", "Co-working", "Managed Offices", "Shops & Showrooms", "Hotels"].map(s => (
                  <li key={s}><Link href="/properties" className="hover:text-primary transition-colors">{s}</Link></li>
                ))}
              </ul>
            </div>

            {/* Industrial */}
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-5 flex items-center gap-1.5"><Warehouse size={12} /> Industrial</h4>
              <ul className="space-y-2 text-sm text-white/55">
                {["Warehouses", "Industrial Plants", "SEZ / IT Parks"].map(s => (
                  <li key={s}><Link href="/properties" className="hover:text-primary transition-colors">{s}</Link></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-5">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin size={13} className="text-primary mt-1 flex-shrink-0" />
                  <span className="text-white/55 text-xs leading-relaxed">No.2 "H" Building, Liberty-II, Opp. Pizza Hut, North Main Road, Koregaon Park, Pune — 411001</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={13} className="text-primary flex-shrink-0" />
                  <div className="text-white/55 text-xs">
                    <div>+91-9325097835</div>
                    <div>+91-9823056983</div>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={13} className="text-primary flex-shrink-0" />
                  <span className="text-white/55 text-xs">jatin@cosmosrealestate.in</span>
                </li>
              </ul>
              <div className="flex gap-2 mt-5">
                {[Instagram, Linkedin, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/40 hover:border-primary hover:text-primary transition-colors">
                    <Icon size={14} />
                  </a>
                ))}
                <a href="https://wa.me/919325097835" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]/60 hover:border-[#25D366] hover:text-[#25D366] transition-colors">
                  <SiWhatsapp size={14} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/30">
            <p>&copy; {new Date().getFullYear()} Cosmos Real Estate. All rights reserved.</p>
            <p>Jatin Arora — NAR India Life Member | FMP Certified | Koregaon Park, Pune</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/919325097835" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform group flex items-center justify-center"
        aria-label="Chat with us on WhatsApp" data-testid="button-whatsapp-fab">
        <SiWhatsapp size={26} />
        <span className="absolute right-full mr-4 bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us
        </span>
      </a>
    </div>
  );
}
