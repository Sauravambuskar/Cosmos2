import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Maximize, Building2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const properties = [
  {
    id: 1,
    title: "Luxury 6.5 BHK Apartment",
    location: "Sopan Baug, Pune",
    price: "6.10 Cr",
    type: "Buy",
    config: "6.5 BHK",
    area: "4,130 sqft",
    image: "/projects/sopan-baug-apartment.jpg",
    tag: "Residential",
  },
  {
    id: 2,
    title: "Corporate Office Space",
    location: "Kalyani Nagar, Pune",
    price: "On Request",
    type: "Commercial",
    config: "Office",
    area: "704 sqft onwards",
    image: "/projects/kalyani-nagar-office.jpg",
    tag: "Commercial",
  },
  {
    id: 3,
    title: "Premium Office & Showrooms",
    location: "Koregaon Park, Pune",
    price: "On Request",
    type: "Commercial",
    config: "Commercial",
    area: "384–4,115 sqft",
    image: "/projects/koregaon-park-commercial.jpeg",
    tag: "Commercial",
  },
  {
    id: 4,
    title: "Luxury Bungalow for Rent",
    location: "Kalyani Nagar, Pune",
    price: "On Request",
    type: "Rent",
    config: "4.5 BHK",
    area: "3,500 sqft",
    image: "/projects/kalyani-nagar-bungalow.jpeg",
    tag: "Residential",
  },
  {
    id: 5,
    title: "1 Acre Plot with Bungalow Rights",
    location: "Sinhagad Road, Pune",
    price: "6.5 Cr",
    type: "Buy",
    config: "Land + Bungalow",
    area: "1 Acre (~43,560 sqft)",
    image: "/projects/sinhagad-road-land.jpg",
    tag: "Land",
  },
  {
    id: 6,
    title: "Co-working & Corporate Offices",
    location: "Koregaon Park NX, Pune",
    price: "On Request",
    type: "Commercial",
    config: "Bare Shell / Fitted",
    area: "Flexible",
    image: "/projects/koregaon-park-nx.jpg",
    tag: "Commercial",
  },
  {
    id: 7,
    title: "Industrial Shed for Rent",
    location: "Hinjawadi, Pune",
    price: "3,90,000/mo",
    type: "Rent",
    config: "Industrial",
    area: "20,000 sqft",
    image: "/projects/hinjawadi-shed.jpg",
    tag: "Industrial",
  },
  {
    id: 8,
    title: "SEZ IT Park Office Space",
    location: "Kharadi, Pune",
    price: "On Request",
    type: "Commercial",
    config: "IT / ITES / BFSI",
    area: "2.5 M sqft (total complex)",
    image: "/projects/kharadi-it-park.jpg",
    tag: "Commercial",
  },
  {
    id: 9,
    title: "5-Acre Industrial Facility",
    location: "Patal Ganga, Navi Mumbai",
    price: "On Request",
    type: "Rent",
    config: "Industrial",
    area: "1,25,000 sqft",
    image: "/projects/patal-ganga-industrial.jpeg",
    tag: "Industrial",
  },
  {
    id: 10,
    title: "SEZ Campus — IT & Software",
    location: "Hinjawadi Phase 3, Pune",
    price: "On Request",
    type: "Commercial",
    config: "Office / SEZ",
    area: "13 Acres | 1.8 M sqft",
    image: "/projects/hinjawadi-sez.jpeg",
    tag: "Commercial",
  },
];

const tabs = ["All", "Buy", "Rent", "Commercial"];

export default function Properties() {
  const [filter, setFilter] = useState("All");

  const filteredProperties = properties.filter(
    (p) => filter === "All" || p.type === filter
  );

  return (
    <div className="w-full pt-28 pb-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">
            Available Now
          </span>
          <h1 className="text-5xl font-serif font-bold text-foreground mb-6">
            Exclusive Listings
          </h1>
          <p className="text-lg text-muted-foreground">
            Handpicked residential, commercial and industrial properties across Pune — curated by Cosmos Real Estate.
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
                  data-testid={`tab-filter-${tab.toLowerCase()}`}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="bg-card border border-border group flex flex-col"
                data-testid={`card-property-${property.id}`}
              >
                <div className="relative h-[240px] overflow-hidden flex-shrink-0">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                    <span className="bg-secondary text-white px-3 py-1 text-xs font-bold tracking-wider uppercase">
                      {property.type}
                    </span>
                    <span className="bg-black/50 text-white px-3 py-1 text-xs font-medium uppercase backdrop-blur-sm">
                      {property.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 text-sm font-bold shadow-lg">
                    ₹ {property.price}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-serif font-bold mb-2 leading-snug">{property.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mb-5">
                    <MapPin size={15} className="text-primary flex-shrink-0" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 border-y border-border py-4 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Building2 size={15} className="text-muted-foreground flex-shrink-0" />
                      <span className="font-medium truncate">{property.config}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Maximize size={15} className="text-muted-foreground flex-shrink-0" />
                      <span className="font-medium truncate">{property.area}</span>
                    </div>
                  </div>

                  <a href="https://wa.me/919325097835" target="_blank" rel="noopener noreferrer">
                    <Button
                      className="w-full rounded-none group-hover:bg-secondary group-hover:text-white transition-colors"
                      data-testid={`button-viewing-${property.id}`}
                    >
                      <Phone size={15} className="mr-2" />
                      Request Viewing
                    </Button>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProperties.length === 0 && (
          <div className="text-center py-24 text-muted-foreground text-lg">
            No listings found for this category. Please contact us directly.
          </div>
        )}
      </div>
    </div>
  );
}
