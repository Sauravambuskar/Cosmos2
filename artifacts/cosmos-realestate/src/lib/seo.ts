/**
 * Central SEO configuration.
 *
 * The values below are build-time fallbacks. Anything an admin can edit lives in
 * Site Settings (`/api/settings`) and is passed into the helpers here as an
 * optional override, so the structured data on the page matches the business
 * details currently configured in the panel.
 */

import type { SiteSettings } from "./site-settings";

export const SITE_URL = "https://www.cosmosrealestate.co.in";
export const SITE_NAME = "Cosmos Real Estate";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

/** Verified business details — used for LocalBusiness structured data. */
export const BUSINESS = {
  name: "Cosmos Real Estate",
  legalName: "Cosmos Real Estate",
  phone: "+91-9823056983",
  altPhone: "+91-9325097895",
  email: "cosmosestate@gmail.com",
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
  featuredProperties: {
    title: "Featured Properties in Pune | Cosmos Real Estate",
    description:
      "Handpicked properties currently on offer in Pune - luxury flats and bungalows in Koregaon Park, high-street shops and showrooms, Grade A warehouses in Talegaon and MIDC land in Chakan.",
    path: "/featured-properties",
    keywords:
      "featured properties Pune, property deals Pune, luxury flats Koregaon Park, shop for sale Pune, Grade A warehouse Talegaon, MIDC land Chakan",
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

/** Site root, honouring the admin-configured URL when one is available. */
export function siteUrl(settings?: SiteSettings): string {
  return (settings?.seo.siteUrl || SITE_URL).replace(/\/$/, "");
}

export function canonical(path: string, settings?: SiteSettings): string {
  const root = siteUrl(settings);
  return path === "/" ? `${root}/` : `${root}${path}`;
}

/** Organisation + LocalBusiness schema for the site as a whole. */
export function localBusinessSchema(settings?: SiteSettings) {
  const root = siteUrl(settings);
  const contact = settings?.contact;
  const seo = settings?.seo;
  const phone = contact?.phonePrimary || BUSINESS.phone;
  const areaServed = seo?.areaServed || BUSINESS.areaServed;
  const ogImage = seo?.ogImage
    ? seo.ogImage.startsWith("http")
      ? seo.ogImage
      : `${root}${seo.ogImage}`
    : DEFAULT_OG_IMAGE;

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${root}/#organization`,
    name: settings?.brand.legalName || BUSINESS.name,
    legalName: settings?.brand.legalName || BUSINESS.legalName,
    url: root,
    logo: settings?.brand.logoUrl || `${root}/favicon.svg`,
    image: ogImage,
    description: seo?.defaultDescription ?? BUSINESS_DESCRIPTION,
    telephone: phone,
    email: contact?.email || BUSINESS.email,
    foundingDate: seo?.foundingYear || BUSINESS.foundingYear,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: contact?.street || BUSINESS.street,
      addressLocality: contact?.city || BUSINESS.city,
      addressRegion: contact?.region || BUSINESS.region,
      postalCode: contact?.postalCode || BUSINESS.postalCode,
      addressCountry: contact?.country || BUSINESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: Number(contact?.latitude ?? BUSINESS.latitude),
      longitude: Number(contact?.longitude ?? BUSINESS.longitude),
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "19:00",
    },
    areaServed: areaServed.split(", ").map((name) => ({
      "@type": "City",
      name,
    })),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Marathi"],
    },
  };
}

const BUSINESS_DESCRIPTION =
  "Cosmos Real Estate is a NAR India certified real estate consultancy in Pune offering residential, commercial and industrial property advisory since 2004.";

export function websiteSchema(settings?: SiteSettings) {
  const root = siteUrl(settings);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${root}/#website`,
    url: root,
    name: settings?.seo.siteName || SITE_NAME,
    publisher: { "@id": `${root}/#organization` },
  };
}

/** Breadcrumb trail so search results show the site hierarchy. */
export function breadcrumbSchema(
  trail: { name: string; path: string }[],
  settings?: SiteSettings,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonical(item.path, settings),
    })),
  };
}
