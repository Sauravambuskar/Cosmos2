import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, MapPin, SlidersHorizontal, Heart, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const properties = [
  { id: 1, title: "Grade A Logistics Warehouse", location: "Chakan, Pune", price: "8.5 L/mo", size: "40,000 sqft", type: "Warehouse", image: "/images/ind-1.png", status: "Available" },
  { id: 2, title: "Industrial Factory Shed", location: "Ranjangaon, Pune", price: "2.5 Cr", size: "15,000 sqft", type: "Factory/Shed", image: "/images/ind-2.png", status: "Available" },
  { id: 3, title: "Cold Storage Facility", location: "Talegaon, Pune", price: "12.0 Cr", size: "25,000 sqft", type: "Cold Storage", image: "/images/ind-3.png", status: "Available" },
  { id: 4, title: "NA Industrial Plot", location: "Bhosari, Pune", price: "5.5 Cr", size: "2 Acres", type: "Industrial Plot", image: "/images/ind-4.png", status: "Available" },
  { id: 5, title: "E-commerce Fulfilment Center", location: "Chakan, Pune", price: "15.0 L/mo", size: "80,000 sqft", type: "Warehouse", image: "/images/ind-1.png", status: "Available" },
  { id: 6, title: "Manufacturing Unit Setup", location: "Sanaswadi, Pune", price: "18.5 Cr", size: "45,000 sqft", type: "Factory/Shed", image: "/images/ind-2.png", status: "Under Construction" },
  { id: 7, title: "Food Processing Unit", location: "Shirwal, Pune", price: "4.2 L/mo", size: "20,000 sqft", type: "Cold Storage", image: "/images/ind-3.png", status: "Available" },
  { id: 8, title: "MIDC Allotted Land", location: "Baramati, Pune", price: "8.0 Cr", size: "5 Acres", type: "Industrial Plot", image: "/images/ind-4.png", status: "Available" },
];

export default function Industrial() {
  return (
    <div className="bg-secondary/20 min-h-screen pb-20">
      <div className="bg-white border-b pt-4 pb-6">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-foreground font-medium">Industrial & Warehouse</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Industrial & Warehousing</h1>
              <p className="text-muted-foreground text-sm mt-1">Showing 8 Industrial Properties in Pune</p>
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

              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Property Type</h3>
                <div className="space-y-2.5">
                  {["Warehouse", "Factory / Shed", "Industrial Plot", "Cold Storage", "Built-to-Suit"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={`type-${type}`} />
                      <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Industrial Hubs</h3>
                <div className="space-y-2.5">
                  {["Chakan MIDC", "Ranjangaon", "Bhosari", "Talegaon", "Sanaswadi", "Baramati"].map((loc) => (
                    <div key={loc} className="flex items-center space-x-2">
                      <Checkbox id={`loc-${loc}`} />
                      <Label htmlFor={`loc-${loc}`} className="text-sm font-normal cursor-pointer">{loc}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Area</h3>
                <div className="space-y-2.5">
                  {["Up to 10,000 sqft", "10,000 - 50,000 sqft", "50,000 - 1 Lakh sqft", "1 Lakh+ sqft", "Plots in Acres"].map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox id={`area-${area}`} />
                      <Label htmlFor={`area-${area}`} className="text-sm font-normal cursor-pointer">{area}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white">Apply Filters</Button>
            </div>
          </aside>

          {/* Right Property Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col sm:flex-row">
                  <div className="relative h-[240px] sm:h-auto sm:w-[220px] shrink-0 overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 bg-white/90 text-foreground hover:bg-white/90 font-bold backdrop-blur-sm shadow-sm">
                      {property.type}
                    </Badge>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <h4 className="text-xl font-serif font-bold text-foreground leading-tight mb-2">{property.title}</h4>
                    <p className="text-muted-foreground text-sm flex items-center gap-1 mb-4">
                      <MapPin size={14} className="shrink-0" /> <span className="truncate">{property.location}</span>
                    </p>
                    
                    <div className="bg-secondary/50 p-3 rounded-md mb-auto">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-bold text-lg text-primary">{property.price}</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-sm text-muted-foreground">Area</span>
                        <span className="font-semibold text-sm">{property.size}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button variant="outline" className="flex-1 text-primary border-primary hover:bg-primary hover:text-white h-10 text-sm">
                        View Details
                      </Button>
                      <Button className="flex-1 bg-primary hover:bg-primary/90 text-white h-10 text-sm">
                        <PhoneCall size={16} className="mr-2" /> Contact
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
