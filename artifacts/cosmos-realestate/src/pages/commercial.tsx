import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, MapPin, SlidersHorizontal, Heart, PhoneCall, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { fetchProperties, primaryImage, areaLabel, categoryLabel } from "@/lib/api";
import type { Property } from "@/lib/types";
import Seo from "@/components/seo";
import { PAGE_SEO, breadcrumbSchema } from "@/lib/seo";

const TYPE_OPTIONS = ["office", "co-working", "managed-office", "shop", "showroom", "hotel"];
const HUBS = ["Hinjewadi", "Kharadi", "Baner", "Viman Nagar", "Magarpatta", "SB Road"];
const AREA_BUCKETS = [
  { label: "Up to 1,000", min: 0, max: 1000 },
  { label: "1,000 - 5,000", min: 1000, max: 5000 },
  { label: "5,000 - 10,000", min: 5000, max: 10000 },
  { label: "10,000+", min: 10000, max: Infinity },
];

export default function Commercial() {
  const [budget, setBudget] = useState([5000]);
  const [transaction, setTransaction] = useState<"buy" | "rent">("buy");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedHubs, setSelectedHubs] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState(0);

  const { data: properties = [], isLoading, isError } = useQuery({
    queryKey: ["properties", "commercial", transaction],
    queryFn: () => fetchProperties({ type: "commercial", transactionType: transaction }),
  });

  function toggle<T>(list: T[], value: T, setter: (v: T[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const filtered = useMemo(() => {
    void appliedFilters;
    return properties.filter((p) => {
      if (selectedTypes.length && !selectedTypes.includes(p.category)) return false;
      if (selectedHubs.length && !selectedHubs.some((l) => p.location.toLowerCase().includes(l.toLowerCase()))) return false;
      if (selectedAreas.length) {
        const buckets = AREA_BUCKETS.filter((b) => selectedAreas.includes(b.label));
        if (!buckets.some((b) => p.area >= b.min && p.area < b.max)) return false;
      }
      if (p.priceValue > budget[0]) return false;
      return true;
    });
  }, [properties, selectedTypes, selectedHubs, selectedAreas, budget, appliedFilters]);

  return (
    <div className="bg-secondary/20 min-h-screen pb-20">
      <Seo
        {...PAGE_SEO.commercial}
        schemas={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Commercial Property in Pune", path: "/commercial" },
          ]),
        ]}
      />

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
              <p className="text-muted-foreground text-sm mt-1">
                {isLoading ? "Loading spaces…" : `Showing ${filtered.length} Commercial ${filtered.length === 1 ? "Space" : "Spaces"}`}
              </p>
            </div>
            <Tabs value={transaction} onValueChange={(v) => setTransaction(v as "buy" | "rent")} className="w-[200px]">
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
                  {TYPE_OPTIONS.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={`type-${type}`} checked={selectedTypes.includes(type)} onCheckedChange={() => toggle(selectedTypes, type, setSelectedTypes)} />
                      <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">{categoryLabel(type)}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-4 text-sm flex justify-between">
                  <span>Max Budget</span>
                  <span className="text-primary font-bold">₹{budget[0]} L</span>
                </h3>
                <Slider
                  value={budget}
                  max={10000}
                  step={50}
                  onValueChange={setBudget}
                  className="mb-2"
                />
              </div>

              {/* Area */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Area (sqft)</h3>
                <div className="space-y-2.5">
                  {AREA_BUCKETS.map((area) => (
                    <div key={area.label} className="flex items-center space-x-2">
                      <Checkbox id={`area-${area.label}`} checked={selectedAreas.includes(area.label)} onCheckedChange={() => toggle(selectedAreas, area.label, setSelectedAreas)} />
                      <Label htmlFor={`area-${area.label}`} className="text-sm font-normal cursor-pointer">{area.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Localities */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Key Commercial Hubs</h3>
                <div className="space-y-2.5">
                  {HUBS.map((loc) => (
                    <div key={loc} className="flex items-center space-x-2">
                      <Checkbox id={`loc-${loc}`} checked={selectedHubs.includes(loc)} onCheckedChange={() => toggle(selectedHubs, loc, setSelectedHubs)} />
                      <Label htmlFor={`loc-${loc}`} className="text-sm font-normal cursor-pointer">{loc}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-white"
                onClick={() => setAppliedFilters((n) => n + 1)}
              >
                Apply Filters
              </Button>
            </div>
          </aside>

          {/* Right Property Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : isError ? (
              <div className="text-center py-20 text-muted-foreground">
                <Building2 size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">Couldn't load properties</p>
                <p className="text-sm mt-1">Please try again in a moment.</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Building2 size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No commercial spaces match your filters</p>
                <p className="text-sm mt-1">Try widening your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((property) => (
                  <CommercialCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CommercialCard({ property }: { property: Property }) {
  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <div className="relative h-[220px] overflow-hidden">
        <img
          src={primaryImage(property)}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <Badge className="bg-white/90 text-foreground hover:bg-white/90 font-bold backdrop-blur-sm shadow-sm">
            {categoryLabel(property.category)}
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
            <p className="font-semibold text-sm">{areaLabel(property)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="font-semibold text-sm capitalize">{property.status === "active" ? "Available" : property.status}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 text-primary border-primary hover:bg-primary hover:text-white h-10">
            View Details
          </Button>
          <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-white h-10">
            <Link href="/contact?interest=buy_commercial"><PhoneCall size={16} className="mr-2" /> Contact</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
