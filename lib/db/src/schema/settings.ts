import { pgTable, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

/**
 * Site-wide content and configuration, editable from the admin panel.
 *
 * Stored as a single JSON blob in one row rather than a wide table: the shape
 * grows every time a new piece of the site becomes editable, and a jsonb column
 * means adding a field is a schema-file change only — no DB migration, no risk
 * of the API and the database disagreeing about which columns exist.
 *
 * `siteSettingsSchema` is the source of truth for that shape. Every field has a
 * default, so parsing a partial (or empty) blob always yields a complete object
 * and the public site never has to render around a missing value.
 */
export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  data: jsonb("data").notNull().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

const statSchema = z.object({
  value: z.string().default(""),
  label: z.string().default(""),
});

const linkSchema = z.object({
  label: z.string().default(""),
  href: z.string().default(""),
});

// `.prefault({})` (rather than `.default({})`) on each section means an empty or
// partial stored object is *parsed*, so every nested field falls back to its own
// default instead of the whole section being required up front.
export const siteSettingsSchema = z.object({
  brand: z
    .object({
      name: z.string().default("COSMOS"),
      tagline: z.string().default("Real Estate"),
      legalName: z.string().default("Cosmos Real Estate"),
      logoUrl: z.string().default(""),
      footerAbout: z
        .string()
        .default(
          "India's premier property portal for buying, selling, and renting luxury residential, commercial, and industrial properties in Pune.",
        ),
      badges: z.array(z.string()).default(["NAR INDIA", "FMP CERTIFIED"]),
      designedBy: z.string().default("Ignite India"),
      copyrightName: z.string().default("Cosmos Real Estate"),
    })
    .prefault({}),

  contact: z
    .object({
      phonePrimary: z.string().default("+91-9823056983"),
      phoneSecondary: z.string().default("+91-9325097895"),
      whatsapp: z.string().default("919823056983"),
      email: z.string().default("cosmosestate@gmail.com"),
      addressLine: z
        .string()
        .default("Shop No B4, Upper Ground, Fifth Avenue, Dholepatil Road, Pune - 411001"),
      street: z.string().default("Shop No B4, Upper Ground, Fifth Avenue, Dholepatil Road"),
      city: z.string().default("Pune"),
      region: z.string().default("Maharashtra"),
      postalCode: z.string().default("411001"),
      country: z.string().default("IN"),
      latitude: z.string().default("18.5362"),
      longitude: z.string().default("73.8939"),
      mapEmbedUrl: z.string().default(""),
      website: z.string().default("https://www.cosmosrealestate.co.in/"),
      workingHours: z.string().default("Mon - Sat: 9:30 AM - 7:00 PM"),
      workingHoursNote: z.string().default("Sunday: By Appointment"),
    })
    .prefault({}),

  social: z
    .object({
      facebook: z.string().default(""),
      instagram: z.string().default(""),
      linkedin: z.string().default(""),
      youtube: z.string().default(""),
      twitter: z.string().default(""),
    })
    .prefault({}),

  home: z
    .object({
      heroTitle: z.string().default("Find Your Perfect Property in"),
      heroHighlight: z.string().default("Pune"),
      heroSubtitle: z
        .string()
        .default("Buy, Sell, or Rent — Residential, Commercial & Industrial Properties"),
      heroImage: z.string().default("/images/hero-bg.png"),
      sellPitchTitle: z.string().default("Looking to Sell or Lease Your Property in Pune?"),
      sellPitchText: z
        .string()
        .default(
          "List it with Cosmos Real Estate for 100% verified buyers & hassle-free deal closure.",
        ),
      stats: z
        .array(statSchema)
        .default([
          { value: "500+", label: "Properties Listed" },
          { value: "20+", label: "Years Experience" },
          { value: "1000+", label: "Happy Clients" },
          { value: "Pune's #1", label: "Real Estate Broker" },
        ]),
      featuredPropertiesTitle: z.string().default("Featured Properties"),
      featuredPropertiesSubtitle: z
        .string()
        .default("Handpicked luxury properties in prime locations"),
      featuredProjectsTitle: z.string().default("Featured Projects"),
      whyTitle: z.string().default("Why Cosmos Real Estate?"),
      whySubtitle: z
        .string()
        .default(
          "Pune's most trusted real estate advisory, offering end-to-end property solutions.",
        ),
    })
    .prefault({}),

  footer: z
    .object({
      propertyLinksTitle: z.string().default("Properties in Pune"),
      propertyLinks: z
        .array(linkSchema)
        .default([
          { label: "Flats for Sale in Pune", href: "/residential?transaction=buy&category=flat" },
          { label: "Bungalows for Sale", href: "/residential?transaction=buy&category=bungalow" },
          {
            label: "Commercial Offices for Rent",
            href: "/commercial?transaction=rent&category=office",
          },
          { label: "Shops for Sale", href: "/commercial?transaction=buy&category=shop" },
          { label: "Warehouses in Chakan", href: "/search?q=Chakan+warehouse" },
        ]),
      quickLinksTitle: z.string().default("Quick Links"),
      quickLinks: z
        .array(linkSchema)
        .default([
          { label: "New Projects", href: "/projects" },
          { label: "About Us", href: "/about" },
          { label: "Post your Property", href: "/contact" },
          { label: "Contact Us", href: "/contact" },
        ]),
    })
    .prefault({}),

  seo: z
    .object({
      siteUrl: z.string().default("https://www.cosmosrealestate.co.in"),
      siteName: z.string().default("Cosmos Real Estate"),
      defaultTitle: z.string().default("Cosmos Real Estate | Property Dealers in Pune Since 2004"),
      defaultDescription: z
        .string()
        .default(
          "Buy, sell or rent residential, commercial and industrial property in Pune. NAR India certified brokers with 20+ years of experience and verified listings.",
        ),
      defaultKeywords: z
        .string()
        .default(
          "real estate Pune, property dealers Pune, flats in Pune, commercial property Pune, industrial land Pune, warehouse Pune",
        ),
      ogImage: z.string().default("/opengraph.jpg"),
      foundingYear: z.string().default("2004"),
      areaServed: z.string().default("Pune, Pimpri-Chinchwad, Chakan, Talegaon, Hinjewadi"),
      googleAnalyticsId: z.string().default(""),
      noindexSite: z.boolean().default(false),
    })
    .prefault({}),

  features: z
    .object({
      whatsappWidget: z.boolean().default(true),
      contactFormEnabled: z.boolean().default(true),
      showFeaturedProperties: z.boolean().default(true),
      showFeaturedProjects: z.boolean().default(true),
      showStatsBar: z.boolean().default(true),
      showProjectsNav: z.boolean().default(true),
      maintenanceMode: z.boolean().default(false),
      maintenanceMessage: z
        .string()
        .default("We're updating the site. Please check back shortly."),
      announcementEnabled: z.boolean().default(false),
      announcementText: z.string().default(""),
      announcementLink: z.string().default(""),
    })
    .prefault({}),

  /**
   * Localities offered in the property form's dropdown. Editable so a new area
   * can be listed without a code change.
   */
  locations: z
    .array(z.string())
    .default([
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
    ]),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

/** A complete settings object built purely from defaults. */
export function defaultSiteSettings(): SiteSettings {
  return siteSettingsSchema.parse({});
}
