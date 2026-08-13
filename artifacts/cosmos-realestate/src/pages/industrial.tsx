import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, MapPin, SlidersHorizontal, PhoneCall, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { fetchProperties, primaryImage, areaLabel, categoryLabel } from "@/lib/api";
import { matchesPropertyQuery } from "@/lib/search";
import { useListingFilters } from "@/hooks/use-listing-filters";
import ListingSearch from "@/components/listing-search";
import type { Property } from "@/lib/types";
import Seo from "@/components/seo";
import { PAGE_SEO, breadcrumbSchema } from "@/lib/seo";

const TYPE_OPTIONS = ["warehouse", "factory", "industrial-plot", "cold-storage"];
const HUBS = ["Chakan", "Ranjangaon", "Bhosari", "Talegaon", "Sanaswadi", "Baramati"];

export default function Industrial() {
  const { query, setQuery, transaction, setTransaction, urlCategories } = useListingFilters();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(urlCategories);
  const [selectedHubs, setSelectedHubs] = useState<string[]>([]);

  // Follow category links from the nav / home page after the page is mounted.
  useEffect(() => {
    setSelectedTypes(urlCategories);
  }, [urlCategories]);

  const { data: properties = [], isLoading, isError } = useQuery({
    queryKey: ["properties", "industrial", transaction],
    queryFn: () => fetchProperties({ type: "industrial", transactionType: transaction }),
  });

  function toggle<T>(list: T[], value: T, setter: (v: T[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (!matchesPropertyQuery(p, query)) return false;
      if (selectedTypes.length && !selectedTypes.includes(p.category)) return false;
      if (selectedHubs.length && !selectedHubs.some((l) => p.location.toLowerCase().includes(l.toLowerCase()))) return false;
      return true;
    });
  }, [properties, query, selectedTypes, selectedHubs]);

  const hasFilters = query !== "" || selectedTypes.length > 0 || selectedHubs.length > 0;

  function clearAll() {
    setQuery("");
    setSelectedTypes([]);
    setSelectedHubs([]);
  }

  return (
    <div className="bg-secondary/20 min-h-screen pb-20">
      <Seo
        {...PAGE_SEO.industrial}
        schemas={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Industrial & Warehousing", path: "/industrial" },
          ]),
        ]}
      />

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
              <p className="text-muted-foreground text-sm mt-1">
                {isLoading
                  ? "Loading properties…"
                  : `Showing ${filtered.length} Industrial ${filtered.length === 1 ? "Property" : "Properties"}${query ? ` for "${query}"` : ""} in Pune`}
              </p>
            </div>
            <Tabs value={transaction} onValueChange={(v) => setTransaction(v as "buy" | "rent")} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="rent">Rent</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ListingSearch
            value={query}
            onChange={setQuery}
            placeholder="Search warehouses, factories, industrial hubs…"
            className="mt-5 max-w-xl"
          />
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
                  {TYPE_OPTIONS.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={`type-${type}`} checked={selectedTypes.includes(type)} onCheckedChange={() => toggle(selectedTypes, type, setSelectedTypes)} />
                      <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">{categoryLabel(type)}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Industrial Hubs</h3>
                <div className="space-y-2.5">
                  {HUBS.map((loc) => (
                    <div key={loc} className="flex items-center space-x-2">
                      <Checkbox id={`loc-${loc}`} checked={selectedHubs.includes(loc)} onCheckedChange={() => toggle(selectedHubs, loc, setSelectedHubs)} />
                      <Label htmlFor={`loc-${loc}`} className="text-sm font-normal cursor-pointer">{loc}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Filters apply as you pick them — this only resets everything. */}
              {hasFilters && (
                <Button variant="outline" className="w-full mt-4" onClick={clearAll}>
                  Clear all filters
                </Button>
              )}
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
                <p className="font-medium">
                  {query ? `No industrial properties match "${query}"` : "No industrial properties match your filters"}
                </p>
                <p className="text-sm mt-1">Try widening your search criteria.</p>
                {hasFilters && (
                  <Button variant="outline" className="mt-4" onClick={clearAll}>
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((property) => (
                  <IndustrialCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function IndustrialCard({ property }: { property: Property }) {
  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col sm:flex-row">
      <div className="relative h-[240px] sm:h-auto sm:w-[220px] shrink-0 overflow-hidden">
        <img
          src={primaryImage(property)}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className="absolute top-3 left-3 bg-white/90 text-foreground hover:bg-white/90 font-bold backdrop-blur-sm shadow-sm">
          {categoryLabel(property.category)}
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
            <span className="font-semibold text-sm">{areaLabel(property)}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" className="flex-1 text-primary border-primary hover:bg-primary hover:text-white h-10 text-sm">
            View Details
          </Button>
          <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-white h-10 text-sm">
            <Link href="/contact?interest=industrial"><PhoneCall size={16} className="mr-2" /> Contact</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
