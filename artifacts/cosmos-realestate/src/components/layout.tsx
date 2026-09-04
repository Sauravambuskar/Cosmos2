import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, Phone, Mail, Globe, ChevronDown, Wrench } from "lucide-react";
import { SiWhatsapp, SiFacebook, SiInstagram, SiYoutube, SiX } from "react-icons/si";
// react-icons 5.7 dropped LinkedIn from the Simple Icons set, so it comes from
// Font Awesome instead.
import { FaLinkedinIn } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { phoneDigits } from "@/lib/site-settings";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [location] = useLocation();
  const settings = useSiteSettings();
  const { brand, contact, social, footer, features } = settings;

  const socialLinks = [
    { href: social.facebook, icon: SiFacebook, label: "Facebook" },
    { href: social.instagram, icon: SiInstagram, label: "Instagram" },
    { href: social.linkedin, icon: FaLinkedinIn, label: "LinkedIn" },
    { href: social.youtube, icon: SiYoutube, label: "YouTube" },
    { href: social.twitter, icon: SiX, label: "X" },
  ].filter((s) => s.href.trim());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo(0, 0);
  }, [location]);

  // Maintenance mode hides the public site behind a notice. Admin routes render
  // outside this layout, so the panel stays reachable to switch it back off.
  if (features.maintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-6">
        <div className="max-w-md text-center">
          <Wrench className="mx-auto mb-5 text-primary" size={40} />
          <h1 className="text-3xl font-serif font-bold text-foreground mb-3">
            {brand.name} {brand.tagline}
          </h1>
          <p className="text-muted-foreground mb-8">{features.maintenanceMessage}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {contact.phonePrimary && (
              <Button asChild className="bg-primary text-white">
                <a href={`tel:${phoneDigits(contact.phonePrimary)}`}>Call {contact.phonePrimary}</a>
              </Button>
            )}
            {contact.email && (
              <Button asChild variant="outline">
                <a href={`mailto:${contact.email}`}>Email us</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const announcement = features.announcementEnabled && features.announcementText.trim();

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
      {announcement && (
        <div className="fixed top-0 w-full z-[55] bg-primary text-primary-foreground text-center text-sm py-2 px-4">
          {features.announcementLink ? (
            <Link href={features.announcementLink} className="font-medium hover:underline">
              {features.announcementText}
            </Link>
          ) : (
            <span className="font-medium">{features.announcementText}</span>
          )}
        </div>
      )}

      <header
        className={`fixed w-full z-50 transition-all duration-300 border-b ${
          announcement ? "top-9" : "top-0"
        } ${
          isScrolled ? "bg-white shadow-md py-3 border-border/50" : "bg-white/95 backdrop-blur-md py-4 border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.legalName} className="h-10 w-auto object-contain" />
            ) : (
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-bold text-primary leading-none">{brand.name}</span>
                <span className="text-[10px] tracking-widest text-foreground font-semibold uppercase leading-none mt-1">
                  {brand.tagline}
                </span>
              </div>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className={`text-sm font-semibold transition-colors hover:text-primary ${location === "/" ? "text-primary" : "text-foreground"}`}>
              Home
            </Link>
            <Link href="/featured-properties" className={`text-sm font-semibold transition-colors hover:text-primary ${location === "/featured-properties" ? "text-primary" : "text-foreground"}`}>
              Featured
            </Link>
            
            {/* Residential Dropdown */}
            <div className="relative group" onMouseEnter={() => setActiveDropdown('residential')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-primary ${location.startsWith("/residential") ? "text-primary" : "text-foreground"} py-2`}>
                Residential <ChevronDown size={14} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'residential' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-[400px] bg-white shadow-xl border border-border rounded-md overflow-hidden z-50 grid grid-cols-2 p-4 gap-4"
                  >
                    <div>
                      <h4 className="font-serif font-bold text-primary mb-2 border-b pb-1">Buy</h4>
                      <ul className="space-y-2">
                        <li><Link href="/residential?transaction=buy&category=flat" className="text-sm text-foreground hover:text-primary block">Buy Flat</Link></li>
                        <li><Link href="/residential?transaction=buy&category=bungalow" className="text-sm text-foreground hover:text-primary block">Buy Bungalow</Link></li>
                        <li><Link href="/residential?transaction=buy&category=row-house" className="text-sm text-foreground hover:text-primary block">Buy Row House</Link></li>
                        <li><Link href="/residential?transaction=buy&category=duplex" className="text-sm text-foreground hover:text-primary block">Buy Duplex</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-primary mb-2 border-b pb-1">Rent</h4>
                      <ul className="space-y-2">
                        <li><Link href="/residential?transaction=rent&category=flat" className="text-sm text-foreground hover:text-primary block">Rent Flat</Link></li>
                        <li><Link href="/residential?transaction=rent&category=bungalow" className="text-sm text-foreground hover:text-primary block">Rent Bungalow</Link></li>
                        <li><Link href="/residential?transaction=rent&category=row-house" className="text-sm text-foreground hover:text-primary block">Rent Row House</Link></li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Commercial Dropdown */}
            <div className="relative group" onMouseEnter={() => setActiveDropdown('commercial')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-primary ${location.startsWith("/commercial") ? "text-primary" : "text-foreground"} py-2`}>
                Commercial <ChevronDown size={14} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'commercial' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-[400px] bg-white shadow-xl border border-border rounded-md overflow-hidden z-50 grid grid-cols-2 p-4 gap-4"
                  >
                    <div>
                      <h4 className="font-serif font-bold text-primary mb-2 border-b pb-1">Buy</h4>
                      <ul className="space-y-2">
                        <li><Link href="/commercial?transaction=buy&category=office" className="text-sm text-foreground hover:text-primary block">Buy Office</Link></li>
                        <li><Link href="/commercial?transaction=buy&category=shop,showroom" className="text-sm text-foreground hover:text-primary block">Buy Shop/Showroom</Link></li>
                        <li><Link href="/commercial?transaction=buy&category=hotel" className="text-sm text-foreground hover:text-primary block">Buy Hotel</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-primary mb-2 border-b pb-1">Rent</h4>
                      <ul className="space-y-2">
                        <li><Link href="/commercial?transaction=rent&category=co-working" className="text-sm text-foreground hover:text-primary block">Rent Co-working</Link></li>
                        <li><Link href="/commercial?transaction=rent&category=managed-office" className="text-sm text-foreground hover:text-primary block">Rent Managed Office</Link></li>
                        <li><Link href="/commercial?transaction=rent&category=shop" className="text-sm text-foreground hover:text-primary block">Rent Shop</Link></li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Industrial Dropdown */}
            <div className="relative group" onMouseEnter={() => setActiveDropdown('industrial')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-primary ${location.startsWith("/industrial") ? "text-primary" : "text-foreground"} py-2`}>
                Industrial <ChevronDown size={14} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'industrial' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-[400px] bg-white shadow-xl border border-border rounded-md overflow-hidden z-50 grid grid-cols-2 p-4 gap-4"
                  >
                    <div>
                      <h4 className="font-serif font-bold text-primary mb-2 border-b pb-1">Buy</h4>
                      <ul className="space-y-2">
                        <li><Link href="/industrial?transaction=buy&category=warehouse" className="text-sm text-foreground hover:text-primary block">Buy Warehouse</Link></li>
                        <li><Link href="/industrial?transaction=buy&category=factory" className="text-sm text-foreground hover:text-primary block">Buy Factory/Shed</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-primary mb-2 border-b pb-1">Rent</h4>
                      <ul className="space-y-2">
                        <li><Link href="/industrial?transaction=rent&category=warehouse" className="text-sm text-foreground hover:text-primary block">Rent Warehouse</Link></li>
                        <li><Link href="/industrial?transaction=rent&category=industrial-plot" className="text-sm text-foreground hover:text-primary block">Rent Industrial Space</Link></li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {features.showProjectsNav && (
              <Link href="/projects" className={`text-sm font-semibold transition-colors hover:text-primary ${location === "/projects" ? "text-primary" : "text-foreground"}`}>
                Projects
              </Link>
            )}
            <Link href="/about" className={`text-sm font-semibold transition-colors hover:text-primary ${location === "/about" ? "text-primary" : "text-foreground"}`}>
              About
            </Link>
            <Link href="/contact" className={`text-sm font-semibold transition-colors hover:text-primary ${location === "/contact" ? "text-primary" : "text-foreground"}`}>
              Contact
            </Link>
          </nav>

          <div className="hidden lg:block">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 rounded-md">
              <Link href="/contact">Post Requirement</Link>
            </Button>
          </div>

          <button
            className="lg:hidden text-foreground"
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
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col overflow-y-auto"
          >
            <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0">
              <span className="text-xl font-serif font-bold text-primary">{brand.name}</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-foreground">
                <X size={28} />
              </button>
            </div>
            <nav className="flex flex-col p-4 gap-2">
              <Link href="/" className="text-lg font-semibold py-3 border-b">Home</Link>
              <Link href="/featured-properties" className="text-lg font-semibold py-3 border-b">Featured Properties</Link>
              
              <div className="py-2 border-b">
                <button 
                  className="w-full flex justify-between items-center text-lg font-semibold py-1"
                  onClick={() => setActiveDropdown(activeDropdown === 'm-res' ? null : 'm-res')}
                >
                  Residential <ChevronDown size={20} className={`transition-transform ${activeDropdown === 'm-res' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'm-res' && (
                  <div className="pl-4 py-2 space-y-3 bg-secondary/30 mt-2 rounded">
                    <p className="font-serif text-primary font-bold text-sm">Buy</p>
                    <Link href="/residential?transaction=buy&category=flat" className="block text-foreground">Flats / Apartments</Link>
                    <Link href="/residential?transaction=buy&category=bungalow" className="block text-foreground">Bungalows / Villas</Link>
                    <p className="font-serif text-primary font-bold text-sm mt-4">Rent</p>
                    <Link href="/residential?transaction=rent&category=flat" className="block text-foreground">Flats / Apartments</Link>
                  </div>
                )}
              </div>

              <div className="py-2 border-b">
                <button 
                  className="w-full flex justify-between items-center text-lg font-semibold py-1"
                  onClick={() => setActiveDropdown(activeDropdown === 'm-com' ? null : 'm-com')}
                >
                  Commercial <ChevronDown size={20} className={`transition-transform ${activeDropdown === 'm-com' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'm-com' && (
                  <div className="pl-4 py-2 space-y-3 bg-secondary/30 mt-2 rounded">
                    <Link href="/commercial?category=office" className="block text-foreground">Office Spaces</Link>
                    <Link href="/commercial?category=shop,showroom" className="block text-foreground">Shops & Showrooms</Link>
                    <Link href="/commercial?transaction=rent&category=co-working" className="block text-foreground">Co-working Spaces</Link>
                  </div>
                )}
              </div>

              <Link href="/industrial" className="text-lg font-semibold py-3 border-b">Industrial & Warehouse</Link>
              {features.showProjectsNav && (
                <Link href="/projects" className="text-lg font-semibold py-3 border-b">Projects</Link>
              )}
              <Link href="/about" className="text-lg font-semibold py-3 border-b">About</Link>
              <Link href="/contact" className="text-lg font-semibold py-3 border-b">Contact</Link>
              
              <Button asChild className="mt-6 bg-primary text-primary-foreground text-lg py-6 w-full">
                <Link href="/contact">Post Requirement</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`flex-grow flex flex-col ${announcement ? "pt-[108px]" : "pt-[72px]"}`}>
        {children}
      </main>

      <footer className="bg-foreground text-white pt-16 pb-8 mt-auto">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex flex-col mb-6">
                <span className="text-2xl font-serif font-bold text-white leading-none">{brand.name}</span>
                <span className="text-[10px] tracking-widest text-white/70 font-semibold uppercase leading-none mt-1">
                  {brand.tagline}
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-6">{brand.footerAbout}</p>
              {brand.badges.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {brand.badges.map((badge) => (
                    <span key={badge} className="text-xs font-semibold tracking-wider text-white border border-white/20 px-3 py-1.5 rounded bg-white/5">
                      {badge}
                    </span>
                  ))}
                </div>
              )}
              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-lg font-serif font-semibold mb-6 text-white">{footer.propertyLinksTitle}</h4>
              <ul className="space-y-3">
                {footer.propertyLinks.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <Link href={link.href} className="text-white/70 hover:text-white transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-serif font-semibold mb-6 text-white">{footer.quickLinksTitle}</h4>
              <ul className="space-y-3">
                {footer.quickLinks.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <Link href={link.href} className="text-white/70 hover:text-white transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-serif font-semibold mb-6 text-white">Contact Info</h4>
              <ul className="space-y-4 text-white/70 text-sm">
                {contact.addressLine && (
                  <li className="flex items-start gap-3">
                    <MapPin className="text-primary shrink-0 mt-0.5" size={18} />
                    <span>{contact.addressLine}</span>
                  </li>
                )}
                {(contact.phonePrimary || contact.phoneSecondary) && (
                  <li className="flex items-center gap-3">
                    <Phone className="text-primary shrink-0" size={18} />
                    <span>
                      {[contact.phonePrimary, contact.phoneSecondary].filter(Boolean).join(" / ")}
                    </span>
                  </li>
                )}
                {contact.email && (
                  <li className="flex items-center gap-3">
                    <Mail className="text-primary shrink-0" size={18} />
                    <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.website && (
                  <li className="flex items-center gap-3">
                    <Globe className="text-primary shrink-0" size={18} />
                    <a href={contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {contact.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <p>&copy; {new Date().getFullYear()} {brand.copyrightName}. All rights reserved.</p>
            {brand.designedBy && <p>Designed by {brand.designedBy}</p>}
          </div>
        </div>
      </footer>

      {features.whatsappWidget && contact.whatsapp && (
        <a
          href={`https://wa.me/${phoneDigits(contact.whatsapp)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:scale-105 transition-transform group flex items-center justify-center animate-pulse-slow"
          aria-label="Chat with us on WhatsApp"
          style={{ animation: 'pulse 2s infinite' }}
        >
          <SiWhatsapp size={28} />
          <span className="absolute right-full mr-4 bg-foreground text-white text-xs font-semibold px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with us on WhatsApp
          </span>
        </a>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
      `}} />
    </div>
  );
}
