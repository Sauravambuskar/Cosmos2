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
  { id: 1, title: "Premium Office Space in IT Park", location: "Baner, Pune", price: "2.5 L/mo", size: "3500 sqft", type: "Office", image: "/images/com-1.png", status: "Ready" },
  { id: 2, title: "Fully Furnished Co-working", location: "Viman Nagar, Pune", price: "12,000/seat", size: "150 Seats", type: "Co-working", image: "/images/com-2.png", status: "Ready" },
  { id: 3, title: "Ground Floor Retail Shop", location: "FC Road, Pune", price: "12.0 Cr", size: "1800 sqft", type: "Shop", image: "/images/com-3.png", status: "Ready" },
  { id: 4, title: "Boutique Hotel Building", location: "Koregaon Park, Pune", price: "35.0 Cr", size: "12000 sqft", type: "Hotel", image: "/images/com-4.png", status: "Ready" },
  { id: 5, title: "Bare Shell Office Space", location: "Kharadi, Pune", price: "4.5 Cr", size: "4200 sqft", type: "Office", image: "/images/com-1.png", status: "Under Construction" },
  { id: 6, title: "Managed Office Facility", location: "Hinjewadi, Pune", price: "5.5 L/mo", size: "8000 sqft", type: "Managed Office", image: "/images/com-2.png", status: "Ready" },
  { id: 7, title: "Showroom Space in Mall", location: "Camp, Pune", price: "15.0 Cr", size: "3000 sqft", type: "Showroom", image: "/images/com-3.png", status: "Ready" },
  { id: 8, title: "Independent Commercial Bldg", location: "Senapati Bapat Rd", price: "45.0 Cr", size: "20000 sqft", type: "Building", image: "/images/com-4.png", status: "Ready" },
  { id: 9, title: "Plug & Play IT Office", location: "Magarpatta, Pune", price: "3.2 L/mo", size: "4500 sqft", type: "Office", image: "/images/com-1.png", status: "Ready" },
  { id: 10, title: "Retail Shop", location: "Aundh, Pune", price: "3.5 Cr", size: "800 sqft", type: "Shop", image: "/images/com-3.png", status: "Ready" },
  { id: 11, title: "Co-working Private Cabins", location: "Baner, Pune", price: "45,000/mo", size: "10 Seats", type: "Co-working", image: "/images/com-2.png", status: "Ready" },
  { id: 12, title: "Premium Showroom Frontage", location: "Kalyani Nagar, Pune", price: "8.5 Cr", size: "2200 sqft", type: "Showroom", image: "/images/com-1.png", status: "Ready" },
];

export default function Commercial() {
  const [budget, setBudget] = useState([50]);
  
  return (
    <div className="bg-secondary/20 min-h-screen pb-20">
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b pt-4 pb-6">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-foreground font-medium">Commercial Properties in Pune</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Commercial Properties in Pune</h1>
              <p className="text-muted-foreground text-sm mt-1">Showing 12 Commercial Spaces</p>
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

              {/* Commercial Type */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Property Type</h3>
                <div className="space-y-2.5">
                  {["Office Space", "Co-working Space", "Managed Office", "Shop / Showroom", "Hotel / Guest House", "Commercial Building"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={`type-${type}`} />
                      <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-4 text-sm flex justify-between">
                  <span>Budget</span>
                  <span className="text-primary font-bold">₹{budget[0]} L - 50 Cr+</span>
                </h3>
                <Slider
                  defaultValue={[50]}
                  max={5000}
                  step={50}
                  onValueChange={setBudget}
                  className="mb-2"
                />
              </div>

              {/* Area */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Area (sqft)</h3>
                <div className="space-y-2.5">
                  {["Up to 1,000", "1,000 - 5,000", "5,000 - 10,000", "10,000+"].map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox id={`area-${area}`} />
                      <Label htmlFor={`area-${area}`} className="text-sm font-normal cursor-pointer">{area}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Localities */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Key Commercial Hubs</h3>
                <div className="space-y-2.5">
                  {["Hinjewadi", "Kharadi", "Baner", "Viman Nagar", "Magarpatta", "SB Road"].map((loc) => (
                    <div key={loc} className="flex items-center space-x-2">
                      <Checkbox id={`loc-${loc}`} />
                      <Label htmlFor={`loc-${loc}`} className="text-sm font-normal cursor-pointer">{loc}</Label>
                    </div>
                  ))}
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
                        <p className="text-xs text-muted-foreground">Size / Area</p>
                        <p className="font-semibold text-sm">{property.size}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="font-semibold text-sm">{property.status}</p>
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
