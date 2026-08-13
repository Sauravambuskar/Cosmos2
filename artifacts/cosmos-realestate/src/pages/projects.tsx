import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Building, ChevronRight, Download, CheckCircle, Play, Pause, Clock, Ruler, Award, Factory, ChevronDown, Warehouse, Truck, Layers, FileText, Trees, Users, Monitor, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchProjects, projectImage } from "@/lib/api";
import { matchesProjectQuery } from "@/lib/search";
import ListingSearch from "@/components/listing-search";
import Seo from "@/components/seo";
import { PAGE_SEO, breadcrumbSchema } from "@/lib/seo";

const PROJECT_TYPES = ["All", "Residential", "Commercial", "Industrial"] as const;
const PROJECT_STATUSES = ["All", "Completed", "Ongoing", "Upcoming"] as const;

const featuredStats = [
  { icon: Ruler,   label: "Total Area",        value: "19,000 Sq. Ft." },
  { icon: Clock,   label: "Delivered In",       value: "12 Months"        },
  { icon: Factory, label: "Development Type",   value: "Grade-A Industrial" },
  { icon: Award,   label: "Project Basis",      value: "EPC Turnkey"      },
];

const esrStats = [
  { icon: MapPin,   label: "Location",      value: "Talegaon"                 },
  { icon: Award,    label: "Park Standard", value: "Grade-A"                  },
  { icon: Factory,  label: "Park Type",     value: "Industrial & Logistics"   },
  { icon: Building, label: "Connectivity",  value: "Mumbai–Pune Expressway"   },
];

function VimeoEmbed() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    function initPlayer() {
      if (!iframeRef.current) return;
      const VimeoPlayer = (window as any).Vimeo?.Player;
      if (!VimeoPlayer) return;
      playerRef.current = new VimeoPlayer(iframeRef.current);
      playerRef.current.on("play",  () => setIsPlaying(true));
      playerRef.current.on("pause", () => setIsPlaying(false));
      playerRef.current.on("ended", () => setIsPlaying(false));
    }
    if ((window as any).Vimeo) {
      initPlayer();
    } else {
      const script = document.createElement("script");
      script.src   = "https://player.vimeo.com/api/player.js";
      script.async = true;
      script.onload = initPlayer;
      document.head.appendChild(script);
    }
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    isPlaying ? playerRef.current.pause() : playerRef.current.play();
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-md bg-black cursor-pointer"
      style={{ paddingTop: "56.86%" }}
      onClick={togglePlay}
    >
      <iframe
        ref={iframeRef}
        src="https://player.vimeo.com/video/1207352854?badge=0&autopause=0&player_id=0&app_id=58479&controls=0&title=0&byline=0&portrait=0"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        title="Rohit Aurora Industrial Park"
      />
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        {!isPlaying && (
          <div className="bg-white/25 backdrop-blur-sm rounded-full p-5 border border-white/50 hover:bg-white/35 transition-all shadow-xl">
            <Play size={30} className="text-white fill-white ml-1" />
          </div>
        )}
      </div>
      {/* Play / Pause pill */}
      <div className="absolute bottom-3 left-3 bg-black/55 hover:bg-black/75 backdrop-blur-sm text-white rounded-full px-4 py-1.5 flex items-center gap-1.5 text-xs font-semibold shadow transition-all pointer-events-none">
        {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-px" />}
        {isPlaying ? "Pause" : "Play"}
      </div>
    </div>
  );
}

const malpaniShedDetails = [
  { label: "Status", value: "Under Construction — Dry Access in August 2026", icon: Clock },
  { label: "Size", value: "2,43,722 sq.ft.", icon: Ruler },
  { label: "Docks", value: "19 nos.", icon: Truck },
  { label: "Floor", value: "FM2 with 5 tonne/sqm load bearing capacity", icon: Layers },
  { label: "Height", value: "12 mtrs clear height", icon: Warehouse },
  { label: "Documents", value: "All statutory compliances", icon: FileText },
];

const malpaniAmenities = [
  { label: "Business Center", desc: "with all facilities", icon: Monitor },
  { label: "Dedicated Training Room", icon: Users },
  { label: "Staff Room", icon: Coffee },
  { label: "Green Zone", desc: "with Miyawaki forest", icon: Trees },
  { label: "Drivers Rest Room", icon: Users },
];

function MalpaniShedA4Card() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-border"
    >
      {/* Banner */}
      <div className="relative h-56 md:h-72 overflow-hidden bg-foreground">
        <img
          src="/images/malpani-shed-a4.png"
          alt="Malpani Industrial and Logistic Park — Shed A4"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <Badge className="bg-orange-500 hover:bg-orange-500 text-white w-fit mb-3 text-xs">
            Under Construction
          </Badge>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight mb-1">
            Malpani Industrial &amp; Logistic Park — Shed A4
          </h2>
          <p className="text-white/75 text-sm flex items-center gap-1.5">
            <MapPin size={13} />
            Ambethan, Chakan &nbsp;·&nbsp; 61 Acres &nbsp;·&nbsp; 1.45 Million SqFt Development Potential
          </p>
        </div>
      </div>

      {/* Summary row */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-secondary/50 border border-border rounded-xl p-4">
            <p className="text-muted-foreground text-xs font-medium mb-0.5">Project Size</p>
            <p className="text-foreground font-bold text-sm">61 Acres</p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-xl p-4">
            <p className="text-muted-foreground text-xs font-medium mb-0.5">Total Sheds</p>
            <p className="text-foreground font-bold text-sm">8 Sheds</p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-xl p-4">
            <p className="text-muted-foreground text-xs font-medium mb-0.5">Shed A4 Size</p>
            <p className="text-foreground font-bold text-sm">2,43,722 sq.ft.</p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-xl p-4">
            <p className="text-muted-foreground text-xs font-medium mb-0.5">Dry Access</p>
            <p className="text-foreground font-bold text-sm">August 2026</p>
          </div>
        </div>

        <p className="text-foreground/75 leading-relaxed mb-6 text-[15px]">
          <span className="font-semibold text-foreground">Shed A4</span> at Malpani Industrial &amp; Logistic Park 
          is a <span className="font-semibold text-foreground">2,43,722 sq.ft.</span> warehouse currently under construction, 
          available for dry access in <span className="font-semibold text-foreground">August 2026</span>. 
          The park spans 61 acres with a total development potential of 1.45 million sq.ft. and offers 
          Grade-A infrastructure with world-class amenities.
        </p>

        {/* Expand / Collapse toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline transition-colors mb-2"
        >
          {expanded ? "Hide Details" : "View Full Details"}
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        {/* Expandable details */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-6 border-t mt-4 space-y-8">

                {/* Shed 4 Details Table */}
                <div>
                  <h3 className="font-serif font-bold text-lg text-foreground mb-4">Shed A4 Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {malpaniShedDetails.map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-start gap-3 bg-secondary/40 border border-border rounded-lg p-4">
                        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm shrink-0">
                          <Icon size={17} />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">{label}</p>
                          <p className="text-sm font-bold text-foreground">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenity Highlights */}
                <div>
                  <h3 className="font-serif font-bold text-lg text-foreground mb-4">Amenity Highlights</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {malpaniAmenities.map(({ label, desc, icon: Icon }) => (
                      <div key={label} className="flex flex-col items-center text-center bg-secondary/30 border border-border rounded-xl p-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                          <Icon size={22} />
                        </div>
                        <p className="text-xs font-semibold text-foreground leading-tight">{label}</p>
                        {desc && <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="bg-primary text-white hover:bg-primary/90 h-11 px-6 text-sm font-semibold">
                    <Link href="/contact?interest=industrial">Enquire About Shed A4</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white h-11 px-6 text-sm font-semibold">
                    <a href="tel:+919823056983">
                      Call: +91 98230 56983
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [query, setQuery] = useState("");

  // Projects are managed entirely from the admin CMS — this is the single
  // source of truth, so edits there appear here without a code change.
  const { data: apiProjects = [], isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

  const projects = apiProjects.filter((p) => {
    if (typeFilter !== "All" && p.type !== typeFilter) return false;
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    if (!matchesProjectQuery(p, query)) return false;
    return true;
  });

  return (
    <div className="bg-secondary/20 min-h-screen pb-20">
      <Seo
        {...PAGE_SEO.projects}
        schemas={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
          ]),
        ]}
      />

      {/* Page header */}
      <div className="bg-foreground text-white pt-16 pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="font-medium text-white">Projects</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Signature Projects</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Discover Cosmos Real Estate's portfolio of landmark residential, commercial, and industrial developments across Pune.
          </p>
        </div>
      </div>

      {/* ── Featured Project ─────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 md:px-8">

          {/* Section label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-0.5 w-8 bg-primary rounded-full" />
            <span className="text-primary font-semibold text-xs uppercase tracking-[0.18em]">Featured Project</span>
          </div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-border"
          >
            {/* Banner image with project title overlaid */}
            <div className="relative h-56 md:h-72 overflow-hidden">
              <img
                src="/images/ind-1.png"
                alt="Rohit Aurora Industrial Park"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <Badge className="bg-green-600 hover:bg-green-600 text-white w-fit mb-3 text-xs">
                  Delivered
                </Badge>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight mb-1">
                  Rohit Aurora Industrial Park
                </h2>
                <p className="text-white/75 text-sm flex items-center gap-1.5">
                  <MapPin size={13} />
                  Hinjewadi, Pune &nbsp;·&nbsp; Build-to-Suit EPC by Vivan Group
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">

              {/* Left — description + stats */}
              <div>
                <p className="text-foreground/75 leading-relaxed mb-7 text-[15px]">
                  A landmark <span className="font-semibold text-foreground">19,000 sq. ft.</span> Build-to-Suit
                  industrial development featuring a state-of-the-art industrial shed integrated with a modern office
                  building. Designed for operational efficiency, scalability, and corporate functionality — executed on
                  a turnkey EPC basis and delivered for a leading multinational corporation within 12 months.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {featuredStats.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="bg-secondary/50 border border-border rounded-xl p-4 flex flex-col gap-2"
                    >
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm shrink-0">
                        <Icon size={17} />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium mb-0.5">{label}</p>
                        <p className="text-foreground font-bold text-sm">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — video */}
              <div className="flex flex-col gap-3">
                <VimeoEmbed />
                <p className="text-muted-foreground text-xs text-center">
                  Click video or use the Play / Pause button to control
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ESR Talegaon Featured Property ───────────────────────── */}
      <section className="py-14 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-8">

          {/* Section label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-0.5 w-8 bg-primary rounded-full" />
            <span className="text-primary font-semibold text-xs uppercase tracking-[0.18em]">Featured Property</span>
          </div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-border"
          >
            {/* Banner */}
            <div className="relative h-56 md:h-72 overflow-hidden bg-foreground">
              <img
                src="/images/ind-2.png"
                alt="ESR Talegaon Industrial & Logistics Park"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/70 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <Badge className="bg-blue-600 hover:bg-blue-600 text-white w-fit mb-3 text-xs">
                  Grade-A Park
                </Badge>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight mb-1">
                  ESR Talegaon Industrial &amp; Logistics Park
                </h2>
                <p className="text-white/75 text-sm flex items-center gap-1.5">
                  <MapPin size={13} />
                  Talegaon &nbsp;·&nbsp; Mumbai–Pune Expressway Corridor
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">

              {/* Left — description + stats */}
              <div>
                <p className="text-foreground/75 leading-relaxed mb-7 text-[15px]">
                  Grade-A industrial and logistics park at Talegaon — strategically located on the{" "}
                  <span className="font-semibold text-foreground">Mumbai–Pune Expressway</span> corridor with
                  world-class infrastructure and connectivity.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-7">
                  {esrStats.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="bg-secondary/50 border border-border rounded-xl p-4 flex flex-col gap-2"
                    >
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm shrink-0">
                        <Icon size={17} />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium mb-0.5">{label}</p>
                        <p className="text-foreground font-bold text-sm">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="bg-primary text-white hover:bg-primary/90 h-11 px-6 text-sm font-semibold">
                  Enquire About ESR Talegaon
                </Button>
              </div>

              {/* Right — YouTube video */}
              <div className="flex flex-col gap-3">
                <div className="relative rounded-xl overflow-hidden shadow-md bg-black" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    src="https://www.youtube.com/embed/iq00NsX04dc?rel=0&modestbranding=1"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    title="ESR Talegaon Industrial & Logistics Park"
                  />
                </div>
                <p className="text-muted-foreground text-xs text-center">
                  ESR Talegaon — Industrial &amp; Logistics Park walkthrough
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Malpani Industrial & Logistic Park — Shed A4 ────────── */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 md:px-8">

          {/* Section label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-0.5 w-8 bg-primary rounded-full" />
            <span className="text-primary font-semibold text-xs uppercase tracking-[0.18em]">Featured Industrial</span>
          </div>

          <MalpaniShedA4Card />
        </div>
      </section>

      {/* ── All Projects ─────────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-8 mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-8 bg-primary rounded-full" />
            <span className="text-primary font-semibold text-xs uppercase tracking-[0.18em]">All Projects</span>
            {!isLoading && !isError && (
              <span className="text-muted-foreground text-xs">
                {projects.length} {projects.length === 1 ? "project" : "projects"}
              </span>
            )}
          </div>

          {/* Filters — driven by the same values the CMS uses */}
          <div className="flex flex-wrap items-center gap-2">
            <ListingSearch
              value={query}
              onChange={setQuery}
              placeholder="Search projects, developers, localities…"
              className="w-full sm:w-64"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter projects by type"
              className="border border-border bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter projects by status"
              className="border border-border bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-muted-foreground bg-white rounded-xl border border-dashed">
            <Building size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Couldn't load projects</p>
            <p className="text-sm mt-1">Please try again in a moment.</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground bg-white rounded-xl border border-dashed">
            <Building size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">
              {apiProjects.length === 0 ? "No projects published yet" : "No projects match these filters"}
            </p>
            <p className="text-sm mt-1">
              {apiProjects.length === 0
                ? "Projects added in the admin panel will appear here."
                : "Try widening your selection."}
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-border group hover:shadow-xl transition-shadow flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={projectImage(project)}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className={`absolute top-3 right-3 shadow-sm ${
                  project.status === 'Completed' ? 'bg-green-600 hover:bg-green-700 text-white' :
                  project.status === 'Ongoing'   ? 'bg-blue-600 hover:bg-blue-700 text-white'  :
                  'bg-orange-500 hover:bg-orange-600 text-white'
                }`}>
                  {project.status}
                </Badge>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                  <Badge variant="outline" className="text-white border-white/50 bg-black/30 backdrop-blur-sm">
                    {project.type}
                  </Badge>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">{project.name}</h3>
                <div className="flex items-center text-muted-foreground text-sm mb-4">
                  <MapPin size={14} className="mr-1" /> {project.location}
                </div>

                <div className="space-y-3 mb-6 bg-secondary/30 p-4 rounded-lg mt-auto">
                  <div className="flex items-start gap-2">
                    <Building size={16} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Inventory</p>
                      <p className="text-sm font-semibold">{project.units}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Highlights</p>
                      <p className="text-sm font-semibold">{project.highlights}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1 text-primary border-primary hover:bg-primary hover:text-white h-10">
                    <Link href={`/projects/${project.id}`}>View</Link>
                  </Button>
                  {project.brochureUrl ? (
                    <Button asChild className="flex-1 bg-primary text-white hover:bg-primary/90 h-10">
                      <a href={project.brochureUrl} target="_blank" rel="noopener noreferrer">
                        <Download size={16} className="mr-2" /> Brochure
                      </a>
                    </Button>
                  ) : (
                    <Button asChild className="flex-1 bg-primary text-white hover:bg-primary/90 h-10">
                      <Link href={`/projects/${project.id}`}>
                        <Download size={16} className="mr-2" /> Brochure
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
