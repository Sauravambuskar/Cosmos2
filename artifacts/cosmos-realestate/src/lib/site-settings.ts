/**
 * Client-side mirror of the site settings served by `GET /api/settings`.
 *
 * The shape is defined server-side in `@workspace/db` (`siteSettingsSchema`).
 * It is mirrored rather than imported so the browser bundle stays free of
 * Drizzle and Zod. `DEFAULT_SETTINGS` matches the server defaults, so the site
 * renders identically while the request is in flight or if the API is down.
 *
 * When you add a field to the server schema, add it here too.
 */

export interface Stat {
  value: string;
  label: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SiteSettings {
  brand: {
    name: string;
    tagline: string;
    legalName: string;
    logoUrl: string;
    footerAbout: string;
    badges: string[];
    designedBy: string;
    copyrightName: string;
  };
  contact: {
    phonePrimary: string;
    phoneSecondary: string;
    whatsapp: string;
    email: string;
    addressLine: string;
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    latitude: string;
    longitude: string;
    mapEmbedUrl: string;
    website: string;
    workingHours: string;
    workingHoursNote: string;
  };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    twitter: string;
  };
  home: {
    heroTitle: string;
    heroHighlight: string;
    heroSubtitle: string;
    heroImage: string;
    sellPitchTitle: string;
    sellPitchText: string;
    stats: Stat[];
    featuredPropertiesTitle: string;
    featuredPropertiesSubtitle: string;
    featuredProjectsTitle: string;
    whyTitle: string;
    whySubtitle: string;
  };
  footer: {
    propertyLinksTitle: string;
    propertyLinks: FooterLink[];
    quickLinksTitle: string;
    quickLinks: FooterLink[];
  };
  seo: {
    siteUrl: string;
    siteName: string;
    defaultTitle: string;
    defaultDescription: string;
    defaultKeywords: string;
    ogImage: string;
    foundingYear: string;
    areaServed: string;
    googleAnalyticsId: string;
    noindexSite: boolean;
  };
  features: {
    whatsappWidget: boolean;
    contactFormEnabled: boolean;
    showFeaturedProperties: boolean;
    showFeaturedProjects: boolean;
    showStatsBar: boolean;
    showProjectsNav: boolean;
    maintenanceMode: boolean;
    maintenanceMessage: string;
    announcementEnabled: boolean;
    announcementText: string;
    announcementLink: string;
  };
  locations: string[];
}

export const DEFAULT_SETTINGS: SiteSettings = {
  brand: {
    name: "COSMOS",
    tagline: "Real Estate",
    legalName: "Cosmos Real Estate",
    logoUrl: "",
    footerAbout:
      "India's premier property portal for buying, selling, and renting luxury residential, commercial, and industrial properties in Pune.",
    badges: ["NAR INDIA", "FMP CERTIFIED"],
    designedBy: "Ignite India",
    copyrightName: "Cosmos Real Estate",
  },
  contact: {
    phonePrimary: "+91-9823056983",
    phoneSecondary: "+91-9325097895",
    whatsapp: "919823056983",
    email: "cosmosestate@gmail.com",
    addressLine: "Shop No B4, Upper Ground, Fifth Avenue, Dholepatil Road, Pune - 411001",
    street: "Shop No B4, Upper Ground, Fifth Avenue, Dholepatil Road",
    city: "Pune",
    region: "Maharashtra",
    postalCode: "411001",
    country: "IN",
    latitude: "18.5362",
    longitude: "73.8939",
    mapEmbedUrl: "",
    website: "https://www.cosmosrealestate.co.in/",
    workingHours: "Mon - Sat: 9:30 AM - 7:00 PM",
    workingHoursNote: "Sunday: By Appointment",
  },
  social: { facebook: "", instagram: "", linkedin: "", youtube: "", twitter: "" },
  home: {
    heroTitle: "Find Your Perfect Property in",
    heroHighlight: "Pune",
    heroSubtitle: "Buy, Sell, or Rent — Residential, Commercial & Industrial Properties",
    heroImage: "/images/hero-bg.png",
    sellPitchTitle: "Looking to Sell or Lease Your Property in Pune?",
    sellPitchText:
      "List it with Cosmos Real Estate for 100% verified buyers & hassle-free deal closure.",
    stats: [
      { value: "500+", label: "Properties Listed" },
      { value: "20+", label: "Years Experience" },
      { value: "1000+", label: "Happy Clients" },
      { value: "Pune's #1", label: "Real Estate Broker" },
    ],
    featuredPropertiesTitle: "Featured Properties",
    featuredPropertiesSubtitle: "Handpicked luxury properties in prime locations",
    featuredProjectsTitle: "Featured Projects",
    whyTitle: "Why Cosmos Real Estate?",
    whySubtitle:
      "Pune's most trusted real estate advisory, offering end-to-end property solutions.",
  },
  footer: {
    propertyLinksTitle: "Properties in Pune",
    propertyLinks: [
      { label: "Flats for Sale in Pune", href: "/residential?transaction=buy&category=flat" },
      { label: "Bungalows for Sale", href: "/residential?transaction=buy&category=bungalow" },
      { label: "Commercial Offices for Rent", href: "/commercial?transaction=rent&category=office" },
      { label: "Shops for Sale", href: "/commercial?transaction=buy&category=shop" },
      { label: "Warehouses in Chakan", href: "/search?q=Chakan+warehouse" },
    ],
    quickLinksTitle: "Quick Links",
    quickLinks: [
      { label: "New Projects", href: "/projects" },
      { label: "About Us", href: "/about" },
      { label: "Post your Property", href: "/contact" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  seo: {
    siteUrl: "https://www.cosmosrealestate.co.in",
    siteName: "Cosmos Real Estate",
    defaultTitle: "Cosmos Real Estate | Property Dealers in Pune Since 2004",
    defaultDescription:
      "Buy, sell or rent residential, commercial and industrial property in Pune. NAR India certified brokers with 20+ years of experience and verified listings.",
    defaultKeywords:
      "real estate Pune, property dealers Pune, flats in Pune, commercial property Pune, industrial land Pune, warehouse Pune",
    ogImage: "/opengraph.jpg",
    foundingYear: "2004",
    areaServed: "Pune, Pimpri-Chinchwad, Chakan, Talegaon, Hinjewadi",
    googleAnalyticsId: "",
    noindexSite: false,
  },
  features: {
    whatsappWidget: true,
    contactFormEnabled: true,
    showFeaturedProperties: true,
    showFeaturedProjects: true,
    showStatsBar: true,
    showProjectsNav: true,
    maintenanceMode: false,
    maintenanceMessage: "We're updating the site. Please check back shortly.",
    announcementEnabled: false,
    announcementText: "",
    announcementLink: "",
  },
  locations: [
    "Koregaon Park, Pune",
    "Baner, Pune",
    "Kalyani Nagar, Pune",
    "Viman Nagar, Pune",
    "Aundh, Pune",
    "Wakad, Pune",
    "Kharadi, Pune",
    "Hinjewadi, Pune",
    "Chakan, Pune",
    "Bhosari, Pune",
    "Talegaon, Pune",
    "Other",
  ],
};

/** Fill any section the API omitted, so callers can read fields unguarded. */
export function withDefaults(partial: Partial<SiteSettings> | null | undefined): SiteSettings {
  if (!partial) return DEFAULT_SETTINGS;
  return {
    brand: { ...DEFAULT_SETTINGS.brand, ...partial.brand },
    contact: { ...DEFAULT_SETTINGS.contact, ...partial.contact },
    social: { ...DEFAULT_SETTINGS.social, ...partial.social },
    home: { ...DEFAULT_SETTINGS.home, ...partial.home },
    footer: { ...DEFAULT_SETTINGS.footer, ...partial.footer },
    seo: { ...DEFAULT_SETTINGS.seo, ...partial.seo },
    features: { ...DEFAULT_SETTINGS.features, ...partial.features },
    locations: partial.locations?.length ? partial.locations : DEFAULT_SETTINGS.locations,
  };
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const res = await fetch("/api/settings");
  if (!res.ok) throw new Error(`Failed to load site settings (${res.status})`);
  return withDefaults((await res.json()) as Partial<SiteSettings>);
}

/** Digits-only phone number, ready for a `wa.me/` or `tel:` link. */
export function phoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}
