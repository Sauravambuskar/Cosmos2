import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { fetchProperties, fetchProjects, primaryImage, areaLabel, categoryLabel, projectImage } from "@/lib/api";

const stats = [
  { value: "500+", label: "Properties Listed" },
  { value: "20+", label: "Years Experience" },
  { value: "1000+", label: "Happy Clients" },
  { value: "Pune's #1", label: "Real Estate Broker" },
];

const categories = ["Flat", "Bungalow", "Row House", "Office", "Shop", "Warehouse", "Co-working"];

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchVal, setSearchVal] = useState("");
  const [activeTab, setActiveTab] = useState("buy");

  // Featured listings are managed from the admin CMS (mark a property as "Featured").
  const { data: featuredProperties = [] } = useQuery({
    queryKey: ["properties", "featured"],
    queryFn: () => fetchProperties({ featured: true }),
  });

  // All active properties — used to show real per-category counts.
  const { data: allProperties = [] } = useQuery({
    queryKey: ["properties", "all"],
    queryFn: () => fetchProperties(),
  });

  // Featured projects come from the CMS too (mark a project as "Featured").
  const { data: featuredProjects = [] } = useQuery({
    queryKey: ["projects", "featured"],
    queryFn: () => fetchProjects({ featured: true }),
  });

  const categoryCards = [
    { title: "Residential", type: "residential", img: "/images/res-1.png", link: "/residential" },
    { title: "Commercial", type: "commercial", img: "/images/com-1.png", link: "/commercial" },
    { title: "Industrial & Warehouse", type: "industrial", img: "/images/ind-1.png", link: "/industrial" },
  ].map((c) => {
    const count = allProperties.filter((p) => p.type === c.type).length;
    return { ...c, count: count === 1 ? "1 Property" : `${count} Properties` };
  });

  const handleSearch = () => {
    if (activeTab === "sell") {
      setLocation("/contact?interest=sell_property");
    } else {
      const queryParams = new URLSearchParams();
      if (searchVal) queryParams.append("search", searchVal);
      queryParams.append("type", activeTab);
      setLocation(`/residential?${queryParams.toString()}`);
    }
  };

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
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-[320px] grid-cols-3 mb-4 bg-muted/20 mx-auto">
                  <TabsTrigger value="buy" className="text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Buy</TabsTrigger>
                  <TabsTrigger value="rent" className="text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Rent</TabsTrigger>
                  <TabsTrigger value="sell" className="text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sell</TabsTrigger>
                </TabsList>
                
                {activeTab === "sell" ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 bg-primary/5 rounded-lg border border-primary/20"
                  >
                    <div className="text-left pl-2">
                      <h4 className="font-serif font-bold text-foreground text-lg">Looking to Sell or Lease Your Property in Pune?</h4>
                      <p className="text-muted-foreground text-sm">List it with Cosmos Real Estate for 100% verified buyers & hassle-free deal closure.</p>
                    </div>
                    <Button asChild className="h-14 px-10 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-md shrink-0">
                      <Link href="/contact?interest=sell_property">List Your Property</Link>
                    </Button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-grow">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                      <Input 
                        placeholder={activeTab === "buy" ? "Enter Locality, Project or Landmark to Buy..." : "Enter Locality, Project or Landmark to Rent..."}
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        className="pl-10 h-14 rounded-md border-border text-base bg-muted/10 focus-visible:ring-primary"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSearch();
                        }}
                      />
                    </div>
                    <Button 
                      onClick={handleSearch}
                      className="h-14 px-10 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-md shrink-0"
                    >
                      <Search className="mr-2" size={20} /> Search
                    </Button>
                  </div>
                )}
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
            {categoryCards.map((cat, i) => (
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

          {featuredProperties.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
              <p className="font-medium">No featured properties yet</p>
              <p className="text-sm mt-1">Featured listings marked in the admin panel will appear here.</p>
            </div>
          ) : (
            <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide">
              {featuredProperties.map((property) => (
                <div key={property.id} className="min-w-[320px] md:min-w-[380px] snap-start shrink-0 bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group cursor-pointer">
                  <div className="relative h-[240px] overflow-hidden">
                    <img
                      src={primaryImage(property)}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-foreground px-3 py-1 text-xs font-bold rounded-md">
                      {property.bhk ? `${property.bhk} BHK ` : ""}{categoryLabel(property.category)}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-2xl font-bold text-primary mb-1">{property.price}</h3>
                    <h4 className="text-lg font-serif font-semibold text-foreground truncate">{property.title}</h4>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2 mb-4">
                      <MapPin size={14} /> {property.location}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm font-medium text-muted-foreground">{areaLabel(property)}</span>
                      <Button asChild size="sm" className="bg-primary text-white hover:bg-primary/90">
                        <Link href="/contact">Contact Agent</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
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
              { image: "/images/why-verified.png", title: "Verified Listings", desc: "100% physically verified properties with clear titles." },
              { image: "/images/why-expert.png", title: "Market Experts", desc: "20+ years of deep knowledge of Pune's real estate trends." },
              { image: "/images/why-cert.png", title: "NAR India Certified", desc: "Life member of NAR India, ensuring highest ethical standards." },
              { image: "/images/why-service.png", title: "End-to-End Service", desc: "From discovery to registration and possession, we handle it all." }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm text-center border border-border/50 hover:border-primary/30 transition-colors flex flex-col items-center"
              >
                <div className="w-24 h-24 mb-6 flex items-center justify-center overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
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
          
          {featuredProjects.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
              <p className="font-medium">No featured projects yet</p>
              <p className="text-sm mt-1">Projects marked as featured in the admin panel will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.slice(0, 3).map((proj) => (
                <div key={proj.id} className="bg-white border rounded-xl overflow-hidden shadow-sm group">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={projectImage(proj)}
                      alt={proj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 left-4 bg-black/80 text-white hover:bg-black/80">{proj.status}</Badge>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-foreground mb-1 line-clamp-1">{proj.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4"><MapPin size={14} className="inline mr-1" />{proj.location}</p>
                    <p className="font-semibold text-primary mb-4">{proj.units || proj.type}</p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/projects/${proj.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
