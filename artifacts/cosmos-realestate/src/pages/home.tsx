import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import {
  Search, MapPin, Building, Star, ArrowRight, ShieldCheck,
  Home as HomeIcon, TrendingUp, Users, Award, Handshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

/* ─── Data ─── */
const stats = [
  { value: 500, suffix: "+", label: "Properties Dealt", icon: Building },
  { value: 20, suffix: "+", label: "Years Experience", icon: Award },
  { value: 1000, suffix: "+", label: "Happy Clients", icon: Users },
  { value: 500, prefix: "₹", suffix: " Cr+", label: "Portfolio Value", icon: TrendingUp },
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

const featuredProperties = [
  { id: 1, title: "6.5 BHK Luxury Apartment", location: "Sopan Baug", price: "6.10 Cr", type: "Residential", image: "/projects/sopan-baug-apartment.jpg" },
  { id: 2, title: "Premium Office & Showrooms", location: "Koregaon Park", price: "On Request", type: "Commercial", image: "/projects/koregaon-park-commercial.jpeg" },
  { id: 3, title: "Corporate Offices NX", location: "Koregaon Park NX", price: "On Request", type: "Commercial", image: "/projects/koregaon-park-nx.jpg" },
  { id: 4, title: "Luxury Bungalow", location: "Kalyani Nagar", price: "On Request", type: "Residential", image: "/projects/kalyani-nagar-bungalow.jpeg" },
  { id: 5, title: "SEZ IT Park", location: "Kharadi", price: "On Request", type: "Commercial", image: "/projects/kharadi-it-park.jpg" },
  { id: 6, title: "5-Acre Industrial Facility", location: "Navi Mumbai", price: "On Request", type: "Industrial", image: "/projects/patal-ganga-industrial.jpeg" },
];

const testimonials = [
  { id: 1, name: "Rahul Deshmukh", role: "NRI Investor", text: "Cosmos made investing in Pune real estate seamless. Jatin's expertise and transparency are unmatched." },
  { id: 2, name: "Sneha Patil", role: "Homeowner", text: "Finding our dream home in Koregaon Park was a breeze with Cosmos. They understood exactly what we wanted." },
  { id: 3, name: "Vikram Sharma", role: "Business Owner", text: "The commercial leasing team is exceptional. They found the perfect office space for our growing startup." },
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
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-serif font-bold text-primary">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

/* ─── Custom Tooltip ─── */
function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[hsl(222,47%,12%)] border border-primary/30 px-4 py-2 text-sm text-white rounded">
        <p className="font-semibold text-primary">{payload[0].name}</p>
        <p>{payload[0].value}%</p>
      </div>
    );
  }
  return null;
}

/* ─── Component ─── */
export default function Home() {
  const [_tab, setTab] = useState("buy");

  return (
    <div className="w-full">
      {/* ── Hero ── */}
      <section className="relative h-screen min-h-[750px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-secondary/50 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
        />
        <div className="container relative z-20 mx-auto px-4 md:px-8 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-primary text-xs tracking-[0.3em] uppercase font-semibold mb-6 block"
            >
              Pune's Premier Real Estate Advisory
            </motion.span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-bold leading-tight mb-6 drop-shadow-xl">
              Find Your Place in the{" "}
              <em className="text-primary not-italic">Cosmos</em>
            </h1>
            <p className="text-lg md:text-xl text-white/85 mb-10 font-light tracking-wide drop-shadow-md max-w-2xl mx-auto">
              Luxury residential, prime commercial, and industrial real estate — curated by Jatin Arora across Pune and beyond.
            </p>

            <div className="bg-white/95 backdrop-blur-md p-6 shadow-2xl max-w-3xl mx-auto">
              <Tabs defaultValue="buy" className="w-full" onValueChange={setTab}>
                <TabsList className="grid w-full grid-cols-3 mb-5 bg-muted/50 rounded-none h-12">
                  {["buy", "rent", "commercial"].map((t) => (
                    <TabsTrigger
                      key={t}
                      value={t}
                      className="text-sm font-semibold rounded-none capitalize tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white"
                      data-testid={`tab-search-${t}`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-grow">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      placeholder="Location, Landmark, or Project"
                      className="pl-10 h-12 rounded-none border-border text-sm"
                      data-testid="input-search-location"
                    />
                  </div>
                  <Button className="h-12 px-8 rounded-none font-semibold tracking-wider" data-testid="button-search">
                    <Search className="mr-2" size={18} /> Search
                  </Button>
                </div>
              </Tabs>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── Animated Stats ── */}
      <section className="bg-[hsl(222,47%,10%)] py-16 border-b-2 border-primary/30">
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
                  <stat.icon size={22} className="text-primary" />
                </div>
                <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                <div className="text-white/55 text-xs tracking-widest uppercase font-medium mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Properties ── */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-primary font-semibold tracking-widest uppercase text-xs mb-2 block">Curated Selection</span>
              <h2 className="text-4xl font-serif font-bold text-foreground">Featured Properties</h2>
            </div>
            <Link href="/properties" className="text-primary hover:text-primary/70 transition-colors font-semibold flex items-center gap-2 mt-4 md:mt-0 text-sm tracking-wider">
              View All <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group cursor-pointer bg-card border border-border overflow-hidden"
                data-testid={`card-featured-${property.id}`}
              >
                <div className="relative h-[230px] overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold tracking-wider px-2.5 py-1 uppercase">
                    {property.type}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-sm font-bold px-3 py-1 backdrop-blur-sm">
                    ₹{property.price}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-serif font-bold mb-1.5 group-hover:text-primary transition-colors">{property.title}</h3>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <MapPin size={13} className="text-primary" />
                    {property.location}, Pune
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio Infographics ── */}
      <section className="py-24 bg-[hsl(222,47%,10%)]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold tracking-widest uppercase text-xs mb-3 block">By the Numbers</span>
            <h2 className="text-4xl font-serif font-bold text-white">Our Portfolio at a Glance</h2>
            <p className="text-white/50 mt-3 max-w-xl mx-auto text-sm">
              Two decades of building Pune's real estate landscape — from luxury homes to industrial parks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Donut Chart */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 border border-white/10 p-8"
            >
              <h3 className="text-lg font-serif font-bold text-white mb-2">Portfolio Mix</h3>
              <p className="text-white/45 text-xs tracking-wider uppercase mb-6">By property segment</p>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={portfolioMix}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1200}
                  >
                    {portfolioMix.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {portfolioMix.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-white/65 text-xs">{entry.name}</span>
                    <span className="text-primary text-xs font-bold ml-auto">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white/5 border border-white/10 p-8"
            >
              <h3 className="text-lg font-serif font-bold text-white mb-2">Annual Transactions</h3>
              <p className="text-white/45 text-xs tracking-wider uppercase mb-6">Properties closed per year</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={yearlyData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(222,47%,12%)", border: "1px solid rgba(197,150,43,0.3)", borderRadius: 0 }}
                    labelStyle={{ color: "#C5962B", fontWeight: 700 }}
                    itemStyle={{ color: "#fff" }}
                    cursor={{ fill: "rgba(197,150,43,0.06)" }}
                  />
                  <Bar dataKey="properties" fill="#C5962B" radius={[2, 2, 0, 0]} animationDuration={1400} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-semibold tracking-widest uppercase text-xs mb-3 block">Our Advantage</span>
            <h2 className="text-4xl font-serif font-bold text-foreground mb-5">Why Cosmos Real Estate</h2>
            <p className="text-muted-foreground">
              We don't just sell properties — we build lifelong relationships based on trust, transparency, and market expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Certified & Trusted", desc: "NAR India Life Member and FMP certified. Ethics and integrity are non-negotiable." },
              { icon: Building, title: "Premium Portfolio", desc: "Access to Pune's most exclusive luxury and commercial properties." },
              { icon: Star, title: "Bespoke Service", desc: "Personalized end-to-end assistance from selection to legal documentation." },
              { icon: Handshake, title: "NRI Friendly", desc: "Specialized advisory for non-resident Indians seeking Pune investments." },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 border border-border hover:border-primary/40 transition-colors group bg-card"
              >
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <feature.icon size={26} />
                </div>
                <h3 className="text-lg font-serif font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold tracking-widest uppercase text-xs mb-3 block">What Clients Say</span>
            <h2 className="text-4xl font-serif font-bold text-foreground">Client Experiences</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card p-8 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="text-primary mb-5 flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-lg font-serif italic text-foreground/80 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-primary text-xs font-semibold tracking-wider uppercase mt-1">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-5 text-white">
              Ready to find your dream property?
            </h2>
            <p className="text-xl mb-10 text-white/85 font-light">
              Let Jatin Arora guide you through Pune's premium real estate market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-none px-10 h-14 text-base bg-white text-primary hover:bg-white/90 font-bold tracking-wider">
                <Link href="/contact" data-testid="button-cta-consult">Schedule a Consultation</Link>
              </Button>
              <a
                href="https://wa.me/919325097835"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-14 px-8 bg-[#25D366] text-white font-bold text-base hover:bg-[#1fad54] transition-colors"
                data-testid="button-cta-whatsapp"
              >
                <HomeIcon size={18} />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
