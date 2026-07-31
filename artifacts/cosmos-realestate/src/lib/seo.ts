/**
 * Central SEO configuration.
 *
 * Keeping copy and structured data here (rather than inline in pages) means
 * titles, descriptions and business details stay consistent and are edited in
 * one place.
 */

export const SITE_URL = "https://www.cosmosrealestate.co.in";
export const SITE_NAME = "Cosmos Real Estate";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

/** Verified business details — used for LocalBusiness structured data. */
export const BUSINESS = {
  name: "Cosmos Real Estate",
  legalName: "Cosmos Real Estate",
  phone: "+91-9823056983",
  altPhone: "+91-9325097895",
  email: "jatin@cosmosrealestate.in",
  street: "Shop No B4, Upper Ground, Fifth Avenue, Dholepatil Road",
  city: "Pune",
  region: "Maharashtra",
  postalCode: "411001",
  country: "IN",
  latitude: 18.5362,
  longitude: 73.8939,
  openingHours: "Mo-Sa 09:30-19:00",
  areaServed: "Pune, Pimpri-Chinchwad, Chakan, Talegaon, Hinjewadi",
  foundingYear: "2004",
};

export interface PageSeo {
  title: string;
  description: string;
  path: string;
  keywords?: string;
}

/**
 * Per-page metadata. Titles stay under ~60 characters and descriptions under
 * ~160 so search engines don't truncate them.
 */
export const PAGE_SEO: Record<string, PageSeo> = {
  home: {
    title: "Cosmos Real Estate | Property Dealers in Pune Since 2004",
    description:
      "Buy, sell or rent residential, commercial and industrial property in Pune. NAR India certified brokers with 20+ years of experience and verified listings.",
    path: "/",
    keywords:
      "real estate Pune, property dealers Pune, flats in Pune, commercial property Pune, industrial land Pune, warehouse Pune",
  },
  about: {
    title: "About Us | Cosmos Real Estate Pune",
    description:
      "Cosmos Real Estate is a NAR India certified property consultancy in Koregaon Park, Pune, offering end-to-end advisory across residential, commercial and industrial real estate.",
    path: "/about",
    keywords: "about Cosmos Real Estate, NAR India certified broker Pune, property consultant Pune",
  },
  residential: {
    title: "Residential Property in Pune | Flats, Bungalows & Row Houses",
    description:
      "Explore residential property for sale and rent in Pune — flats, bungalows, row houses and duplexes in Koregaon Park, Baner, Kharadi, Aundh and more.",
    path: "/residential",
    keywords:
      "flats for sale in Pune, residential property Pune, bungalow Pune, row house Pune, 2BHK 3BHK Pune",
  },
  commercial: {
    title: "Commercial Property in Pune | Offices, Shops & Showrooms",
    description:
      "Find commercial property in Pune for purchase or lease — office space, co-working, managed offices, shops and showrooms across Hinjewadi, Kharadi and Baner.",
    path: "/commercial",
    keywords:
      "commercial property Pune, office space Pune, shop for rent Pune, showroom Pune, co-working Pune",
  },
  industrial: {
    title: "Industrial Property & Warehouses in Pune | Chakan, Talegaon",
    description:
      "Grade-A warehouses, factories and industrial plots in Pune's key hubs — Chakan, Talegaon, Ranjangaon and Bhosari. Built-to-suit and ready-to-occupy options.",
    path: "/industrial",
    keywords:
      "warehouse in Pune, industrial property Chakan, factory for rent Pune, industrial plot Pune, Grade A warehouse",
  },
  projects: {
    title: "Our Projects | Cosmos Real Estate Pune",
    description:
      "Landmark residential, commercial and industrial projects delivered and under development by Cosmos Real Estate across Pune.",
    path: "/projects",
    keywords: "real estate projects Pune, industrial park Pune, logistics park Chakan",
  },
  contact: {
    title: "Contact Us | Cosmos Real Estate Pune",
    description:
      "Talk to Cosmos Real Estate about buying, selling or leasing property in Pune. Call +91-9823056983 or visit our Dholepatil Road office.",
    path: "/contact",
    keywords: "contact Cosmos Real Estate, property dealer Pune contact, real estate agent Pune",
  },
};

export function canonical(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** Organisation + LocalBusiness schema for the site as a whole. */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${SITE_URL}/#organization`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    image: DEFAULT_OG_IMAGE,
    description:
      "Cosmos Real Estate is a NAR India certified real estate consultancy in Pune offering residential, commercial and industrial property advisory since 2004.",
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    foundingDate: BUSINESS.foundingYear,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.street,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "19:00",
    },
    areaServed: BUSINESS.areaServed.split(", ").map((name) => ({
      "@type": "City",
      name,
    })),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: BUSINESS.phone,
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Marathi"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Breadcrumb trail so search results show the site hierarchy. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  };
}
