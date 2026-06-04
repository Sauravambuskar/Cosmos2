import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    title: "20,000 sqft Industrial Shed — Hinjawadi",
    location: "Hinjawadi, Pune",
    category: "Industrial & Logistics",
    status: "Available",
    highlight: "Rent: ₹3,90,000/mo",
    description: "20,000 sqft construction over a 22,000 sq ft plot. Ground floor 15,000 sqft + first floor 5,000 sqft. 6-month deposit. Ideal for manufacturing & warehousing.",
    image: "/projects/hinjawadi-shed.jpg",
    link: "https://jatinaroraprojects.wordpress.com/2023/11/30/20000-sqft-shed-for-rent-hinjawadi-pune/",
  },
  {
    id: 2,
    title: "1 Acre Plot for Sale — Sinhagad Road",
    location: "Sinhagad Road, Pune",
    category: "Residential / Land",
    status: "Available",
    highlight: "₹6.5 Cr",
    description: "On the foothills of Sinhagad Road — main road touch, landscaped access, 3 sides covered by resort. 1,600 sq ft bungalow sanctioned by PMRDA.",
    image: "/projects/sinhagad-road-land.jpg",
    link: "https://jatinaroraprojects.wordpress.com/2023/11/28/1-acre-plot-for-sale-at-sinhaghad-road-pune/",
  },
  {
    id: 3,
    title: "Office & Retail Spaces — Kalyani Nagar",
    location: "Kalyani Nagar, Pune",
    category: "Commercial",
    status: "Available",
    highlight: "704 sq.ft. onwards",
    description: "Integrated Business Ecosystem offering Core (704 sqft), Corner (2,000 sqft) and Corporate (16,500 sqft) offices. 15 min from Airport, close to Kharadi & Koregaon Park.",
    image: "/projects/kalyani-nagar-office.jpg",
    link: "https://jatinaroraprojects.wordpress.com/2023/01/10/office-retail-space-for-sale-at-kalyani-nagar-pune/",
  },
  {
    id: 4,
    title: "Commercial Spaces & Showrooms — Koregaon Park",
    location: "Koregaon Park, Pune",
    category: "Commercial",
    status: "Completed",
    highlight: "384–4115 Sq.ft",
    description: "Commercial spaces, corporate offices and showrooms ranging 384–4,115 sq ft in the heart of Koregaon Park. Multiple floor plans across all levels.",
    image: "/projects/koregaon-park-commercial.jpeg",
    link: "https://jatinaroraprojects.wordpress.com/2023/01/09/commercial-spaces-corporate-offices-showrooms-at-koregaon-park-pune/",
  },
  {
    id: 5,
    title: "Corporate Offices & Co-working — Koregaon Park NX",
    location: "Koregaon Park NX, Pune",
    category: "Commercial",
    status: "Completed",
    highlight: "EV Charging | 12-pax Lift",
    description: "RCC framed PT slab structure, double-glazed high-performance glass facade, VRF provisions, EV charging, STP, rainwater harvesting — world-class specifications.",
    image: "/projects/koregaon-park-nx.jpg",
    link: "https://jatinaroraprojects.wordpress.com/2023/01/08/corporate-offices-co-working-spaces-expansive-showrooms-exclusive-retail-at-koregaon-park-pune/",
  },
  {
    id: 6,
    title: "5-Acre Industrial Facility — Patal Ganga, Navi Mumbai",
    location: "Patal Ganga, Navi Mumbai",
    category: "Industrial & Logistics",
    status: "Available",
    highlight: "1,25,000 sq ft",
    description: "Pre-engineered Tata Bluescope building on 5 acres near JNPT port. 3 x 5-ton cranes, 9-in/9-out lorry docking, 45m state highway frontage. Clean documentation.",
    image: "/projects/patal-ganga-industrial.jpeg",
    link: "https://jatinaroraprojects.wordpress.com/2022/01/15/industrial-facility-5-acre-facility-patal-ganga-navi-mumbai/",
  },
  {
    id: 7,
    title: "Luxury Bungalow for Lease — Kalyani Nagar",
    location: "Kalyani Nagar, Pune",
    category: "Residential",
    status: "Available",
    highlight: "4.5 BHK | 3,500 sq ft",
    description: "5,000 sq ft plot with 3,500 sq ft built-up. 4.5 bedrooms, 4 baths, family lounge, multipurpose basement (gym/home theatre), servant room, CCTV surveillance.",
    image: "/projects/kalyani-nagar-bungalow.jpeg",
    link: "https://jatinaroraprojects.wordpress.com/2022/01/15/bungalow-for-lease-rent-kalyani-nagar-pune/",
  },
  {
    id: 8,
    title: "6.5 BHK Apartment — Sopan Baug",
    location: "Sopan Baug, Pune",
    category: "Residential",
    status: "Available",
    highlight: "₹6.10 Cr",
    description: "Well-furnished 6.5 BHK apartment of 4,130 sqft at the prestigious Sopan Baug Society. One of Pune's most sought-after addresses.",
    image: "/projects/sopan-baug-apartment.jpg",
    link: "https://jatinaroraprojects.wordpress.com/2020/11/09/6-5-bhk-apartment-for-sale-at-sopan-baug-society-pune/",
  },
  {
    id: 9,
    title: "IT Park SEZ — Kharadi",
    location: "Kharadi, Pune",
    category: "Commercial",
    status: "Completed",
    highlight: "Pune's Eastern IT Corridor",
    description: "Landmark commercial space in Kharadi's eastern IT corridor — world-class design, robust infrastructure and superior support services.",
    image: "/projects/kharadi-it-park.jpg",
    link: "https://jatinaroraprojects.wordpress.com/2020/01/18/commercial-business-space-it-park-sez-kharadi-pune/",
  },
  {
    id: 10,
    title: "SEZ for IT/ITES Companies — Hinjawadi Phase 3",
    location: "Hinjawadi, Pune",
    category: "Commercial",
    status: "Completed",
    highlight: "13 Acres | 1.8 M sq.ft",
    description: "SEZ in Hinjawadi Phase 3 spread over 13 acres with 1.8 million sq.ft development potential in Pune's premier IT destination.",
    image: "/projects/hinjawadi-sez.jpeg",
    link: "https://jatinaroraprojects.wordpress.com/2020/01/16/commercial-space-for-software-it-companies-offices-at-sez-hinjawadi-pune/",
  },
];

const categoryColors: Record<string, string> = {
  "Residential": "bg-emerald-700",
  "Residential / Land": "bg-emerald-700",
  "Commercial": "bg-blue-700",
  "Industrial & Logistics": "bg-amber-700",
};

const statusColors: Record<string, string> = {
  "Available": "bg-primary text-primary-foreground",
  "Completed": "bg-secondary text-secondary-foreground",
  "Ongoing": "bg-blue-600 text-white",
};

export default function Projects() {
  return (
    <div className="w-full pt-28 pb-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">
            Real Portfolio
          </span>
          <h1 className="text-5xl font-serif font-bold text-foreground mb-6">
            Signature Projects
          </h1>
          <p className="text-lg text-muted-foreground">
            A curated showcase of Pune's finest residential, commercial and industrial real estate — hand-picked and managed by Cosmos Real Estate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index % 2 === 0 ? 0 : 0.2 }}
              className="group"
              data-testid={`card-project-${project.id}`}
            >
              <div className="relative h-[380px] overflow-hidden mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                  <span className={`${categoryColors[project.category] ?? "bg-gray-700"} text-white px-3 py-1 text-xs font-bold tracking-wider uppercase`}>
                    {project.category}
                  </span>
                  <span className={`${statusColors[project.status] ?? "bg-gray-600 text-white"} px-3 py-1 text-xs font-bold tracking-wider uppercase`}>
                    {project.status}
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="text-primary font-bold text-sm tracking-wider bg-black/60 px-3 py-1 backdrop-blur-sm">
                    {project.highlight}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground mb-4 font-medium">
                  <MapPin size={16} className="text-primary flex-shrink-0" />
                  <span>{project.location}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-5">{project.description}</p>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <button
                    className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    data-testid={`link-project-${project.id}`}
                  >
                    View Full Details <ExternalLink size={14} />
                  </button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center bg-muted/40 border border-border p-12"
        >
          <h3 className="text-2xl font-serif font-bold mb-4">
            Looking for a Specific Property?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We have a wider portfolio across Pune covering residential, commercial, and industrial segments. Get in touch with Jatin Arora directly.
          </p>
          <a href="https://wa.me/919325097835" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="rounded-none px-10" data-testid="button-whatsapp-projects">
              Chat on WhatsApp
            </Button>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
