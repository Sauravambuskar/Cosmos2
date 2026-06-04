import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const images = [
  { id: 1, category: "Residential", src: "/projects/sopan-baug-apartment.jpg", alt: "6.5 BHK Luxury Apartment — Sopan Baug" },
  { id: 2, category: "Commercial", src: "/projects/kalyani-nagar-office.jpg", alt: "Office Spaces — Kalyani Nagar" },
  { id: 3, category: "Commercial", src: "/projects/koregaon-park-commercial.jpeg", alt: "Commercial Showrooms — Koregaon Park" },
  { id: 4, category: "Residential", src: "/projects/kalyani-nagar-bungalow.jpeg", alt: "Luxury Bungalow — Kalyani Nagar" },
  { id: 5, category: "Commercial", src: "/projects/koregaon-park-nx.jpg", alt: "Corporate Offices — Koregaon Park NX" },
  { id: 6, category: "Industrial", src: "/projects/patal-ganga-industrial.jpeg", alt: "5-Acre Industrial Facility — Patal Ganga" },
  { id: 7, category: "Industrial", src: "/projects/hinjawadi-shed.jpg", alt: "20,000 sqft Industrial Shed — Hinjawadi" },
  { id: 8, category: "Residential", src: "/projects/sinhagad-road-land.jpg", alt: "1 Acre Land — Sinhagad Road" },
  { id: 9, category: "Commercial", src: "/projects/kharadi-it-park.jpg", alt: "SEZ IT Park — Kharadi" },
  { id: 10, category: "Commercial", src: "/projects/hinjawadi-sez.jpeg", alt: "SEZ Campus — Hinjawadi Phase 3" },
];

const tabs = ["All", "Residential", "Commercial", "Industrial"];

export default function Gallery() {
  const [filter, setFilter] = useState("All");

  const filteredImages = images.filter(
    (img) => filter === "All" || img.category === filter
  );

  return (
    <div className="w-full pt-28 pb-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">
            Project Showcase
          </span>
          <h1 className="text-5xl font-serif font-bold text-foreground mb-6">
            Visual Gallery
          </h1>
          <p className="text-lg text-muted-foreground">
            Real photographs from our actual portfolio — residential homes, corporate offices, and industrial facilities across Pune and Mumbai.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <Tabs defaultValue="All" onValueChange={setFilter} className="w-full max-w-2xl">
            <TabsList className="grid w-full grid-cols-4 h-14 bg-muted/50 rounded-none p-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-none text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  data-testid={`tab-gallery-${tab.toLowerCase()}`}
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredImages.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="relative overflow-hidden group cursor-pointer aspect-square"
                data-testid={`img-gallery-${img.id}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-secondary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4">
                  <span className="text-white font-serif text-lg tracking-wide text-center leading-snug">
                    {img.alt}
                  </span>
                  <span className="text-primary text-xs font-bold tracking-widest uppercase border border-primary px-3 py-1">
                    {img.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredImages.length === 0 && (
          <div className="text-center py-24 text-muted-foreground text-lg">
            No images in this category.
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-muted-foreground text-sm">
            All images are from actual Cosmos Real Estate listings and projects. Contact us to schedule an in-person viewing.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
