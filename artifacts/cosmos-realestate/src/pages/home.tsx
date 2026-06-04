import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import {
  Search, MapPin, Building, Star, ArrowRight, ShieldCheck,
  Home as HomeIcon, TrendingUp, Users, Award, Handshake,
  Phone, ChevronRight, Eye
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

/* ─── Data ─── */
const stats = [
  { value: 500, suffix: "+", label: "Properties Dealt", icon: Building },
  { value: 20, suffix: "+", label: "Years Experience", icon: Award },
  { value: 1000, suffix: "+", label: "Happy Clients", icon: Users },
  { value: 500, prefix: "₹", suffix: " Cr+", label: "Portfolio Value", icon: TrendingUp },
];

const featuredProperties = [
  {
    id: 1, title: "Ultra-Luxury Penthouse", location: "Koregaon Park, Pune",
    price: "8.50 Cr", type: "Buy", config: "4 BHK", area: "3,800 sqft",
    image: "/stock/luxury-living.jpg", tag: "Residential",
  },
  {
    id: 2, title: "Premium Pool Villa", location: "Kalyani Nagar, Pune",
    price: "12.00 Cr", type: "Buy", config: "5 BHK", area: "6,200 sqft",
    image: "/stock/luxury-pool.jpg", tag: "Residential",
  },
  {
    id: 3, title: "Designer Luxury Apartment", location: "Baner, Pune",
    price: "1.2 L/mo", type: "Rent", config: "3 BHK", area: "2,100 sqft",
    image: "/stock/luxury-bedroom.jpg", tag: "Residential",
  },
  {
    id: 4, title: "Grade-A Corporate Office", location: "Kharadi IT Park, Pune",
    price: "On Request", type: "Commercial", config: "Office", area: "2,000 sqft+",
    image: "/stock/modern-office.jpg", tag: "Commercial",
  },
  {
    id: 5, title: "Luxury Independent Bungalow", location: "Aundh, Pune",
    price: "6.50 Cr", type: "Buy", config: "4.5 BHK", area: "5,000 sqft",
    image: "/stock/luxury-exterior.jpg", tag: "Residential",
  },
  {
    id: 6, title: "Industrial Warehouse & Shed", location: "Hinjawadi, Pune",
    price: "3.9 L/mo", type: "Commercial", config: "Industrial", area: "20,000 sqft",
    image: "/stock/warehouse.jpg", tag: "Industrial",
  },
];

const portfolioMix = [
  { name: "Residential", value: 45 },
  { name: "Commercial", value: 30 },
  { name: "Industrial", value: 20 },
  { name: "Land / Plots", value: 5 },
];

const COLORS = ["#C5962B", "#1e3a5f", "#2d6a4f", "#a0522d"];

const yearlyData = [
  { year: "2020", properties: 18 },
  { year: "2021", properties: 25 },
  { year: "2022", properties: 32 },
  { year: "2023", properties: 41 },
  { year: "2024", properties: 48 },
];

const locations = [
  { name: "Koregaon Park", type: "Residential & Commercial", image: "/stock/luxury-lobby.jpg" },
  { name: "Kalyani Nagar", type: "Residential & Offices", image: "/projects/kalyani-nagar-office.jpg" },
  { name: "Kharadi", type: "IT Park & SEZ", image: "/projects/kharadi-it-park.jpg" },
  { name: "Hinjawadi", type: "Tech & Industrial", image: "/projects/hinjawadi-sez.jpeg" },
];

const testimonials = [
  { id: 1, name: "Rahul Deshmukh", role: "NRI Investor, Dubai", avatar: "RD", text: "Cosmos made investing in Pune real estate seamless from abroad. Jatin's expertise and transparency are truly unmatched. Closed three deals in under 60 days." },
  { id: 2, name: "Sneha Patil", role: "Homeowner, Koregaon Park", avatar: "SP", text: "Finding our dream home was a breeze with Cosmos. They understood exactly what we wanted and delivered beyond expectations." },
  { id: 3, name: "Vikram Sharma", role: "Business Owner, Kharadi", avatar: "VS", text: "The commercial leasing team is exceptional. Found the perfect 2,000 sqft office space for our startup within two weeks." },
];

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-serif font-bold text-primary tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (active && payload?.length) {
    return (
      <div className="bg-[hsl(222,47%,12%)] border border-primary/30 px-4 py-2 text-sm text-white">
        <p className="font-semibold text-primary">{payload[0].name}</p>
        <p>{payload[0].value}%</p>
      </div>
    );
  }
  return null;
}

/* ─── Parallax Hero Image ─── */
function ParallaxHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section ref={ref} className="relative h-screen min-h-[750px] flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: "url('/images/hero-bg.png')", y }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />

      <div className="container relative z-20 mx-auto px-4 md:px-8 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-primary text-xs tracking-[0.3em] uppercase font-semibold mb-6 block"
          >
            Pune's Premier Real Estate Advisory
          </motion.span>

          <h1 className="text-5xl md:text-7xl font-serif text-white font-bold leading-tight mb-6 drop-shadow-xl">
            Find Your Place{" "}
            <br className="hidden md:block" />
            in the{" "}
            <motion.em
              className="text-primary not-italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Cosmos
            </motion.em>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-12 font-light tracking-wide max-w-2xl mx-auto">
            Luxury residential, prime commercial, and industrial real estate — curated by Jatin Arora across Pune and beyond.
          </p>

          {/* Search widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="bg-white/97 backdrop-blur-md p-6 shadow-2xl max-w-3xl mx-auto"
          >
            <Tabs defaultValue="buy" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-5 bg-muted/50 rounded-none h-12">
                {["buy", "rent", "commercial"].map((t) => (
                  <TabsTrigger
                    key={t}
                    value={t}
                    className="text-sm font-bold rounded-none capitalize tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white"
                    data-testid={`tab-search-${t}`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input placeholder="Location, Landmark, or Project" className="pl-10 h-12 rounded-none border-border text-sm" data-testid="input-search" />
                </div>
                <Button className="h-12 px-8 rounded-none font-bold tracking-widest text-sm" data-testid="button-search">
                  <Search className="mr-2" size={17} /> Search
                </Button>
              </div>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
          className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Main ─── */
export default function Home() {
  return (
    <div className="w-full">

      {/* Hero */}
      <ParallaxHero />

      {/* Animated Stats Bar */}
      <section className="bg-[hsl(222,47%,9%)] py-14 border-b border-primary/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-primary/15 rounded-full flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                  <stat.icon size={20} className="text-primary" />
                </div>
                <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                <div className="text-white/45 text-xs tracking-widest uppercase font-medium mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Curated Selection</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Featured Properties</h2>
              <p className="text-muted-foreground mt-3 max-w-md">Handpicked from Pune's finest residential, commercial and industrial segments.</p>
            </div>
            <Link href="/properties" className="text-primary hover:text-primary/70 transition-colors font-bold flex items-center gap-2 mt-6 md:mt-0 text-sm tracking-wider group">
              View All Listings <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group cursor-pointer relative overflow-hidden"
                data-testid={`card-featured-${property.id}`}
              >
                {/* Image */}
                <div className="relative h-[320px] overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-primary text-white text-[10px] font-bold tracking-widest px-2.5 py-1 uppercase">{property.type}</span>
                    <span className="bg-black/50 text-white text-[10px] font-bold tracking-widest px-2.5 py-1 uppercase backdrop-blur-sm">{property.tag}</span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <Eye size={32} className="mx-auto mb-3 opacity-80" />
                      <div className="text-lg font-serif font-bold">{property.title}</div>
                      <div className="text-white/70 text-sm mt-1">{property.config} · {property.area}</div>
                      <Link href="/properties" className="mt-5 inline-flex items-center gap-2 border border-white text-white text-xs font-bold tracking-widest px-4 py-2 hover:bg-white hover:text-primary transition-colors">
                        View Details <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="text-xs text-white/60 font-medium mb-1 flex items-center gap-1">
                      <MapPin size={11} /> {property.location}
                    </div>
                    <h3 className="text-white font-serif font-bold text-xl leading-tight">{property.title}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-white/70 text-xs">{property.config} · {property.area}</span>
                      <span className="text-primary font-bold text-base bg-black/60 px-2 py-0.5 backdrop-blur-sm">₹{property.price}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-bleed "Promise" section */}
      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/stock/handshake.jpg')" }}
        />
        <div className="absolute inset-0 bg-[hsl(222,47%,10%)]/88" />
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Our Commitment</span>
              <h2 className="text-4xl md:text-5xl font-serif text-white font-bold leading-tight mb-6">
                Built on Trust.<br />
                <em className="text-primary not-italic">Driven by Results.</em>
              </h2>
              <p className="text-white/65 text-lg leading-relaxed mb-8">
                With over two decades in Pune's premium real estate market, Cosmos Real Estate has earned its reputation through one principle: your interest, always first. NAR India Life Member. FMP Certified.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://wa.me/919325097835" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 font-bold text-sm hover:bg-[#1fad54] transition-colors"
                  data-testid="button-promise-whatsapp">
                  <SiWhatsapp size={17} /> Chat on WhatsApp
                </a>
                <Button asChild variant="outline" className="rounded-none border-white/30 text-white hover:bg-white/10 px-6 py-3 h-auto text-sm font-bold">
                  <Link href="/about">Our Story</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: ShieldCheck, title: "NAR India", sub: "Life Member — highest ethical standards" },
                { icon: Award, title: "FMP Certified", sub: "Facilities Management Professional" },
                { icon: Handshake, title: "NRI Advisory", sub: "Seamless transactions for overseas clients" },
                { icon: TrendingUp, title: "₹500 Cr+", sub: "Portfolio successfully transacted" },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 hover:border-primary/40 transition-colors">
                  <item.icon size={26} className="text-primary mb-3" />
                  <div className="text-white font-serif font-bold mb-1">{item.title}</div>
                  <div className="text-white/45 text-xs leading-relaxed">{item.sub}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Locations We Serve */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Coverage Across Pune</span>
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Prime Locations</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From the leafy avenues of Koregaon Park to the booming IT corridors of Kharadi — we know every pocket of Pune intimately.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {locations.map((loc, index) => (
              <motion.div
                key={loc.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative h-[280px] overflow-hidden group cursor-pointer"
                data-testid={`card-location-${index}`}
              >
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/50 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-serif font-bold text-xl">{loc.name}</h3>
                  <p className="text-white/60 text-xs mt-1 tracking-wider">{loc.type}</p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href="/properties" className="text-white font-bold text-xs tracking-widest border border-white px-4 py-2 hover:bg-white hover:text-primary transition-colors">
                    EXPLORE
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Charts */}
      <section className="py-24 bg-[hsl(222,47%,9%)]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">By the Numbers</span>
            <h2 className="text-4xl font-serif font-bold text-white">Portfolio at a Glance</h2>
            <p className="text-white/45 mt-3 max-w-xl mx-auto text-sm">Two decades of building Pune's real estate landscape.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="bg-white/5 border border-white/10 p-8"
            >
              <h3 className="text-lg font-serif font-bold text-white mb-1">Portfolio Mix</h3>
              <p className="text-white/40 text-xs tracking-wider uppercase mb-6">By property segment</p>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={portfolioMix} cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={3} dataKey="value" animationBegin={200} animationDuration={1200}>
                    {portfolioMix.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {portfolioMix.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-white/60 text-xs">{entry.name}</span>
                    <span className="text-primary text-xs font-bold ml-auto">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white/5 border border-white/10 p-8"
            >
              <h3 className="text-lg font-serif font-bold text-white mb-1">Annual Transactions</h3>
              <p className="text-white/40 text-xs tracking-wider uppercase mb-6">Properties closed per year</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={yearlyData} barSize={30}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(222,47%,12%)", border: "1px solid rgba(197,150,43,0.3)", borderRadius: 0 }}
                    labelStyle={{ color: "#C5962B", fontWeight: 700 }}
                    itemStyle={{ color: "#fff" }}
                    cursor={{ fill: "rgba(197,150,43,0.06)" }}
                  />
                  <Bar dataKey="properties" fill="#C5962B" radius={[2, 2, 0, 0]} animationDuration={1400} name="Properties" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: image stack */}
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="relative hidden lg:block"
            >
              <img src="/stock/luxury-house.jpg" alt="Luxury home" className="w-full h-[520px] object-cover" />
              <img src="/stock/office-interior.jpg" alt="Office" className="absolute -bottom-10 -right-10 w-60 h-48 object-cover border-4 border-background shadow-2xl" />
              <div className="absolute top-8 -left-8 bg-primary text-white p-6 shadow-xl">
                <div className="text-3xl font-serif font-bold">20+</div>
                <div className="text-white/80 text-xs tracking-widest uppercase mt-1">Years of Trust</div>
              </div>
            </motion.div>

            {/* Right: features */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            >
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Our Advantage</span>
              <h2 className="text-4xl font-serif font-bold text-foreground mb-8">Why Cosmos Real Estate</h2>
              <div className="space-y-6">
                {[
                  { icon: ShieldCheck, title: "Certified & Ethical", desc: "NAR India Life Member and FMP certified. No hidden fees, no conflicts of interest — ever." },
                  { icon: Building, title: "Premium Portfolio", desc: "Exclusive access to Pune's finest luxury and commercial properties before they reach the open market." },
                  { icon: Star, title: "Bespoke Service", desc: "Personalized end-to-end guidance from shortlisting through legal documentation and registration." },
                  { icon: Handshake, title: "NRI Specialists", desc: "Experienced in handling transactions for non-resident Indians — paperwork, FEMA compliance, and all." },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex gap-5 group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                      <feature.icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 flex gap-4">
                <Button asChild size="lg" className="rounded-none px-8 font-bold tracking-wider">
                  <Link href="/contact">Book a Consultation</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none px-8 font-bold tracking-wider">
                  <Link href="/properties">Browse Properties</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">What Clients Say</span>
            <h2 className="text-4xl font-serif font-bold text-foreground">Real Experiences</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="bg-card border border-border p-8 relative hover:border-primary/30 transition-colors group"
              >
                <div className="text-primary/20 text-8xl font-serif absolute top-4 right-6 leading-none select-none">"</div>
                <div className="flex gap-1 text-primary mb-5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                </div>
                <p className="text-foreground/75 font-serif italic leading-relaxed mb-8 relative z-10">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm">{t.name}</div>
                    <div className="text-primary text-xs font-semibold tracking-wider">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — full bleed with aerial city */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/stock/aerial-city.jpg')" }} />
        <div className="absolute inset-0 bg-[hsl(222,47%,8%)]/90" />
        <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Let's Begin</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white leading-tight">
              Ready to Find Your<br />Dream Property?
            </h2>
            <p className="text-xl mb-12 text-white/65 font-light">
              Let Jatin Arora personally guide you through Pune's premium real estate market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-none px-10 h-14 text-base bg-primary hover:bg-primary/90 font-bold tracking-wider text-white">
                <Link href="/contact" data-testid="button-cta-contact">Schedule a Consultation</Link>
              </Button>
              <a
                href="https://wa.me/919325097835" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 h-14 px-8 bg-[#25D366] text-white font-bold text-base hover:bg-[#1fad54] transition-colors"
                data-testid="button-cta-whatsapp"
              >
                <SiWhatsapp size={20} /> Chat on WhatsApp
              </a>
            </div>

            {/* Inline contact */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 text-white/45 text-sm">
              <a href="tel:+919325097835" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={15} className="text-primary" /> +91-9325097835
              </a>
              <a href="tel:+919823056983" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={15} className="text-primary" /> +91-9823056983
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={15} className="text-primary" /> Koregaon Park, Pune
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
