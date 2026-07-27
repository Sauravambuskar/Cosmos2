import type { Property } from "./types";

export interface PropertyQuery {
  type?: string; // residential | commercial | industrial
  category?: string;
  transactionType?: string; // buy | rent
  featured?: boolean;
}

/**
 * Fetch active properties from the public API.
 * Editing listings in the admin CMS updates the same database this reads from,
 * so any change made in the backend is reflected here immediately.
 */
export async function fetchProperties(query: PropertyQuery = {}): Promise<Property[]> {
  const params = new URLSearchParams();
  if (query.type) params.append("type", query.type);
  if (query.category) params.append("category", query.category);
  if (query.transactionType) params.append("transactionType", query.transactionType);
  if (query.featured) params.append("featured", "true");

  const qs = params.toString();
  const res = await fetch(`/api/properties${qs ? `?${qs}` : ""}`);
  if (!res.ok) {
    throw new Error(`Failed to load properties (${res.status})`);
  }
  return (await res.json()) as Property[];
}

export async function fetchProperty(id: number): Promise<Property> {
  const res = await fetch(`/api/properties/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to load property (${res.status})`);
  }
  return (await res.json()) as Property;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  interest: string;
}

/** Submit a public contact / enquiry form. The submission appears in the admin CMS "Contacts" page. */
export async function submitContact(payload: ContactPayload): Promise<void> {
  const res = await fetch("/api/contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let message = `Failed to submit enquiry (${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
}

// ---------------------------------------------------------------------------
// Display helpers — map DB records to the fields the public UI renders
// ---------------------------------------------------------------------------

const FALLBACK_IMAGES: Record<string, string> = {
  residential: "/images/res-1.png",
  commercial: "/images/com-1.png",
  industrial: "/images/ind-1.png",
};

export function primaryImage(property: Property): string {
  return property.images?.[0] || FALLBACK_IMAGES[property.type] || "/images/prop-1.png";
}

export function areaLabel(property: Property): string {
  return property.area ? `${property.area.toLocaleString("en-IN")} sqft` : "—";
}

export function categoryLabel(category: string): string {
  return category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
