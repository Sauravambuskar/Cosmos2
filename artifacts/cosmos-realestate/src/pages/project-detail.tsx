import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, ChevronRight, Building, CheckCircle, Download, Calendar, Ruler, Award, Play, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchProject } from "@/lib/api";
import type { Project } from "@/lib/types";

// Fallback project data — mirrors the listing page so "View" always works
const fallbackProjects: Partial<Project>[] = [
  { id: 1, name: "Malpani Industrial & Logistic Park — Shed A4", location: "Ambethan, Chakan", type: "Industrial", status: "Upcoming", units: "2,43,722 sq.ft.", highlights: "61 Acres, 19 Docks, 12m Clear Height, FM2 Floor, Miyawaki Forest", image: "/images/malpani-shed-a4.png", description: "Shed A4 at Malpani Industrial & Logistic Park is a 2,43,722 sq.ft. Grade-A warehouse currently under construction at Ambethan, Chakan. Available for dry access in August 2026. The park spans 61 acres with a total development potential of 1.45 million sq.ft. and 8 sheds. Features 19 docks, FM2 flooring with 5 tonne/sqm load bearing capacity, and 12 metres clear height. All statutory compliances in place.", amenities: ["Business Center with All Facilities", "Dedicated Training Room", "Staff Room", "Green Zone with Miyawaki Forest", "Drivers Rest Room", "19 Loading Docks", "FM2 Floor (5 tonne/sqm)", "12m Clear Height"], area: "2,43,722 sq.ft.", possession: "Dry Access: August 2026", priceRange: "On Request", developer: "Malpani Group" },
  { id: 2, name: "Cosmos Grandeur", location: "Koregaon Park, Pune", type: "Residential", status: "Completed", units: "42 Exclusive Units", highlights: "Private Pools, Home Automation, Italian Marble Flooring, Smart Home System", image: "/images/proj-1.png", description: "An ultra-luxury residential development in Pune's most coveted neighborhood. Cosmos Grandeur features 42 exclusive units with private pools, state-of-the-art home automation, Italian marble flooring, and panoramic views of Koregaon Park.", amenities: ["Private Pool", "Home Automation", "Italian Marble Flooring", "24/7 Concierge", "Landscaped Gardens", "Clubhouse", "Gym & Spa", "Underground Parking"], area: "4,500 - 6,200 sq.ft.", possession: "Delivered", priceRange: "3.5 Cr - 8.5 Cr", developer: "Cosmos Real Estate" },
  { id: 3, name: "Cosmos Business Hub", location: "Baner, Pune", type: "Commercial", status: "Ongoing", units: "120 Office Spaces", highlights: "LEED Certified, Smart Parking, High-Speed Elevators, Food Court", image: "/images/com-2.png", description: "A LEED-certified commercial development offering 120 premium office spaces in the heart of Baner's IT corridor. Designed for modern businesses with smart parking, high-speed elevators, a food court, and conference facilities.", amenities: ["LEED Certified", "Smart Parking", "High-Speed Elevators", "Food Court", "Conference Rooms", "Power Backup", "Fire Safety", "24/7 Security"], area: "500 - 5,000 sq.ft.", possession: "December 2025", priceRange: "85 L - 5.5 Cr", developer: "Cosmos Real Estate" },
  { id: 4, name: "Cosmos Logistics Park", location: "Chakan, Pune", type: "Industrial", status: "Upcoming", units: "5 Million SqFt", highlights: "Grade-A Warehousing, 24/7 Security, Truck Parking, Fire Safety Systems", image: "/images/ind-2.png", description: "A massive Grade-A logistics and warehousing park spread over 100 acres at Chakan, Pune's premier industrial corridor. Offering 5 million sq.ft. of warehousing with world-class infrastructure, 24/7 security, ample truck parking, and advanced fire safety systems.", amenities: ["Grade-A Warehouse", "24/7 Security", "Truck Parking", "Fire Safety", "Power Backup", "ETP & STP", "Canteen", "Driver Rest Rooms"], area: "50,000 - 5,00,000 sq.ft.", possession: "Phase 1: March 2026", priceRange: "On Request", developer: "Cosmos Real Estate" },
  { id: 5, name: "Cosmos Heights", location: "Kalyani Nagar, Pune", type: "Residential", status: "Completed", units: "80 Premium Flats", highlights: "Clubhouse, Infinity Pool, Gymnasium, Children's Play Area", image: "/images/res-1.png", description: "Premium residential tower in the heart of Kalyani Nagar offering 80 thoughtfully designed flats with world-class amenities including an infinity pool, modern clubhouse, and lush landscaping.", amenities: ["Infinity Pool", "Clubhouse", "Gymnasium", "Children's Play Area", "Jogging Track", "Indoor Games", "Party Hall", "Visitor Parking"], area: "1,200 - 2,800 sq.ft.", possession: "Delivered", priceRange: "1.2 Cr - 3.5 Cr", developer: "Cosmos Real Estate" },
  { id: 6, name: "Cosmos Retail Square", location: "Viman Nagar, Pune", type: "Commercial", status: "Completed", units: "45 Retail Shops", highlights: "High Footfall, Anchor Stores, Central Atrium, Basement Parking", image: "/images/com-3.png", description: "A bustling retail destination in Viman Nagar featuring 45 premium shops, high footfall, anchor stores, and a stunning central atrium. Perfect for retail businesses looking for prime visibility.", amenities: ["High Footfall Area", "Central Atrium", "Anchor Stores", "Basement Parking", "Escalators", "Power Backup", "CCTV Surveillance", "Fire Safety"], area: "300 - 3,000 sq.ft.", possession: "Delivered", priceRange: "65 L - 4 Cr", developer: "Cosmos Real Estate" },
  { id: 7, name: "Cosmos Villas", location: "Aundh, Pune", type: "Residential", status: "Ongoing", units: "15 Luxury Bungalows", highlights: "Gated Community, Private Gardens, Smart Homes, Premium Finishes", image: "/images/res-2.png", description: "An exclusive gated community of 15 luxury bungalows in Aundh, featuring private gardens, smart home technology, and premium European finishes. Each villa is a statement of luxury and privacy.", amenities: ["Private Garden", "Smart Home", "Gated Community", "Swimming Pool", "Clubhouse", "Tennis Court", "Jogging Path", "24/7 Security"], area: "3,500 - 5,500 sq.ft.", possession: "June 2026", priceRange: "4.5 Cr - 9 Cr", developer: "Cosmos Real Estate" },
  { id: 8, name: "Cosmos IT Park", location: "Kharadi, Pune", type: "Commercial", status: "Upcoming", units: "2 IT Towers", highlights: "Food Court, Co-working Zones, Green Building, Sky Lounge", image: "/images/proj-2.png", description: "Twin IT towers in Kharadi's tech corridor, designed for the future of work. Features dedicated co-working zones, a food court, sky lounge, and green building certification for sustainability-conscious companies.", amenities: ["Co-working Zones", "Food Court", "Sky Lounge", "Green Building", "Smart Parking", "Gym", "Conference Center", "High-Speed Internet"], area: "1,000 - 50,000 sq.ft.", possession: "Q4 2026", priceRange: "On Request", developer: "Cosmos Real Estate" },
  { id: 9, name: "Cosmos Riverfront", location: "Mundhwa, Pune", type: "Residential", status: "Upcoming", units: "200 Waterfront Apartments", highlights: "River Views, Jogging Track, Amphitheatre, Landscaped Promenade", image: "/images/proj-3.png", description: "A stunning riverside residential project in Mundhwa offering 200 waterfront apartments with breathtaking river views, a landscaped promenade, jogging track, and amphitheatre for community events.", amenities: ["River Views", "Jogging Track", "Amphitheatre", "Landscaped Promenade", "Swimming Pool", "Gym", "Kids Zone", "Yoga Deck"], area: "900 - 2,200 sq.ft.", possession: "Q2 2027", priceRange: "90 L - 2.8 Cr", developer: "Cosmos Real Estate" },
];

function getFallbackProject(id: number): Project | null {
  const p = fallbackProjects.find((fp) => fp.id === id);
  if (!p) return null;
  return {
    id: p.id!,
    name: p.name || "",
    description: p.description || "",
    location: p.location || "",
    type: p.type || "",
    status: p.status || "",
    units: p.units || "",
    highlights: p.highlights || "",
    image: p.image || "",
    brochureUrl: "",
    videoUrl: "",
    area: p.area || "",
    amenities: p.amenities || [],
    gallery: [],
    rera: "",
    possession: p.possession || "",
    priceRange: p.priceRange || "",
    developer: p.developer || "",
    featured: false,
    active: true,
    createdAt: "",
    updatedAt: "",
  } as Project;
}

export default function ProjectDetail() {
  const params = useParams<{ id: string }>();
  const projectId = parseInt(params.id, 10);

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      try {
        return await fetchProject(projectId);
      } catch {
        // If API fails (e.g. no DB data), use fallback
        const fb = getFallbackProject(projectId);
        if (fb) return fb;
        throw new Error("Project not found");
      }
    },
    enabled: !isNaN(projectId),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/20 gap-4">
        <h2 className="text-2xl font-serif font-bold text-foreground">Project Not Found</h2>
        <p className="text-muted-foreground">The project you're looking for doesn't exist or has been removed.</p>
        <Button asChild variant="outline">
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  const statusColor = project.status === "Completed"
    ? "bg-green-600 text-white"
    : project.status === "Ongoing"
    ? "bg-blue-600 text-white"
    : "bg-orange-500 text-white";

  return (
    <div className="bg-secondary/20 min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={project.image || "/images/proj-1.png"}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 container mx-auto">
          <div className="flex items-center text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-1" />
            <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-white font-medium">{project.name}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Badge className={`${statusColor} shadow-sm`}>{project.status}</Badge>
            <Badge variant="outline" className="text-white border-white/50 bg-black/30 backdrop-blur-sm">
              {project.type}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">{project.name}</h1>
          <p className="text-white/80 flex items-center gap-2 text-lg">
            <MapPin size={18} /> {project.location}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-border"
            >
              <h2 className="text-xl font-serif font-bold text-foreground mb-4">About This Project</h2>
              <p className="text-foreground/75 leading-relaxed whitespace-pre-line">
                {project.description || "A premium development by Cosmos Real Estate, designed with modern living and top-quality amenities in mind."}
              </p>
            </motion.div>

            {/* Key Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-border"
            >
              <h2 className="text-xl font-serif font-bold text-foreground mb-4">Project Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.units && (
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Building size={16} />
                      <span className="text-xs text-muted-foreground font-medium">Inventory</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{project.units}</p>
                  </div>
                )}
                {project.area && (
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Ruler size={16} />
                      <span className="text-xs text-muted-foreground font-medium">Total Area</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{project.area}</p>
                  </div>
                )}
                {project.possession && (
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Calendar size={16} />
                      <span className="text-xs text-muted-foreground font-medium">Possession</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{project.possession}</p>
                  </div>
                )}
                {project.priceRange && (
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Award size={16} />
                      <span className="text-xs text-muted-foreground font-medium">Price Range</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{project.priceRange}</p>
                  </div>
                )}
                {project.rera && (
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <CheckCircle size={16} />
                      <span className="text-xs text-muted-foreground font-medium">RERA No.</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{project.rera}</p>
                  </div>
                )}
                {project.developer && (
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Building size={16} />
                      <span className="text-xs text-muted-foreground font-medium">Developer</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{project.developer}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Highlights */}
            {project.highlights && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-border"
              >
                <h2 className="text-xl font-serif font-bold text-foreground mb-4">Highlights</h2>
                <div className="flex flex-wrap gap-2">
                  {project.highlights.split(",").map((h, i) => (
                    <Badge key={i} variant="secondary" className="text-sm py-1.5 px-3">
                      <CheckCircle size={14} className="mr-1.5 text-primary" />
                      {h.trim()}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-border"
              >
                <h2 className="text-xl font-serif font-bold text-foreground mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.amenities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                      <CheckCircle size={14} className="text-primary shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-border"
              >
                <h2 className="text-xl font-serif font-bold text-foreground mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.gallery.map((img, i) => (
                    <img key={i} src={img} alt={`${project.name} - ${i + 1}`} className="w-full h-40 object-cover rounded-lg" />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Video */}
            {project.videoUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-border"
              >
                <h2 className="text-xl font-serif font-bold text-foreground mb-4">Project Video</h2>
                <div className="relative rounded-xl overflow-hidden bg-black" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    src={project.videoUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    title={project.name}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-border sticky top-6"
            >
              <h3 className="font-serif font-bold text-lg text-foreground mb-4">Interested in this project?</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Get in touch with our team for pricing, floor plans, and site visits.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full bg-primary text-white hover:bg-primary/90 h-11">
                  <Link href={`/contact?interest=${project.type.toLowerCase()}`}>
                    <Phone size={16} className="mr-2" /> Enquire Now
                  </Link>
                </Button>
                {project.brochureUrl && (
                  <Button asChild variant="outline" className="w-full h-11 border-primary text-primary hover:bg-primary hover:text-white">
                    <a href={project.brochureUrl} target="_blank" rel="noopener noreferrer">
                      <Download size={16} className="mr-2" /> Download Brochure
                    </a>
                  </Button>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Call us directly</p>
                <a href="tel:+919823056983" className="text-primary font-bold text-lg hover:underline">
                  +91 98230 56983
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
