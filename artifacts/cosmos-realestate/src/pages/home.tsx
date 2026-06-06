import { motion } from "framer-motion";
import { Link } from "wouter";
import { Search, MapPin, Building, Home as HomeIcon, ArrowRight, ShieldCheck, CheckCircle, TrendingUp, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const stats = [
  { value: "500+", label: "Properties Listed" },
  { value: "20+", label: "Years Experience" },
  { value: "1000+", label: "Happy Clients" },
  { value: "Pune's #1", label: "Real Estate Broker" },
];

const categories = ["Flat", "Bungalow", "Row House", "Office", "Shop", "Warehouse", "Co-working"];

const featuredProperties = [
  { id: 1, title: "Trump Towers Pune", location: "Kalyani Nagar", price: "12.5 Cr", size: "4500 sqft", type: "4.5 BHK Flat", image: "/images/res-1.png" },
  { id: 2, title: "Panchshil Towers", location: "Kharadi", price: "9.8 Cr", size: "3800 sqft", type: "4 BHK Flat", image: "/images/res-2.png" },
  { id: 3, title: "Marvel Zephyr", location: "Kharadi", price: "6.5 Cr", size: "2800 sqft", type: "3 BHK Flat", image: "/images/res-3.png" },
  { id: 4, title: "Yoo Pune", location: "Wagholi", price: "15.0 Cr", size: "5200 sqft", type: "5 BHK Flat", image: "/images/res-4.png" },
  { id: 5, title: "Lodha Belmondo", location: "Pune", price: "4.2 Cr", size: "2100 sqft", type: "3 BHK Flat", image: "/images/prop-5.png" },
  { id: 6, title: "Godrej Elements", location: "Hinjewadi", price: "2.8 Cr", size: "1500 sqft", type: "2 BHK Flat", image: "/images/prop-6.png" },
];

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center pt-10 pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('/images/hero-bg.png')" }} 
        />
        
        <div className="container relative z-20 mx-auto px-4 md:px-8 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-serif text-white font-bold leading-tight mb-4 shadow-black drop-shadow-xl">
              Find Your Perfect Property in <span className="text-primary">Pune</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 font-medium tracking-wide drop-shadow-md">
              Buy, Sell, or Rent — Residential, Commercial & Industrial Properties
            </p>

            <div className="bg-white p-4 rounded-xl shadow-2xl max-w-4xl mx-auto">
              <Tabs defaultValue="buy" className="w-full">
                <TabsList className="grid w-[240px] grid-cols-2 mb-4 bg-muted/20">
                  <TabsTrigger value="buy" className="text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Buy</TabsTrigger>
                  <TabsTrigger value="rent" className="text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Rent</TabsTrigger>
                </TabsList>
                
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-grow">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input 
                      placeholder="Enter Locality, Project or Landmark..." 
                      className="pl-10 h-14 rounded-md border-border text-base bg-muted/10 focus-visible:ring-primary"
                    />
                  </div>
                  <Button className="h-14 px-10 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-md shrink-0">
                    <Search className="mr-2" size={20} /> Search
                  </Button>
                </div>
              </Tabs>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <Badge key={cat} variant="secondary" className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm cursor-pointer transition-colors text-sm font-medium">
                  {cat}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-white border-b py-8 shadow-sm relative z-30 -mt-10 mx-4 md:mx-8 rounded-lg">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-border">
            {stats.map((stat, index) => (
              <div key={index} className="px-4">
                <div className="text-2xl md:text-3xl font-serif text-foreground font-bold mb-1">{stat.value}</div>
                <div className="text-muted-foreground text-xs md:text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-10 text-center">Browse by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Residential", count: "320+ Properties", img: "/images/res-1.png", link: "/residential" },
              { title: "Commercial", count: "150+ Properties", img: "/images/com-1.png", link: "/commercial" },
              { title: "Industrial & Warehouse", count: "80+ Properties", img: "/images/ind-1.png", link: "/industrial" },
            ].map((cat, i) => (
              <Link key={i} href={cat.link}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative h-80 rounded-xl overflow-hidden cursor-pointer shadow-md"
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                  <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-gradient-to-t from-black/90 to-transparent">
                    <h3 className="text-2xl font-serif font-bold text-white mb-1">{cat.title}</h3>
                    <p className="text-white/80 text-sm font-medium">{cat.count}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Featured Properties</h2>
              <p className="text-muted-foreground">Handpicked luxury properties in prime locations</p>
            </div>
            <Button variant="outline" asChild className="hidden md:inline-flex border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/residential">View All Properties</Link>
            </Button>
          </div>

          <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide">
            {featuredProperties.map((property) => (
              <div key={property.id} className="min-w-[320px] md:min-w-[380px] snap-start shrink-0 bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group cursor-pointer">
                <div className="relative h-[240px] overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-foreground px-3 py-1 text-xs font-bold rounded-md">
                    {property.type}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-2xl font-bold text-primary mb-1">{property.price}</h3>
                  <h4 className="text-lg font-serif font-semibold text-foreground truncate">{property.title}</h4>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2 mb-4">
                    <MapPin size={14} /> {property.location}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm font-medium text-muted-foreground">{property.size}</span>
                    <Button size="sm" className="bg-primary text-white hover:bg-primary/90">Contact Agent</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" asChild className="w-full mt-4 md:hidden border-primary text-primary">
            <Link href="/residential">View All Properties</Link>
          </Button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Why Cosmos Real Estate?</h2>
            <p className="text-muted-foreground text-lg">Pune's most trusted real estate advisory, offering end-to-end property solutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Verified Listings", desc: "100% physically verified properties with clear titles." },
              { icon: TrendingUp, title: "Market Experts", desc: "20+ years of deep knowledge of Pune's real estate trends." },
              { icon: CheckCircle, title: "NAR India Certified", desc: "Life member of NAR India, ensuring highest ethical standards." },
              { icon: Key, title: "End-to-End Service", desc: "From discovery to registration and possession, we handle it all." }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm text-center border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-10 text-center">Featured Projects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Cosmos Grandeur", location: "Koregaon Park", type: "Ultra Luxury 4/5 BHK", status: "Ready to Move", img: "/images/proj-1.png" },
              { title: "Cosmos Business Hub", location: "Baner", type: "Premium Office Spaces", status: "Under Construction", img: "/images/com-2.png" },
              { title: "Cosmos Logistics Park", location: "Chakan", type: "Grade A Warehouses", status: "Leasing Now", img: "/images/ind-2.png" },
            ].map((proj, i) => (
              <div key={i} className="bg-white border rounded-xl overflow-hidden shadow-sm group">
                <div className="relative h-64 overflow-hidden">
                  <img src={proj.img} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <Badge className="absolute top-4 left-4 bg-black/80 text-white hover:bg-black/80">{proj.status}</Badge>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-foreground mb-1">{proj.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4"><MapPin size={14} className="inline mr-1" />{proj.location}</p>
                  <p className="font-semibold text-primary mb-4">{proj.type}</p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/projects">View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
