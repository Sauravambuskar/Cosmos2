import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, MapPin, SlidersHorizontal, Heart, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const properties = [
  { id: 1, title: "4 BHK Luxury Flat in Trump Towers", location: "Kalyani Nagar, Pune", price: "12.5 Cr", size: "4500 sqft", type: "Flat", bhk: 4, image: "/images/res-1.png", ready: true },
  { id: 2, title: "Premium Independent Bungalow", location: "Koregaon Park, Pune", price: "18.0 Cr", size: "6500 sqft", type: "Bungalow", bhk: 5, image: "/images/res-2.png", ready: true },
  { id: 3, title: "3 BHK Row House", location: "Baner, Pune", price: "4.2 Cr", size: "2800 sqft", type: "Row House", bhk: 3, image: "/images/res-3.png", ready: true },
  { id: 4, title: "Modern 3 BHK Apartment", location: "Viman Nagar, Pune", price: "2.8 Cr", size: "1850 sqft", type: "Flat", bhk: 3, image: "/images/res-4.png", ready: true },
  { id: 5, title: "Luxury Penthouse with Pool", location: "Aundh, Pune", price: "8.5 Cr", size: "5200 sqft", type: "Duplex", bhk: 4, image: "/images/res-5.png", ready: false },
  { id: 6, title: "Gated Community Villa", location: "Wakad, Pune", price: "6.0 Cr", size: "4000 sqft", type: "Bungalow", bhk: 4, image: "/images/res-6.png", ready: true },
  { id: 7, title: "2 BHK Premium Flat", location: "Kharadi, Pune", price: "1.4 Cr", size: "1200 sqft", type: "Flat", bhk: 2, image: "/images/prop-1.png", ready: false },
  { id: 8, title: "3 BHK Golf Course Facing", location: "Pune West", price: "3.5 Cr", size: "2200 sqft", type: "Flat", bhk: 3, image: "/images/prop-2.png", ready: true },
  { id: 9, title: "4 BHK Garden Duplex", location: "Baner, Pune", price: "5.5 Cr", size: "3200 sqft", type: "Duplex", bhk: 4, image: "/images/prop-3.png", ready: true },
  { id: 10, title: "Twin Bungalow in Society", location: "Bavdhan, Pune", price: "4.8 Cr", size: "3000 sqft", type: "Bungalow", bhk: 3, image: "/images/prop-4.png", ready: true },
  { id: 11, title: "Spacious 4 BHK Apartment", location: "Magarpatta, Pune", price: "3.2 Cr", size: "2600 sqft", type: "Flat", bhk: 4, image: "/images/prop-5.png", ready: false },
  { id: 12, title: "River View 3 BHK", location: "Kalyani Nagar, Pune", price: "4.5 Cr", size: "2400 sqft", type: "Flat", bhk: 3, image: "/images/prop-6.png", ready: true },
];

export default function Residential() {
  const [budget, setBudget] = useState([50]);
  
  return (
    <div className="bg-secondary/20 min-h-screen pb-20">
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b pt-4 pb-6">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-foreground font-medium">Residential Properties in Pune</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Residential Properties for Sale in Pune</h1>
              <p className="text-muted-foreground text-sm mt-1">Showing 12 Properties in Pune</p>
            </div>
            <Tabs defaultValue="buy" className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="rent">Rent</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar Filter */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="bg-white border rounded-lg p-5 sticky top-24 shadow-sm">
              <div className="flex items-center gap-2 font-serif font-bold text-lg mb-6 pb-4 border-b">
                <SlidersHorizontal size={18} /> Filters
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Property Type</h3>
                <div className="space-y-2.5">
                  {["Flat / Apartment", "Independent Bungalow", "Row House", "Duplex"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={`type-${type}`} />
                      <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* BHK */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">BHK</h3>
                <div className="flex flex-wrap gap-2">
                  {["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"].map((bhk) => (
                    <Badge key={bhk} variant="outline" className="rounded-full px-3 py-1 cursor-pointer hover:bg-primary hover:text-white transition-colors">
                      {bhk}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-4 text-sm flex justify-between">
                  <span>Budget</span>
                  <span className="text-primary font-bold">₹{budget[0]} L - 15 Cr+</span>
                </h3>
                <Slider
                  defaultValue={[50]}
                  max={1500}
                  step={10}
                  onValueChange={setBudget}
                  className="mb-2"
                />
              </div>

              {/* Localities */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Locality</h3>
                <div className="space-y-2.5">
                  {["Koregaon Park", "Kalyani Nagar", "Baner", "Viman Nagar", "Kharadi", "Aundh"].map((loc) => (
                    <div key={loc} className="flex items-center space-x-2">
                      <Checkbox id={`loc-${loc}`} />
                      <Label htmlFor={`loc-${loc}`} className="text-sm font-normal cursor-pointer">{loc}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Status */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Possession Status</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="status-ready" />
                    <Label htmlFor="status-ready" className="text-sm font-normal cursor-pointer">Ready to Move</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="status-under" />
                    <Label htmlFor="status-under" className="text-sm font-normal cursor-pointer">Under Construction</Label>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white">Apply Filters</Button>
            </div>
          </aside>

          {/* Right Property Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  <div className="relative h-[220px] overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <Badge className="bg-white/90 text-foreground hover:bg-white/90 font-bold backdrop-blur-sm shadow-sm">
                        {property.type}
                      </Badge>
                      {property.ready && (
                        <Badge className="bg-green-600/90 text-white hover:bg-green-600/90 backdrop-blur-sm shadow-sm text-[10px]">
                          Ready to Move
                        </Badge>
                      )}
                    </div>
                    <button className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-sm transition-colors">
                      <Heart size={18} />
                    </button>
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-2xl font-bold text-white">{property.price}</h3>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="text-base font-serif font-bold text-foreground leading-tight mb-2 line-clamp-1">{property.title}</h4>
                    <p className="text-muted-foreground text-sm flex items-center gap-1 mb-4">
                      <MapPin size={14} className="shrink-0" /> <span className="truncate">{property.location}</span>
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-5 bg-secondary/50 p-3 rounded-md">
                      <div>
                        <p className="text-xs text-muted-foreground">Area</p>
                        <p className="font-semibold text-sm">{property.size}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">BHK</p>
                        <p className="font-semibold text-sm">{property.bhk} BHK</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 text-primary border-primary hover:bg-primary hover:text-white h-10">
                        View Details
                      </Button>
                      <Button className="flex-1 bg-primary hover:bg-primary/90 text-white h-10">
                        <PhoneCall size={16} className="mr-2" /> Contact
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12 mb-8">
              <div className="flex items-center gap-2">
                <Button variant="outline" disabled>Previous</Button>
                <Button className="bg-primary text-white hover:bg-primary/90">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <span className="px-2 text-muted-foreground">...</span>
                <Button variant="outline">Next</Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
