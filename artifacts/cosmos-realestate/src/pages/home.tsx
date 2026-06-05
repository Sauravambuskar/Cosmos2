import { motion } from "framer-motion";
import { Link } from "wouter";
import { Search, MapPin, Building, Star, ArrowRight, ShieldCheck, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const stats = [
  { value: "500+", label: "Properties" },
  { value: "20+", label: "Years Experience" },
  { value: "1000+", label: "Happy Clients" },
  { value: "50+", label: "Awards" },
];

const featuredProperties = [
  { id: 1, title: "Trump Towers Pune", location: "Kalyani Nagar", price: "12.5 Cr", type: "4.5 BHK", image: "/images/prop-1.png" },
  { id: 2, title: "Panchshil Towers", location: "Kharadi", price: "9.8 Cr", type: "4 BHK", image: "/images/prop-2.png" },
  { id: 3, title: "Marvel Zephyr", location: "Kharadi", price: "6.5 Cr", type: "3 BHK", image: "/images/prop-3.png" },
  { id: 4, title: "Yoo Pune", location: "Wagholi", price: "15.0 Cr", type: "5 BHK", image: "/images/prop-4.png" },
  { id: 5, title: "Lodha Belmondo", location: "Pune", price: "4.2 Cr", type: "3 BHK", image: "/images/prop-5.png" },
  { id: 6, title: "Godrej Elements", location: "Hinjewadi", price: "2.8 Cr", type: "2 BHK", image: "/images/prop-6.png" },
];

const testimonials = [
  { id: 1, name: "Rahul Deshmukh", role: "NRI Investor", text: "Cosmos made investing in Pune real estate seamless. Jatin's expertise and transparency are unmatched." },
  { id: 2, name: "Sneha Patil", role: "Homeowner", text: "Finding our dream home in Koregaon Park was a breeze with Cosmos. They understood exactly what we wanted." },
  { id: 3, name: "Vikram Sharma", role: "Business Owner", text: "The commercial leasing team is exceptional. They found the perfect office space for our growing startup." },
];

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-secondary/40 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('/images/hero-bg.png')" }} 
        />
        
        <div className="container relative z-20 mx-auto px-4 md:px-8 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-bold leading-tight mb-6 drop-shadow-lg">
              Find Your Place in the <span className="text-primary italic">Cosmos</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 font-light tracking-wide drop-shadow-md">
              Pune's premier real estate consultancy. Delivering bespoke luxury homes and premium commercial spaces.
            </p>

            <div className="bg-background/95 backdrop-blur-md p-6 rounded-lg shadow-2xl max-w-3xl mx-auto">
              <Tabs defaultValue="buy" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 rounded-none h-14">
                  <TabsTrigger value="buy" className="text-base rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Buy</TabsTrigger>
                  <TabsTrigger value="rent" className="text-base rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Rent</TabsTrigger>
                  <TabsTrigger value="commercial" className="text-base rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Commercial</TabsTrigger>
                </TabsList>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input 
                      placeholder="Location, Landmark, or Project" 
                      className="pl-10 h-12 rounded-none border-border"
                    />
                  </div>
                  <Button className="h-12 px-8 rounded-none text-base">
                    <Search className="mr-2" size={20} /> Search
                  </Button>
                </div>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-serif text-primary font-bold mb-2">{stat.value}</div>
                <div className="text-white/70 text-sm tracking-widest uppercase font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-primary font-medium tracking-widest uppercase text-sm mb-2 block">Curated Selection</span>
              <h2 className="text-4xl font-serif font-bold text-foreground">Featured Properties</h2>
            </div>
            <Link href="/properties" className="text-primary hover:text-secondary transition-colors font-medium flex items-center gap-2 mt-4 md:mt-0">
              View All Properties <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative h-[300px] overflow-hidden mb-4 rounded-sm">
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/800x600/f1f5f9/64748b?text=${encodeURIComponent(property.title)}`;
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">
                    {property.price}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold group-hover:text-primary transition-colors">{property.title}</h3>
                  <div className="flex items-center gap-4 text-muted-foreground mt-2 text-sm">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {property.location}</span>
                    <span className="flex items-center gap-1"><HomeIcon size={14} /> {property.type}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-medium tracking-widest uppercase text-sm mb-2 block">Our Advantage</span>
            <h2 className="text-4xl font-serif font-bold text-foreground mb-6">Why Cosmos Real Estate</h2>
            <p className="text-muted-foreground text-lg">We don't just sell properties; we build lifelong relationships based on trust, transparency, and market expertise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: ShieldCheck, title: "Trusted Advisors", desc: "NAR India Life Member and FMP certified. Ethics and integrity are at our core." },
              { icon: Building, title: "Premium Portfolio", desc: "Access to Pune's most exclusive luxury and commercial properties before they hit the market." },
              { icon: Star, title: "Bespoke Service", desc: "Personalized end-to-end assistance from property selection to legal documentation." }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 border border-border/50 bg-muted/10 hover:border-primary/50 transition-colors"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-serif font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-secondary text-secondary-foreground text-center">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-serif font-bold mb-12 text-white">Client Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 p-8 border border-white/10"
              >
                <div className="text-primary mb-6 flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-lg font-serif italic text-white/90 mb-6">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-primary text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ready to find your dream property?</h2>
          <p className="text-xl mb-10 opacity-90">Let our experts guide you through Pune's premium real estate market.</p>
          <Button asChild size="lg" variant="secondary" className="rounded-none px-10 h-14 text-lg">
            <Link href="/contact">Schedule a Consultation</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
