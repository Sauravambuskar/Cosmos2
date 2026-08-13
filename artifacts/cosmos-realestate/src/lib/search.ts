import type { Contact, Project, Property } from "./types";

/**
 * Free-text search shared by every listing page (public + admin).
 *
 * Listings are fetched in full by each page, so matching happens on the client:
 * one implementation, instant feedback while typing, and no request per keystroke.
 */

/** Lowercase alphanumeric tokens — "3-BHK," and "3 bhk" tokenise identically. */
export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ");
}

/**
 * A record matches when every token is found somewhere in its text. Tokens are
 * also tested against a squashed copy of the haystack so "rowhouse" finds
 * "row-house" and "3bhk" finds "3 BHK".
 */
function matchesTokens(haystack: string, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const squashed = haystack.replace(/ /g, "");
  return tokens.every((token) => haystack.includes(token) || squashed.includes(token));
}

function propertyHaystack(p: Property): string {
  const bhk = p.bhk ? `${p.bhk} bhk` : "";
  return normalizeText(
    [
      p.title,
      p.location,
      p.address,
      p.description,
      p.category,
      p.type,
      p.transactionType,
      p.price,
      bhk,
      ...(p.amenities ?? []),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function matchesPropertyQuery(property: Property, query: string): boolean {
  return matchesTokens(propertyHaystack(property), tokenize(query));
}

function projectHaystack(p: Project): string {
  return normalizeText(
    [
      p.name,
      p.location,
      p.description,
      p.type,
      p.status,
      p.developer,
      p.possession,
      p.priceRange,
      p.units,
      p.highlights,
      ...(p.amenities ?? []),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function matchesProjectQuery(project: Project, query: string): boolean {
  return matchesTokens(projectHaystack(project), tokenize(query));
}

/**
 * Enquiry search (admin). Phone numbers are matched on digits only, so a lead
 * stored as "9823056983" is still found by "+91 98230 56983".
 */
export function matchesContactQuery(contact: Contact, query: string): boolean {
  const tokens = tokenize(query);
  if (tokens.length === 0) return true;

  const haystack = normalizeText(
    [contact.name, contact.email, contact.phone, contact.message, contact.interest, contact.leadStatus, contact.notes]
      .filter(Boolean)
      .join(" "),
  );
  const squashed = haystack.replace(/ /g, "");
  const phoneDigits = (contact.phone ?? "").replace(/\D/g, "");

  return tokens.every((token) => {
    if (haystack.includes(token) || squashed.includes(token)) return true;
    if (!/^\d+$/.test(token) || !phoneDigits) return false;
    // Tolerate a country code on either side of the comparison.
    return phoneDigits.includes(token) || phoneDigits.includes(token.replace(/^0?91/, ""));
  });
}

// ---------------------------------------------------------------------------
// URL parameter normalisation
// ---------------------------------------------------------------------------

/**
 * Category slugs the site links to (nav dropdowns, marketing pages) mapped onto
 * the slugs stored in the database, so an inbound `?category=rowhouse` still
 * matches a "row-house" listing.
 */
const CATEGORY_ALIASES: Record<string, string> = {
  apartment: "flat",
  apartments: "flat",
  flats: "flat",
  villa: "bungalow",
  bungalows: "bungalow",
  rowhouse: "row-house",
  "row house": "row-house",
  offices: "office",
  coworking: "co-working",
  "co working": "co-working",
  managed: "managed-office",
  "managed office": "managed-office",
  shops: "shop",
  showrooms: "showroom",
  hotels: "hotel",
  warehouses: "warehouse",
  godown: "warehouse",
  factories: "factory",
  shed: "factory",
  industrial: "industrial-plot",
  plot: "industrial-plot",
  "industrial plot": "industrial-plot",
  coldstorage: "cold-storage",
  "cold storage": "cold-storage",
};

/** Canonical database category slug for a value coming from a URL. */
export function normalizeCategory(value: string): string {
  const slug = value.trim().toLowerCase().replace(/[\s_]+/g, "-");
  return CATEGORY_ALIASES[slug] ?? CATEGORY_ALIASES[slug.replace(/-/g, " ")] ?? slug;
}

/** Categories from a URL: repeated `?category=` params and comma-separated lists. */
export function parseCategories(params: URLSearchParams): string[] {
  const values = params
    .getAll("category")
    .flatMap((value) => value.split(","))
    .map(normalizeCategory)
    .filter(Boolean);
  return Array.from(new Set(values));
}

export type Transaction = "buy" | "rent";

/**
 * Buy/rent from a URL. Listing pages historically use `?type=buy`, so both
 * `type` and the clearer `transaction` are accepted; anything else falls back
 * to "buy" (`type=residential` style values must not select "rent").
 */
export function parseTransaction(params: URLSearchParams): Transaction {
  const raw = (params.get("transaction") ?? params.get("type") ?? "").trim().toLowerCase();
  if (raw === "rent" || raw === "lease" || raw === "rental") return "rent";
  return "buy";
}

/** The free-text query from a URL (`?q=`, or `?search=` for older links). */
export function parseQuery(params: URLSearchParams): string {
  return params.get("q") ?? params.get("search") ?? "";
}

/**
 * Buy/rent on the global search page, where "any" is a real choice: a query
 * that matches a listing must surface it regardless of how it is transacted.
 */
export type TransactionFilter = Transaction | "any";

export function parseTransactionFilter(params: URLSearchParams): TransactionFilter {
  const raw = (params.get("transaction") ?? params.get("type") ?? "").trim().toLowerCase();
  if (raw === "rent" || raw === "lease" || raw === "rental") return "rent";
  if (raw === "buy" || raw === "sale" || raw === "sell") return "buy";
  return "any";
}

/** Property types on the global search page — "any" searches the whole catalogue. */
export type PropertyTypeFilter = "any" | "residential" | "commercial" | "industrial";

export function parsePropertyType(params: URLSearchParams): PropertyTypeFilter {
  const raw = (params.get("propertyType") ?? "").trim().toLowerCase();
  return raw === "residential" || raw === "commercial" || raw === "industrial" ? raw : "any";
}
