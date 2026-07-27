import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, Phone, Mail, ChevronRight, ChevronDown } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
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
    setActiveDropdown(null);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          isScrolled ? "bg-white shadow-md py-3 border-border/50" : "bg-white/95 backdrop-blur-md py-4 border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold text-primary leading-none">COSMOS</span>
              <span className="text-[10px] tracking-widest text-foreground font-semibold uppercase leading-none mt-1">Real Estate</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className={`text-sm font-semibold transition-colors hover:text-primary ${location === "/" ? "text-primary" : "text-foreground"}`}>
              Home
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
                        <li><Link href="/residential?type=buy&category=flat" className="text-sm text-foreground hover:text-primary block">Buy Flat</Link></li>
                        <li><Link href="/residential?type=buy&category=bungalow" className="text-sm text-foreground hover:text-primary block">Buy Bungalow</Link></li>
                        <li><Link href="/residential?type=buy&category=rowhouse" className="text-sm text-foreground hover:text-primary block">Buy Row House</Link></li>
                        <li><Link href="/residential?type=buy&category=duplex" className="text-sm text-foreground hover:text-primary block">Buy Duplex</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-primary mb-2 border-b pb-1">Rent</h4>
                      <ul className="space-y-2">
                        <li><Link href="/residential?type=rent&category=flat" className="text-sm text-foreground hover:text-primary block">Rent Flat</Link></li>
                        <li><Link href="/residential?type=rent&category=bungalow" className="text-sm text-foreground hover:text-primary block">Rent Bungalow</Link></li>
                        <li><Link href="/residential?type=rent&category=rowhouse" className="text-sm text-foreground hover:text-primary block">Rent Row House</Link></li>
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
                        <li><Link href="/commercial?type=buy&category=office" className="text-sm text-foreground hover:text-primary block">Buy Office</Link></li>
                        <li><Link href="/commercial?type=buy&category=shop" className="text-sm text-foreground hover:text-primary block">Buy Shop/Showroom</Link></li>
                        <li><Link href="/commercial?type=buy&category=hotel" className="text-sm text-foreground hover:text-primary block">Buy Hotel</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-primary mb-2 border-b pb-1">Rent</h4>
                      <ul className="space-y-2">
                        <li><Link href="/commercial?type=rent&category=coworking" className="text-sm text-foreground hover:text-primary block">Rent Co-working</Link></li>
                        <li><Link href="/commercial?type=rent&category=managed" className="text-sm text-foreground hover:text-primary block">Rent Managed Office</Link></li>
                        <li><Link href="/commercial?type=rent&category=shop" className="text-sm text-foreground hover:text-primary block">Rent Shop</Link></li>
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
                        <li><Link href="/industrial?type=buy&category=warehouse" className="text-sm text-foreground hover:text-primary block">Buy Warehouse</Link></li>
                        <li><Link href="/industrial?type=buy&category=factory" className="text-sm text-foreground hover:text-primary block">Buy Factory/Shed</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-primary mb-2 border-b pb-1">Rent</h4>
                      <ul className="space-y-2">
                        <li><Link href="/industrial?type=rent&category=warehouse" className="text-sm text-foreground hover:text-primary block">Rent Warehouse</Link></li>
                        <li><Link href="/industrial?type=rent&category=industrial" className="text-sm text-foreground hover:text-primary block">Rent Industrial Space</Link></li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/projects" className={`text-sm font-semibold transition-colors hover:text-primary ${location === "/projects" ? "text-primary" : "text-foreground"}`}>
              Projects
            </Link>
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
              <span className="text-xl font-serif font-bold text-primary">COSMOS</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-foreground">
                <X size={28} />
              </button>
            </div>
            <nav className="flex flex-col p-4 gap-2">
              <Link href="/" className="text-lg font-semibold py-3 border-b">Home</Link>
              
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
                    <Link href="/residential" className="block text-foreground">Flats / Apartments</Link>
                    <Link href="/residential" className="block text-foreground">Bungalows / Villas</Link>
                    <p className="font-serif text-primary font-bold text-sm mt-4">Rent</p>
                    <Link href="/residential" className="block text-foreground">Flats / Apartments</Link>
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
                    <Link href="/commercial" className="block text-foreground">Office Spaces</Link>
                    <Link href="/commercial" className="block text-foreground">Shops & Showrooms</Link>
                    <Link href="/commercial" className="block text-foreground">Co-working Spaces</Link>
                  </div>
                )}
              </div>

              <Link href="/industrial" className="text-lg font-semibold py-3 border-b">Industrial & Warehouse</Link>
              <Link href="/projects" className="text-lg font-semibold py-3 border-b">Projects</Link>
              <Link href="/about" className="text-lg font-semibold py-3 border-b">About</Link>
              <Link href="/contact" className="text-lg font-semibold py-3 border-b">Contact</Link>
              
              <Button asChild className="mt-6 bg-primary text-primary-foreground text-lg py-6 w-full">
                <Link href="/contact">Post Requirement</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow flex flex-col pt-[72px]">
        {children}
      </main>

      <footer className="bg-foreground text-white pt-16 pb-8 mt-auto">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex flex-col mb-6">
                <span className="text-2xl font-serif font-bold text-white leading-none">COSMOS</span>
                <span className="text-[10px] tracking-widest text-white/70 font-semibold uppercase leading-none mt-1">Real Estate</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                India's premier property portal for buying, selling, and renting luxury residential, commercial, and industrial properties in Pune.
              </p>
              <div className="flex gap-3">
                <span className="text-xs font-semibold tracking-wider text-white border border-white/20 px-3 py-1.5 rounded bg-white/5">NAR INDIA</span>
                <span className="text-xs font-semibold tracking-wider text-white border border-white/20 px-3 py-1.5 rounded bg-white/5">FMP CERTIFIED</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-serif font-semibold mb-6 text-white">Properties in Pune</h4>
              <ul className="space-y-3">
                <li><Link href="/residential" className="text-white/70 hover:text-white transition-colors text-sm">Flats for Sale in Pune</Link></li>
                <li><Link href="/residential" className="text-white/70 hover:text-white transition-colors text-sm">Bungalows for Sale</Link></li>
                <li><Link href="/commercial" className="text-white/70 hover:text-white transition-colors text-sm">Commercial Offices for Rent</Link></li>
                <li><Link href="/commercial" className="text-white/70 hover:text-white transition-colors text-sm">Shops for Sale</Link></li>
                <li><Link href="/industrial" className="text-white/70 hover:text-white transition-colors text-sm">Warehouses in Chakan</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-serif font-semibold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/projects" className="text-white/70 hover:text-white transition-colors text-sm">New Projects</Link></li>
                <li><Link href="/about" className="text-white/70 hover:text-white transition-colors text-sm">About Jatin Arora</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors text-sm">Post your Property</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors text-sm">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-serif font-semibold mb-6 text-white">Contact Info</h4>
              <ul className="space-y-4 text-white/70 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="text-primary shrink-0 mt-0.5" size={18} />
                  <span>Shop No B4, Upper Ground, Fifth Avenue, Dholepatil Road, Pune - 411001</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-primary shrink-0" size={18} />
                  <span>+91-9823056983</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-primary shrink-0" size={18} />
                  <span>jatin@cosmosrealestate.in</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <p>&copy; {new Date().getFullYear()} Cosmos Real Estate. All rights reserved.</p>
            <p>Designed like India's top property portals.</p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/919823056983"
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
