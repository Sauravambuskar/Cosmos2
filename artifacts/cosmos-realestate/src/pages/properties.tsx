import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Home as HomeIcon, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const properties = [
  { id: 1, title: "Trump Towers", location: "Kalyani Nagar", price: "12.5 Cr", type: "Buy", config: "4.5 BHK", area: "4500 sqft", image: "/images/prop-1.png" },
  { id: 2, title: "Panchshil Towers", location: "Kharadi", price: "9.8 Cr", type: "Buy", config: "4 BHK", area: "3800 sqft", image: "/images/prop-2.png" },
  { id: 3, title: "Premium Retail Space", location: "Koregaon Park", price: "4.5 L/mo", type: "Commercial", config: "Retail", area: "2000 sqft", image: "/images/prop-3.png" },
  { id: 4, title: "Marvel Zephyr", location: "Kharadi", price: "6.5 Cr", type: "Buy", config: "3 BHK", area: "2500 sqft", image: "/images/prop-4.png" },
  { id: 5, title: "Yoo Pune", location: "Wagholi", price: "15.0 Cr", type: "Buy", config: "5 BHK", area: "5500 sqft", image: "/images/prop-5.png" },
  { id: 6, title: "Lodha Belmondo", location: "Pune", price: "4.2 Cr", type: "Buy", config: "3 BHK", area: "2200 sqft", image: "/images/prop-6.png" },
  { id: 7, title: "Godrej Elements", location: "Hinjewadi", price: "2.8 Cr", type: "Buy", config: "2 BHK", area: "1200 sqft", image: "/images/prop-1.png" },
  { id: 8, title: "Amar Business Park", location: "Baner", price: "1.2 L/mo", type: "Commercial", config: "Office", area: "1500 sqft", image: "/images/prop-2.png" },
  { id: 9, title: "Rohan Leher", location: "Baner", price: "85 L", type: "Rent", config: "3 BHK", area: "1800 sqft", image: "/images/prop-3.png" },
  { id: 10, title: "Kalpataru Estate", location: "Pimple Gurav", price: "3.5 Cr", type: "Buy", config: "3 BHK", area: "2000 sqft", image: "/images/prop-4.png" },
  { id: 11, title: "Gera Song of Joy", location: "Kharadi", price: "60 L/yr", type: "Rent", config: "4 BHK", area: "3200 sqft", image: "/images/prop-5.png" },
  { id: 12, title: "WTC Pune Office", location: "Kharadi", price: "8.5 Cr", type: "Commercial", config: "Office", area: "4000 sqft", image: "/images/prop-6.png" },
];

export default function Properties() {
  const [filter, setFilter] = useState("All");

  const filteredProperties = properties.filter((p) => filter === "All" || p.type === filter);

  return (
    <div className="w-full pt-28 pb-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-serif font-bold text-foreground mb-6">Exclusive Properties</h1>
          <p className="text-lg text-muted-foreground">
            Explore our curated portfolio of Pune's finest residential and commercial real estate.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <Tabs defaultValue="All" onValueChange={setFilter} className="w-full max-w-2xl">
            <TabsList className="grid w-full grid-cols-4 h-14 bg-muted/50 rounded-none p-1">
              {["All", "Buy", "Rent", "Commercial"].map((tab) => (
                <TabsTrigger 
                  key={tab} 
                  value={tab}
                  className="rounded-none text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-card border border-border group"
            >
              <div className="relative h-[250px] overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/800x600/f1f5f9/64748b?text=${encodeURIComponent(property.title)}`;
                  }}
                />
                <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 text-xs font-bold tracking-wider uppercase">
                  {property.type}
                </div>
                <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 text-lg font-bold shadow-lg">
                  ₹ {property.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-serif font-bold mb-2">{property.title}</h3>
                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                  <MapPin size={16} className="text-primary" />
                  <span>{property.location}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6 border-y border-border py-4">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <HomeIcon size={16} className="text-muted-foreground" />
                    <span className="font-medium">{property.config}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Maximize size={16} className="text-muted-foreground" />
                    <span className="font-medium">{property.area}</span>
                  </div>
                </div>

                <Button className="w-full rounded-none group-hover:bg-secondary group-hover:text-white transition-colors">
                  Request Viewing
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-24 text-muted-foreground text-lg">
            No properties found for this category at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
