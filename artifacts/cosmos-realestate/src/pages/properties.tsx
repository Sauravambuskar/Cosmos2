import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Maximize, Building2, Phone, Search, SlidersHorizontal,
  BedDouble, X, ChevronDown, Star, Eye, Heart
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

/* ─── Data ─── */
type Property = {
  id: number; title: string; location: string; price: string;
  priceRaw: number; deal: "Buy" | "Rent"; category: "Residential" | "Commercial" | "Industrial";
  subtype: string; config: string; area: string; image: string; featured?: boolean; badge?: string;
};

const allProperties: Property[] = [
  /* Residential - Buy */
  { id: 1, title: "Luxury 6.5 BHK Apartment", location: "Sopan Baug, Pune", price: "₹6.10 Cr", priceRaw: 61000000, deal: "Buy", category: "Residential", subtype: "Apartment", config: "6.5 BHK", area: "4,130 sqft", image: "/projects/sopan-baug-apartment.jpg", featured: true, badge: "Premium" },
  { id: 2, title: "Ultra-Luxury Penthouse", location: "Koregaon Park, Pune", price: "₹8.50 Cr", priceRaw: 85000000, deal: "Buy", category: "Residential", subtype: "Penthouse", config: "4 BHK", area: "3,800 sqft", image: "/stock/luxury-living.jpg", featured: true, badge: "Exclusive" },
  { id: 3, title: "Premium Pool Villa", location: "Kalyani Nagar, Pune", price: "₹12.00 Cr", priceRaw: 120000000, deal: "Buy", category: "Residential", subtype: "Villa", config: "5 BHK", area: "6,200 sqft", image: "/stock/luxury-pool.jpg", featured: true, badge: "Hot" },
  { id: 4, title: "Luxury Independent Bungalow", location: "Aundh, Pune", price: "₹6.50 Cr", priceRaw: 65000000, deal: "Buy", category: "Residential", subtype: "Bungalow", config: "4.5 BHK", area: "5,000 sqft", image: "/stock/luxury-exterior.jpg" },
  { id: 5, title: "1 Acre Bungalow Plot", location: "Sinhagad Road, Pune", price: "₹6.50 Cr", priceRaw: 65000000, deal: "Buy", category: "Residential", subtype: "Plot / Land", config: "Land + Rights", area: "1 Acre (43,560 sqft)", image: "/projects/sinhagad-road-land.jpg" },
  { id: 6, title: "Spacious Row House", location: "Baner, Pune", price: "₹4.20 Cr", priceRaw: 42000000, deal: "Buy", category: "Residential", subtype: "Row House", config: "3.5 BHK", area: "2,800 sqft", image: "/stock/luxury-house.jpg" },
  { id: 7, title: "Designer Duplex Apartment", location: "Viman Nagar, Pune", price: "₹3.80 Cr", priceRaw: 38000000, deal: "Buy", category: "Residential", subtype: "Duplex", config: "3 BHK+Study", area: "2,200 sqft", image: "/stock/luxury-bedroom.jpg" },

  /* Residential - Rent */
  { id: 8, title: "Luxury Bungalow for Rent", location: "Kalyani Nagar, Pune", price: "₹2.5 L/mo", priceRaw: 250000, deal: "Rent", category: "Residential", subtype: "Bungalow", config: "4.5 BHK", area: "3,500 sqft", image: "/projects/kalyani-nagar-bungalow.jpeg", featured: true, badge: "Available" },
  { id: 9, title: "Fully Furnished 3 BHK Flat", location: "Koregaon Park, Pune", price: "₹1.2 L/mo", priceRaw: 120000, deal: "Rent", category: "Residential", subtype: "Apartment", config: "3 BHK", area: "2,100 sqft", image: "/stock/luxury-living.jpg" },
  { id: 10, title: "Premium Villa on Rent", location: "Kalyani Nagar, Pune", price: "₹3.5 L/mo", priceRaw: 350000, deal: "Rent", category: "Residential", subtype: "Villa", config: "5 BHK", area: "5,800 sqft", image: "/stock/luxury-pool.jpg" },

  /* Commercial - Buy/Rent */
  { id: 11, title: "Corporate Office Space", location: "Kalyani Nagar, Pune", price: "On Request", priceRaw: 0, deal: "Rent", category: "Commercial", subtype: "Office", config: "Bare Shell", area: "704 sqft+", image: "/projects/kalyani-nagar-office.jpg", featured: true, badge: "New" },
  { id: 12, title: "Premium Office & Showrooms", location: "Koregaon Park, Pune", price: "On Request", priceRaw: 0, deal: "Buy", category: "Commercial", subtype: "Showroom", config: "Commercial", area: "384–4,115 sqft", image: "/projects/koregaon-park-commercial.jpeg", featured: true },
  { id: 13, title: "Co-working & Managed Offices", location: "Koregaon Park NX, Pune", price: "On Request", priceRaw: 0, deal: "Rent", category: "Commercial", subtype: "Co-working", config: "Bare Shell / Fitted", area: "Flexible", image: "/projects/koregaon-park-nx.jpg" },
  { id: 14, title: "SEZ IT Park — Grade A Offices", location: "Kharadi IT Park, Pune", price: "On Request", priceRaw: 0, deal: "Rent", category: "Commercial", subtype: "Office", config: "IT / ITES / BFSI", area: "2.5 M sqft campus", image: "/projects/kharadi-it-park.jpg", badge: "SEZ" },
  { id: 15, title: "SEZ Campus IT & Software", location: "Hinjawadi Phase 3, Pune", price: "On Request", priceRaw: 0, deal: "Rent", category: "Commercial", subtype: "Office", config: "Office / SEZ", area: "13 Acres | 1.8 M sqft", image: "/projects/hinjawadi-sez.jpeg", badge: "SEZ" },
  { id: 16, title: "Grade-A Corporate Tower", location: "Kharadi, Pune", price: "On Request", priceRaw: 0, deal: "Buy", category: "Commercial", subtype: "Office", config: "Corporate Office", area: "2,000 sqft+", image: "/stock/modern-office.jpg" },
  { id: 17, title: "Retail Shop in Prime Location", location: "Koregaon Park, Pune", price: "On Request", priceRaw: 0, deal: "Rent", category: "Commercial", subtype: "Shop / Retail", config: "Retail", area: "300–1,500 sqft", image: "/stock/office-interior.jpg" },
  { id: 18, title: "Boutique Hotel — Fully Managed", location: "Koregaon Park, Pune", price: "On Request", priceRaw: 0, deal: "Buy", category: "Commercial", subtype: "Hotel", config: "Hospitality", area: "20,000 sqft", image: "/stock/luxury-lobby.jpg", badge: "Rare" },

  /* Industrial */
  { id: 19, title: "Industrial Shed for Rent", location: "Hinjawadi, Pune", price: "₹3.9 L/mo", priceRaw: 390000, deal: "Rent", category: "Industrial", subtype: "Warehouse / Shed", config: "Industrial", area: "20,000 sqft", image: "/projects/hinjawadi-shed.jpg", featured: true, badge: "Available" },
  { id: 20, title: "5-Acre Industrial Facility", location: "Patal Ganga, Navi Mumbai", price: "On Request", priceRaw: 0, deal: "Rent", category: "Industrial", subtype: "Industrial Plant", config: "Manufacturing", area: "1,25,000 sqft", image: "/projects/patal-ganga-industrial.jpeg", badge: "Large" },
  { id: 21, title: "Modern Logistics Warehouse", location: "Hinjawadi, Pune", price: "₹2.8 L/mo", priceRaw: 280000, deal: "Rent", category: "Industrial", subtype: "Warehouse / Shed", config: "Logistics", area: "15,000 sqft", image: "/stock/warehouse.jpg" },
];

const CATEGORY_DATA = {
  Residential: {
    icon: "🏠",
    color: "from-blue-900/80 to-navy-900",
    subtypes: ["All Types", "Apartment", "Bungalow", "Villa", "Row House", "Duplex", "Penthouse", "Plot / Land"],
    bg: "/stock/luxury-house.jpg",
  },
  Commercial: {
    icon: "🏢",
    color: "from-amber-900/80 to-navy-900",
    subtypes: ["All Types", "Office", "Co-working", "Managed Office", "Shop / Retail", "Showroom", "Hotel"],
    bg: "/stock/modern-office.jpg",
  },
  Industrial: {
    icon: "🏭",
    color: "from-gray-900/80 to-navy-900",
    subtypes: ["All Types", "Warehouse / Shed", "Industrial Plant", "SEZ / IT Park"],
    bg: "/stock/warehouse.jpg",
  },
} as const;

type Category = keyof typeof CATEGORY_DATA;

const BUDGET_RANGES = [
  { label: "Any Budget", min: 0, max: Infinity },
  { label: "Under ₹2 Cr", min: 0, max: 20000000 },
  { label: "₹2 Cr – ₹5 Cr", min: 20000000, max: 50000000 },
  { label: "₹5 Cr – ₹10 Cr", min: 50000000, max: 100000000 },
  { label: "Above ₹10 Cr", min: 100000000, max: Infinity },
];

/* ─── Property Card ─── */
function PropertyCard({ p, index }: { p: Property; index: number }) {
  const [saved, setSaved] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="bg-card border border-border group flex flex-col hover:shadow-xl hover:border-primary/30 transition-all"
      data-testid={`card-property-${p.id}`}
    >
      {/* Image */}
      <div className="relative h-[220px] overflow-hidden flex-shrink-0">
        <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 uppercase ${p.deal === "Buy" ? "bg-primary text-white" : "bg-[hsl(222,47%,20%)] text-white"}`}>
            {p.deal}
          </span>
          {p.badge && (
            <span className="bg-white text-primary text-[10px] font-bold tracking-widest px-2.5 py-1 uppercase">{p.badge}</span>
          )}
        </div>

        {/* Save */}
        <button
          onClick={() => setSaved(s => !s)}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-colors ${saved ? "bg-red-500 text-white" : "bg-black/40 text-white hover:bg-red-500"}`}
        >
          <Heart size={14} fill={saved ? "currentColor" : "none"} />
        </button>

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-primary text-white text-sm font-bold px-3 py-1 shadow-lg">{p.price}</span>
        </div>

        {/* View overlay */}
        <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Eye size={24} className="text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base font-serif font-bold leading-snug">{p.title}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
          <MapPin size={13} className="text-primary flex-shrink-0" />
          <span className="text-xs">{p.location}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-xs text-foreground/70 border-t border-border pt-3 mb-4">
          <span className="flex items-center gap-1.5"><BedDouble size={13} className="text-primary" />{p.config}</span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5"><Maximize size={13} className="text-primary" />{p.area}</span>
        </div>

        <div className="flex gap-2 mt-auto">
          <a href="https://wa.me/919325097835" target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button size="sm" className="w-full rounded-none text-xs font-bold tracking-wider h-9">
              <Phone size={12} className="mr-1.5" /> Enquire
            </Button>
          </a>
          <a href="https://wa.me/919325097835" target="_blank" rel="noopener noreferrer"
            className="h-9 w-9 bg-[#25D366] flex items-center justify-center text-white hover:bg-[#1fad54] transition-colors flex-shrink-0">
            <SiWhatsapp size={15} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main ─── */
export default function Properties() {
  const [activeCategory, setActiveCategory] = useState<Category>("Residential");
  const [activeDeal, setActiveDeal] = useState<"All" | "Buy" | "Rent">("All");
  const [activeSubtype, setActiveSubtype] = useState("All Types");
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const catData = CATEGORY_DATA[activeCategory];

  const filtered = useMemo(() => {
    return allProperties.filter((p) => {
      if (p.category !== activeCategory) return false;
      if (activeDeal !== "All" && p.deal !== activeDeal) return false;
      if (activeSubtype !== "All Types" && p.subtype !== activeSubtype) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) &&
        !p.location.toLowerCase().includes(search.toLowerCase())) return false;
      if (budget > 0 && BUDGET_RANGES[budget].min > 0 && p.priceRaw > 0) {
        if (p.priceRaw < BUDGET_RANGES[budget].min || p.priceRaw > BUDGET_RANGES[budget].max) return false;
      }
      return true;
    });
  }, [activeCategory, activeDeal, activeSubtype, search, budget]);

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <div className="w-full bg-background min-h-screen">

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url('${catData.bg}')` }} />
        <div className="absolute inset-0 bg-[hsl(222,47%,8%)]/85" />
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Cosmos Real Estate</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3">Property Listings</h1>
            <p className="text-white/55 mb-8 text-sm">Curated residential, commercial & industrial properties across Pune</p>

            {/* Search Bar */}
            <div className="flex gap-0 max-w-2xl">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or location…"
                  className="pl-11 h-12 rounded-none border-0 text-sm bg-white text-black"
                />
              </div>
              <Button className="h-12 px-6 rounded-none font-bold text-sm" onClick={() => setShowFilters(s => !s)}>
                <SlidersHorizontal size={15} className="mr-2" /> Filters
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="sticky top-[60px] z-30 bg-[hsl(222,47%,10%)] border-b border-white/10 shadow-lg">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex">
            {(Object.keys(CATEGORY_DATA) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setActiveSubtype("All Types"); setActiveDeal("All"); }}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold tracking-wider transition-all border-b-2 ${
                  activeCategory === cat
                    ? "border-primary text-primary"
                    : "border-transparent text-white/60 hover:text-white"
                }`}
              >
                <span>{CATEGORY_DATA[cat].icon}</span> {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">

        {/* Filter Row */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          {/* Buy / Rent */}
          <div className="flex border border-border rounded-none overflow-hidden">
            {(["All", "Buy", "Rent"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setActiveDeal(d)}
                className={`px-5 py-2 text-xs font-bold tracking-widest uppercase transition-colors ${
                  activeDeal === d ? "bg-primary text-white" : "bg-background text-foreground hover:bg-muted"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Subtypes */}
          <div className="flex flex-wrap gap-2">
            {catData.subtypes.map((st) => (
              <button
                key={st}
                onClick={() => setActiveSubtype(st)}
                className={`px-4 py-2 text-xs font-semibold border transition-colors ${
                  activeSubtype === st
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Budget (expanded filters) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full flex flex-wrap gap-3 pt-3 border-t border-border"
              >
                <span className="text-xs font-bold text-muted-foreground self-center">Budget:</span>
                {BUDGET_RANGES.map((r, i) => (
                  <button
                    key={r.label}
                    onClick={() => setBudget(i)}
                    className={`px-4 py-1.5 text-xs font-semibold border transition-colors ${
                      budget === i ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
                <button onClick={() => { setSearch(""); setBudget(0); setActiveDeal("All"); setActiveSubtype("All Types"); }}
                  className="px-3 py-1.5 text-xs font-semibold text-red-400 border border-red-400/30 hover:bg-red-400/10 flex items-center gap-1">
                  <X size={11} /> Clear All
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{filtered.length}</span> properties found in{" "}
            <span className="font-bold text-primary">{activeCategory}</span>
            {activeDeal !== "All" && <> · <span className="font-bold">{activeDeal}</span></>}
            {activeSubtype !== "All Types" && <> · <span className="font-bold">{activeSubtype}</span></>}
          </p>
          <Link href="/contact" className="text-xs text-primary font-bold hover:underline">
            Can't find what you need? Contact us →
          </Link>
        </div>

        {/* Featured strip */}
        {featured.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Star size={15} className="text-primary fill-primary" />
              <h2 className="text-sm font-bold tracking-widest uppercase text-foreground">Featured Listings</h2>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={`featured-${activeCategory}-${activeDeal}-${activeSubtype}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {featured.map((p, i) => <PropertyCard key={p.id} p={p} index={i} />)}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* All listings */}
        {rest.length > 0 && (
          <div>
            {featured.length > 0 && (
              <div className="flex items-center gap-3 mb-4">
                <Building2 size={15} className="text-muted-foreground" />
                <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground">All Listings</h2>
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div key={`rest-${activeCategory}-${activeDeal}-${activeSubtype}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((p, i) => <PropertyCard key={p.id} p={p} index={featured.length + i} />)}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <Building2 size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground text-lg mb-2">No listings found</p>
            <p className="text-muted-foreground/60 text-sm mb-6">Try adjusting your filters or contact us directly.</p>
            <Button asChild className="rounded-none"><Link href="/contact">Contact Us</Link></Button>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <section className="relative py-20 mt-10 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/stock/handshake.jpg')" }} />
        <div className="absolute inset-0 bg-[hsl(222,47%,8%)]/90" />
        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center max-w-2xl">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Looking for Something Specific?</h2>
          <p className="text-white/60 mb-8 text-sm leading-relaxed">Tell us exactly what you need — Jatin Arora will personally curate a shortlist for you within 24 hours.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="rounded-none px-8 font-bold tracking-wider">
              <Link href="/contact">Send Your Requirements</Link>
            </Button>
            <a href="https://wa.me/919325097835" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 h-11 bg-[#25D366] text-white font-bold text-sm hover:bg-[#1fad54] transition-colors">
              <SiWhatsapp size={17} /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
