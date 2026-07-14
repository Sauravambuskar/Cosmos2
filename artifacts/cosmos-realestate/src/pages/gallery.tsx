import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const images = [
  { id: 1, category: "Residential", src: "/images/hero-bg.png", alt: "Luxury Living Room" },
  { id: 2, category: "Commercial", src: "/images/prop-2.png", alt: "Modern Office" },
  { id: 3, category: "Interiors", src: "/images/prop-4.png", alt: "Premium Kitchen" },
  { id: 4, category: "Residential", src: "/images/prop-1.png", alt: "Villa Exterior" },
  { id: 5, category: "Commercial", src: "/images/proj-2.png", alt: "Commercial Building" },
  { id: 6, category: "Interiors", src: "/images/prop-3.png", alt: "Luxury Bedroom" },
  { id: 7, category: "Residential", src: "/images/prop-5.png", alt: "Balcony View" },
  { id: 8, category: "Commercial", src: "/images/proj-1.png", alt: "Residential Tower" },
  { id: 9, category: "Interiors", src: "/images/prop-6.png", alt: "Lobby Interior" },
  { id: 10, category: "Residential", src: "/images/proj-3.png", alt: "Gated Community" },
  { id: 11, category: "Commercial", src: "/images/about-bg.png", alt: "Pune Skyline" },
  { id: 12, category: "Residential", src: "/images/proj-4.png", alt: "High-rise Apartments" },
];

export default function Gallery() {
  const [filter, setFilter] = useState("All");

  const filteredImages = images.filter(img => filter === "All" || img.category === filter);

  return (
    <div className="w-full pt-28 pb-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-serif font-bold text-foreground mb-6">Visual Gallery</h1>
          <p className="text-lg text-muted-foreground">
            A glimpse into the luxury lifestyle and premium spaces we offer.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <Tabs defaultValue="All" onValueChange={setFilter} className="w-full max-w-2xl">
            <TabsList className="grid w-full grid-cols-4 h-14 bg-muted/50 rounded-none p-1">
              {["All", "Residential", "Commercial", "Interiors"].map((tab) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="aspect-square relative overflow-hidden group cursor-pointer"
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/800x800/f1f5f9/64748b?text=${encodeURIComponent(img.alt)}`;
                }}
              />
              <div className="absolute inset-0 bg-secondary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-serif text-xl tracking-wider">{img.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
