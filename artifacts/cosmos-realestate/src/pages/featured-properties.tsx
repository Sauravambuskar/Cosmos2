import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  MapPin,
  Maximize2,
  X,
  PhoneCall,
  Building2,
  ExternalLink,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Seo from "@/components/seo";
import { PAGE_SEO, breadcrumbSchema } from "@/lib/seo";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { phoneDigits } from "@/lib/site-settings";

/**
 * Featured Properties — the marketing creatives the sales team circulates on
 * WhatsApp, published as a browsable page.
 *
 * The artwork lives in R2 (the same bucket the admin media uploads use) and is
 * listed here by hand rather than pulled from /api/properties: these are
 * designed flyers for live mandates, not CMS listings, and each one carries its
 * own pricing and area copy baked into the image.
 */
const CDN = "https://pub-ce4f24b87e8144b19b205aab36567352.r2.dev/uploads";

type Segment = "residential" | "commercial" | "industrial";
type Deal = "buy" | "rent";

interface Creative {
  /** R2 object id — also the React key for the card. */
  file: string;
  title: string;
  location: string;
  segment: Segment;
  deal: Deal;
  /** Price exactly as it reads on the creative. */
  price: string;
  area: string;
  note: string;
}

/** Ordered residential → commercial → industrial so the "All" view scans cleanly. */
const CREATIVES: Creative[] = [
  // ---------------------------------------------------------------- residential
  {
    file: "d8f43ba0-c5cc-46fb-93f6-9a69532c809d",
    title: "4.5 BHK Luxury Flat for Sale",
    location: "Boat Club Road, Pune",
    segment: "residential",
    deal: "buy",
    price: "₹6.50 Cr",
    area: "3,200 sq ft",
    note: "4th floor · Semi-furnished",
  },
  {
    file: "f5a4cd0b-c546-4a4e-b06f-2df3266ebe9b",
    title: "3 BHK Flat for Sale",
    location: "Windermere, Koregaon Park",
    segment: "residential",
    deal: "buy",
    price: "₹7.30 Cr",
    area: "3,000 sq ft",
    note: "Higher floor · 2 car parks · Vastu compliant",
  },
  {
    file: "c0a79d17-3d13-4f6d-8d8a-f041a4635309",
    title: "3 BHK Fully Furnished Flat for Sale",
    location: "Ganga Carnation, Koregaon Park",
    segment: "residential",
    deal: "buy",
    price: "₹2.30 Cr",
    area: "1,275 sq ft",
    note: "3 car parks · All white goods included",
  },
  {
    file: "d32be06a-9361-4a53-b12d-c1e6ebc1472a",
    title: "3 BHK Flat for Sale",
    location: "Koregaon Park North Main Road",
    segment: "residential",
    deal: "buy",
    price: "₹1.75 Cr",
    area: "1,080 sq ft",
    note: "2nd floor · Ready to move",
  },
  {
    file: "0694f7c8-1c17-4b17-91c0-1687fcc4b890",
    title: "4 BHK Bungalow on Rent",
    location: "Naylor Road, Koregaon Park",
    segment: "residential",
    deal: "rent",
    price: "₹1.50 L / month",
    area: "4,000 sq ft",
    note: "Family and company lease",
  },
  {
    file: "eb0b947f-087d-47cf-9ca9-594ae1b63794",
    title: "4.5 BHK Luxury Flat on Rent",
    location: "Oxford Hallmark, Koregaon Park",
    segment: "residential",
    deal: "rent",
    price: "₹1.70 – 2.30 L / month",
    area: "2,500 sq ft",
    note: "Semi or fully furnished · 1 car park",
  },
  {
    file: "bd3fc082-e209-4ace-b4d1-0e19cbd7f824",
    title: "4.5 BHK Luxury Flat on Rent",
    location: "Oxford Hallmark, Koregaon Park",
    segment: "residential",
    deal: "rent",
    price: "₹1.70 – 2.30 L / month",
    area: "2,500 sq ft",
    note: "Pool, gym and gated community",
  },
  {
    file: "cc08aba6-2404-44f4-8983-a5dcf499e30a",
    title: "3 BHK Flat on Rent",
    location: "Kumar Kruti, Kalyani Nagar",
    segment: "residential",
    deal: "rent",
    price: "₹80,000 / month",
    area: "1,450 sq ft",
    note: "5th floor · Covered car park · Ready to move",
  },

  // ----------------------------------------------------------------- commercial
  {
    file: "e0e8e6f4-f7bf-499b-8de8-9e66fb07d364",
    title: "Pre-Leased Hotel for Sale",
    location: "Prime location, Pune",
    segment: "commercial",
    deal: "buy",
    price: "₹18 Cr",
    area: "25 rooms",
    note: "Running business · ROI 5.5% – 6%",
  },
  {
    file: "0c3cb173-4dd5-4619-aac2-37f437d0e74a",
    title: "Pre-Leased Road-Facing Shop for Sale",
    location: "Koregaon Park North Main Road",
    segment: "commercial",
    deal: "buy",
    price: "₹2.60 Cr",
    area: "245 sq ft",
    note: "Rent ₹90k · 5-year lock-in · 15% escalation",
  },
  {
    file: "d21cdd03-ed8e-4293-a788-1ba229c3038d",
    title: "Commercial Shop for Sale",
    location: "Fifth Avenue, Dhole Patil Road",
    segment: "commercial",
    deal: "buy",
    price: "₹1.50 Cr",
    area: "585 sq ft",
    note: "1 car park · High-footfall address",
  },
  {
    file: "dd0a0ae5-ae5d-49e9-92a7-dba5fe07630a",
    title: "Shop for Sale",
    location: "Fifth Avenue, Dhole Patil Road",
    segment: "commercial",
    deal: "buy",
    price: "₹1.50 Cr",
    area: "585 sq ft",
    note: "Upper ground floor · Prime location",
  },
  {
    file: "f37cc43e-874c-4a68-8883-70cfa538ec8a",
    title: "Commercial Showroom Space",
    location: "Koregaon Park, Pune",
    segment: "commercial",
    deal: "rent",
    price: "₹6.50 L / month",
    area: "950 sq ft",
    note: "Ground floor · High-street frontage",
  },

  // ----------------------------------------------------------------- industrial
  {
    file: "c8b2f1c8-6059-4d90-9b6b-63083087a4ae",
    title: "Industrial MIDC Land for Sale",
    location: "Chakan MIDC Belt",
    segment: "industrial",
    deal: "buy",
    price: "₹2,000 per sq ft",
    area: "3 – 75 acres",
    note: "Clear title · MIDC sanction · Transfer charges included",
  },
  {
    file: "8727e95a-f74b-4a0d-b2cf-103555abb72c",
    title: "Industrial MIDC Land for Sale",
    location: "Chakan MIDC Belt",
    segment: "industrial",
    deal: "buy",
    price: "₹2,000 per sq ft",
    area: "3 – 75 acres",
    note: "On the Pune–Nashik highway corridor",
  },
  {
    file: "0de55dd0-3c5e-4862-9df2-f502f4958e95",
    title: "Industrial Sheds / Warehouses on Long-Term Lease",
    location: "Chakan, Sate, Naigaon and Pirangut",
    segment: "industrial",
    deal: "rent",
    price: "On request",
    area: "63,000 – 3,00,000 sq ft",
    note: "5 units · Ready possession to Jan 2027",
  },
  {
    file: "075b25b3-15ce-440c-a319-d9d726a18100",
    title: "Grade A Industrial Shed on Lease",
    location: "Talegaon MIDC Phase II",
    segment: "industrial",
    deal: "rent",
    price: "On request",
    area: "5,38,000 sq ft",
    note: "Dry access December 2026",
  },
  {
    file: "264770fe-8440-4a7d-9f90-a01152eb98ff",
    title: "Grade A Industrial Shed on Lease",
    location: "Talegaon MIDC Phase II",
    segment: "industrial",
    deal: "rent",
    price: "On request",
    area: "4,84,000 sq ft",
    note: "Dry access August 2026",
  },
  {
    file: "0780dd68-dc99-4733-ac50-3aaa12f3ae0d",
    title: "Grade A Industrial Shed for Rent",
    location: "Talegaon MIDC Phase II",
    segment: "industrial",
    deal: "rent",
    price: "On request",
    area: "2,84,000 sq ft",
    note: "Ready possession · Dry access July 2026",
  },
  {
    file: "fa6408c3-b1cb-4247-8bf7-de9e96999917",
    title: "Industrial Property for Rent",
    location: "Hinjewadi Phase I",
    segment: "industrial",
    deal: "rent",
    price: "₹50 per sq ft",
    area: "58,000 sq ft built-up",
    note: "84,000 sq ft plot · 6 months deposit",
  },
  {
    file: "4ce16c87-e448-47ed-8c05-4f49045c933b",
    title: "Built-to-Suit Industrial RCC Shed",
    location: "Hinjewadi Phase I, Pune",
    segment: "industrial",
    deal: "rent",
    price: "On request",
    area: "45,000 – 1,70,000 sq ft",
    note: "Ground + 2 floors · PMRDA sanction approved",
  },
  {
    file: "11619b65-1345-4a6b-ab9d-ca5888dd2b14",
    title: "PEB / RCC Warehouse Shed on Lease",
    location: "Hinjewadi Phase I, Pune",
    segment: "industrial",
    deal: "rent",
    price: "On request",
    area: "45,000 – 1,70,000 sq ft",
    note: "Built-to-suit and ready-to-move options",
  },
];

const SEGMENT_LABELS: Record<Segment, string> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
};

const SEGMENT_FILTERS: { value: Segment | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
];

function imageUrl(creative: Creative): string {
  return `${CDN}/${creative.file}.jpeg`;
}

/** Pre-selects the right option on the contact form interest dropdown. */
function interestFor(creative: Creative): string {
  if (creative.segment === "industrial") return "industrial";
  return `${creative.deal}_${creative.segment}`;
}

export default function FeaturedProperties() {
  const { contact, features } = useSiteSettings();
  const [segment, setSegment] = useState<Segment | "all">("all");
  const [deal, setDeal] = useState<Deal | "all">("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      CREATIVES.filter(
        (c) => (segment === "all" || c.segment === segment) && (deal === "all" || c.deal === deal),
      ),
    [segment, deal],
  );

  // Filtering re-indexes the list, so an open lightbox would point at the wrong
  // creative — close it instead.
  useEffect(() => {
    setLightbox(null);
  }, [segment, deal]);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (delta: number) =>
      setLightbox((i) => (i === null ? null : (i + delta + filtered.length) % filtered.length)),
    [filtered.length],
  );

  // Arrow keys and Escape while the lightbox is open; the page behind it stays put.
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox, close, step]);

  const active = lightbox === null ? null : filtered[lightbox];

  return (
    <div className="bg-secondary/20 min-h-screen pb-20">
      <Seo
        {...PAGE_SEO.featuredProperties}
        image={imageUrl(CREATIVES[0])}
        schemas={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Featured Properties", path: "/featured-properties" },
          ]),
        ]}
      />

      {/* Breadcrumb & header */}
      <div className="bg-white border-b pt-4 pb-6">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-foreground font-medium">Featured Properties</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                Featured Properties in Pune
              </h1>
              <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
                Handpicked mandates currently with our desk — luxury flats and bungalows, high-street
                shops and showrooms, Grade A warehouses and MIDC land. Tap any listing to view it
                full size.
              </p>
            </div>
            <p className="text-sm text-muted-foreground shrink-0">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
              {CREATIVES.length} listings
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
            <div className="flex flex-wrap gap-2">
              {SEGMENT_FILTERS.map((option) => (
                <Badge
                  key={option.value}
                  variant={segment === option.value ? "default" : "outline"}
                  onClick={() => setSegment(option.value)}
                  className={`rounded-full px-4 py-1.5 text-sm cursor-pointer transition-colors ${
                    segment === option.value
                      ? "bg-primary text-white"
                      : "hover:bg-primary hover:text-white"
                  }`}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
            <Tabs
              value={deal}
              onValueChange={(v) => setDeal(v as Deal | "all")}
              className="w-full sm:w-[260px] sm:ml-auto"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="buy">For Sale</TabsTrigger>
                <TabsTrigger value="rent">For Rent</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 md:px-8 mt-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Building2 size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No featured listings in this combination</p>
            <p className="text-sm mt-1">Try another category or availability.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSegment("all");
                setDeal("all");
              }}
            >
              Show all listings
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((creative, index) => (
              <motion.article
                key={creative.file}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index, 7) * 0.04 }}
                className="bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col group"
              >
                <button
                  type="button"
                  onClick={() => setLightbox(index)}
                  aria-label={`View ${creative.title} in ${creative.location} full size`}
                  className="relative w-full aspect-[2/3] bg-secondary/40 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {/* object-contain, not cover: these creatives carry pricing and
                      contact details right to the edge, so nothing may be cropped. */}
                  <img
                    src={imageUrl(creative)}
                    alt={`${creative.title} — ${creative.location}`}
                    loading={index < 4 ? "eager" : "lazy"}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
                    <Badge className="bg-white/90 text-foreground hover:bg-white/90 font-bold backdrop-blur-sm shadow-sm">
                      {SEGMENT_LABELS[creative.segment]}
                    </Badge>
                    <Badge
                      className={`backdrop-blur-sm shadow-sm text-[10px] text-white ${
                        creative.deal === "buy"
                          ? "bg-primary/90 hover:bg-primary/90"
                          : "bg-green-600/90 hover:bg-green-600/90"
                      }`}
                    >
                      {creative.deal === "buy" ? "For Sale" : "For Rent"}
                    </Badge>
                  </div>
                  <span className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center">
                    <span className="flex items-center gap-2 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 size={16} /> View full size
                    </span>
                  </span>
                </button>

                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-base font-serif font-bold text-foreground leading-snug mb-2 line-clamp-2">
                    {creative.title}
                  </h2>
                  <p className="text-muted-foreground text-sm flex items-center gap-1 mb-4">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{creative.location}</span>
                  </p>

                  <dl className="grid grid-cols-2 gap-2 bg-secondary/50 p-3 rounded-md mb-3">
                    <div className="min-w-0">
                      <dt className="text-xs text-muted-foreground">Area</dt>
                      <dd className="font-semibold text-sm truncate">{creative.area}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs text-muted-foreground">
                        {creative.deal === "buy" ? "Price" : "Rent"}
                      </dt>
                      <dd className="font-semibold text-sm text-primary truncate">
                        {creative.price}
                      </dd>
                    </div>
                  </dl>

                  <p className="text-xs text-muted-foreground mb-5 line-clamp-2">{creative.note}</p>

                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      onClick={() => setLightbox(index)}
                      className="flex-1 text-primary border-primary hover:bg-primary hover:text-white h-10"
                    >
                      View
                    </Button>
                    <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-white h-10">
                      <Link href={`/contact?interest=${interestFor(creative)}`}>
                        <PhoneCall size={16} className="mr-2" /> Enquire
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Closing CTA */}
        <div className="mt-14 bg-foreground text-white rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-serif font-bold mb-2">Looking for something else?</h2>
            <p className="text-white/70 text-sm max-w-xl">
              New mandates come in every week and many never reach the website. Tell us your
              requirement and we will send matching options directly.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            {contact.phonePrimary && (
              <Button
                asChild
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white h-12 px-6"
              >
                <a href={`tel:${phoneDigits(contact.phonePrimary)}`}>
                  <PhoneCall size={16} className="mr-2" /> {contact.phonePrimary}
                </a>
              </Button>
            )}
            {features.whatsappWidget && contact.whatsapp && (
              <Button asChild className="bg-[#25D366] hover:bg-[#25D366]/90 text-white h-12 px-6">
                <a
                  href={`https://wa.me/${phoneDigits(contact.whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiWhatsapp size={18} className="mr-2" /> WhatsApp us
                </a>
              </Button>
            )}
            <Button asChild className="bg-primary hover:bg-primary/90 text-white h-12 px-6">
              <Link href="/contact">Post Requirement</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex flex-col"
          onClick={close}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white/80 text-sm shrink-0">
            <span>
              {(lightbox ?? 0) + 1} / {filtered.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          <div
            className="flex-1 flex items-center justify-center gap-2 px-2 md:px-6 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous listing"
              className="hidden sm:flex p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
            >
              <ChevronLeft size={24} />
            </button>

            <img
              src={imageUrl(active)}
              alt={`${active.title} — ${active.location}`}
              className="max-h-full max-w-full object-contain rounded-md shadow-2xl"
            />

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next listing"
              className="hidden sm:flex p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div
            className="shrink-0 bg-black/60 border-t border-white/10 px-4 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container mx-auto flex flex-col md:flex-row md:items-center gap-4">
              <div className="min-w-0">
                <h2 className="text-white font-serif font-bold text-lg truncate">{active.title}</h2>
                <p className="text-white/60 text-sm flex flex-wrap items-center gap-1.5 mt-0.5">
                  <MapPin size={14} className="shrink-0" /> {active.location}
                  <span className="text-white/30">|</span> {active.area}
                  <span className="text-white/30">|</span>
                  <span className="text-white font-semibold">{active.price}</span>
                </p>
              </div>
              <div className="flex gap-2 md:ml-auto shrink-0">
                {/* Mobile has no side arrows — keep paging reachable there. */}
                <Button
                  variant="outline"
                  onClick={() => step(-1)}
                  aria-label="Previous listing"
                  className="sm:hidden border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                >
                  <ChevronLeft size={18} />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => step(1)}
                  aria-label="Next listing"
                  className="sm:hidden border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                >
                  <ChevronRight size={18} />
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                >
                  <a href={imageUrl(active)} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} className="mr-2" /> Open image
                  </a>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                  <Link href={`/contact?interest=${interestFor(active)}`}>
                    <PhoneCall size={16} className="mr-2" /> Enquire
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
