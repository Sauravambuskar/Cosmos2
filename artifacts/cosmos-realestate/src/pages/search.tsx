import { useMemo } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, MapPin, Building2, PhoneCall, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchProperties, fetchProjects, primaryImage, projectImage, areaLabel, categoryLabel } from "@/lib/api";
import {
  matchesPropertyQuery,
  matchesProjectQuery,
  parsePropertyType,
  parseTransactionFilter,
  type PropertyTypeFilter,
  type TransactionFilter,
} from "@/lib/search";
import { useGlobalSearch } from "@/hooks/use-listing-filters";
import ListingSearch from "@/components/listing-search";
import type { Project, Property } from "@/lib/types";
import Seo from "@/components/seo";
import { breadcrumbSchema } from "@/lib/seo";

const TRANSACTION_CHIPS: { value: TransactionFilter; label: string }[] = [
  { value: "any", label: "Buy or Rent" },
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" },
];

const TYPE_CHIPS: { value: PropertyTypeFilter; label: string }[] = [
  { value: "any", label: "All types" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
];

/**
 * Site-wide search across the whole catalogue.
 *
 * The listing pages each own one slice of the catalogue (residential /
 * commercial / industrial, buy or rent), so a search run from one of them can
 * only ever find part of the site. This page fetches everything and narrows it
 * down here instead, so a query that matches a listing always finds it — the
 * buy/rent and type controls below are filters the visitor opts into, never
 * assumptions made on their behalf.
 */
export default function SearchResults() {
  const { query, setQuery, params, setParam } = useGlobalSearch();

  const transaction = parseTransactionFilter(params);
  const propertyType = parsePropertyType(params);

  const { data: properties = [], isLoading: loadingProperties } = useQuery({
    queryKey: ["properties", "all"],
    queryFn: () => fetchProperties(),
  });
  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ["projects", "all"],
    queryFn: () => fetchProjects(),
  });

  const isLoading = loadingProperties || loadingProjects;
  const trimmed = query.trim();

  /** Query-only matches, before the chips narrow anything — powers the "N hidden by filters" hint. */
  const queryMatches = useMemo(
    () => properties.filter((p) => matchesPropertyQuery(p, query)),
    [properties, query],
  );

  const matchedProperties = useMemo(
    () =>
      queryMatches.filter((p) => {
        if (transaction !== "any" && p.transactionType !== transaction) return false;
        if (propertyType !== "any" && p.type !== propertyType) return false;
        return true;
      }),
    [queryMatches, transaction, propertyType],
  );

  const matchedProjects = useMemo(
    () =>
      projects.filter((p) => {
        if (!matchesProjectQuery(p, query)) return false;
        if (propertyType !== "any" && p.type !== propertyType) return false;
        return true;
      }),
    [projects, query, propertyType],
  );

  const total = matchedProperties.length + matchedProjects.length;
  /** Listings the query found but the chips are hiding — the fix is one click away, so say so. */
  const hiddenByFilters = queryMatches.length - matchedProperties.length;
  const hasChipFilters = transaction !== "any" || propertyType !== "any";

  function clearFilters() {
    setParam("transaction", null);
    setParam("propertyType", null);
  }

  return (
    <div className="bg-secondary/20 min-h-screen pb-20">
      <Seo
        title={trimmed ? `Search: ${trimmed} | Cosmos Real Estate Pune` : "Search Properties | Cosmos Real Estate Pune"}
        description="Search every residential, commercial and industrial listing and project from Cosmos Real Estate in Pune."
        path="/search"
        noindex
        schemas={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Search", path: "/search" },
          ]),
        ]}
      />

      <div className="bg-white border-b pt-4 pb-6">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-foreground font-medium">Search</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            {trimmed ? <>Search results for “{trimmed}”</> : "Search properties in Pune"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isLoading
              ? "Searching…"
              : `${total} ${total === 1 ? "result" : "results"} across properties and projects`}
          </p>

          <ListingSearch
            value={query}
            onChange={setQuery}
            placeholder="Search flats, offices, warehouses, localities, projects…"
            className="mt-5 max-w-xl"
          />

          <div className="flex flex-wrap gap-2 mt-4">
            {TRANSACTION_CHIPS.map((chip) => (
              <Chip
                key={chip.value}
                label={chip.label}
                active={transaction === chip.value}
                onClick={() => setParam("transaction", chip.value === "any" ? null : chip.value)}
              />
            ))}
            <span className="w-px bg-border mx-1 self-stretch" aria-hidden />
            {TYPE_CHIPS.map((chip) => (
              <Chip
                key={chip.value}
                label={chip.label}
                active={propertyType === chip.value}
                onClick={() => setParam("propertyType", chip.value === "any" ? null : chip.value)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-72 bg-white border rounded-lg animate-pulse" />
            ))}
          </div>
        ) : total === 0 ? (
          <div className="text-center py-20 text-muted-foreground bg-white border rounded-lg">
            <SearchX size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-foreground">
              {trimmed ? `Nothing matches “${trimmed}”` : "Type to search our listings"}
            </p>
            {hiddenByFilters > 0 ? (
              <>
                <p className="text-sm mt-1">
                  {hiddenByFilters} matching {hiddenByFilters === 1 ? "listing is" : "listings are"} hidden by your filters.
                </p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Show all matches
                </Button>
              </>
            ) : (
              <p className="text-sm mt-1">Try a locality, project name or property type — or call us on +91-9823056983.</p>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            {hiddenByFilters > 0 && (
              <p className="text-sm text-muted-foreground">
                {hiddenByFilters} more {hiddenByFilters === 1 ? "match is" : "matches are"} hidden by your filters.{" "}
                <button type="button" onClick={clearFilters} className="text-primary font-medium hover:underline">
                  Show all
                </button>
              </p>
            )}

            {matchedProperties.length > 0 && (
              <section>
                <h2 className="font-serif font-bold text-xl text-foreground mb-4">
                  Properties <span className="text-muted-foreground font-sans text-sm font-normal">({matchedProperties.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {matchedProperties.map((property) => (
                    <PropertyResult key={property.id} property={property} />
                  ))}
                </div>
              </section>
            )}

            {matchedProjects.length > 0 && (
              <section>
                <h2 className="font-serif font-bold text-xl text-foreground mb-4">
                  Projects <span className="text-muted-foreground font-sans text-sm font-normal">({matchedProjects.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {matchedProjects.map((project) => (
                    <ProjectResult key={project.id} project={project} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "px-3 py-1.5 rounded-full text-sm font-medium border border-primary bg-primary text-white"
          : "px-3 py-1.5 rounded-full text-sm font-medium border border-border bg-white text-foreground hover:border-primary hover:text-primary"
      }
    >
      {label}
    </button>
  );
}

function PropertyResult({ property }: { property: Property }) {
  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={primaryImage(property)}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className="absolute top-3 left-3 bg-white/90 text-foreground hover:bg-white/90 font-bold backdrop-blur-sm shadow-sm">
          {categoryLabel(property.category)}
        </Badge>
        <Badge className="absolute top-3 right-3 bg-primary/90 text-white hover:bg-primary/90 font-bold backdrop-blur-sm shadow-sm capitalize">
          {property.transactionType === "rent" ? "For Rent" : "For Sale"}
        </Badge>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-serif font-bold text-foreground leading-tight mb-2">{property.title}</h3>
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
          <Button asChild variant="outline" className="flex-1 text-primary border-primary hover:bg-primary hover:text-white h-10 text-sm">
            <Link href={`/${property.type}`}>Browse {property.type}</Link>
          </Button>
          <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-white h-10 text-sm">
            <Link href={`/contact?interest=${property.type}`}><PhoneCall size={16} className="mr-2" /> Enquire</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProjectResult({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
    >
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={projectImage(project)}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {project.status && (
          <Badge className="absolute top-3 left-3 bg-white/90 text-foreground hover:bg-white/90 font-bold backdrop-blur-sm shadow-sm">
            {project.status}
          </Badge>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-serif font-bold text-foreground leading-tight mb-2">{project.name}</h3>
        <p className="text-muted-foreground text-sm flex items-center gap-1 mb-3">
          <MapPin size={14} className="shrink-0" /> <span className="truncate">{project.location}</span>
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-auto">
          <Building2 size={14} className="shrink-0" />
          {project.developer || project.priceRange || "View project details"}
        </p>
      </div>
    </Link>
  );
}
