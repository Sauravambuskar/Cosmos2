import { motion } from "framer-motion";
import { Link } from "wouter";
import { MapPin, Building, ChevronRight, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const projects = [
  { id: 1, name: "Cosmos Grandeur", location: "Koregaon Park, Pune", type: "Residential", status: "Completed", units: "42 Exclusive Units", highlights: "Private Pools, Home Automation", image: "/images/proj-1.png" },
  { id: 2, name: "Cosmos Business Hub", location: "Baner, Pune", type: "Commercial", status: "Ongoing", units: "120 Office Spaces", highlights: "LEED Certified, Smart Parking", image: "/images/com-2.png" },
  { id: 3, name: "Cosmos Logistics Park", location: "Chakan, Pune", type: "Industrial", status: "Upcoming", units: "5 Million SqFt", highlights: "Grade-A Warehousing", image: "/images/ind-2.png" },
  { id: 4, name: "Cosmos Heights", location: "Kalyani Nagar, Pune", type: "Residential", status: "Completed", units: "80 Premium Flats", highlights: "Clubhouse, Infinity Pool", image: "/images/res-1.png" },
  { id: 5, name: "Cosmos Retail Square", location: "Viman Nagar, Pune", type: "Commercial", status: "Completed", units: "45 Retail Shops", highlights: "High Footfall, Anchor Stores", image: "/images/com-3.png" },
  { id: 6, name: "Cosmos Villas", location: "Aundh, Pune", type: "Residential", status: "Ongoing", units: "15 Luxury Bungalows", highlights: "Gated Community, Private Gardens", image: "/images/res-2.png" },
  { id: 7, name: "Cosmos IT Park", location: "Kharadi, Pune", type: "Commercial", status: "Upcoming", units: "2 IT Towers", highlights: "Food Court, Co-working Zones", image: "/images/proj-2.png" },
  { id: 8, name: "Cosmos Riverfront", location: "Mundhwa, Pune", type: "Residential", status: "Upcoming", units: "200 Waterfront Apts", highlights: "River Views, Jogging Track", image: "/images/proj-3.png" },
];

export default function Projects() {
  return (
    <div className="bg-secondary/20 min-h-screen pb-20">
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

      <div className="container mx-auto px-4 md:px-8 mt-12">
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
                  src={project.image} 
                  alt={project.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className={`absolute top-3 right-3 shadow-sm ${
                  project.status === 'Completed' ? 'bg-green-600 hover:bg-green-700 text-white' : 
                  project.status === 'Ongoing' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 
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
                  <Button variant="outline" className="flex-1 text-primary border-primary hover:bg-primary hover:text-white h-10">
                    View
                  </Button>
                  <Button className="flex-1 bg-primary text-white hover:bg-primary/90 h-10">
                    <Download size={16} className="mr-2" /> Brochure
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
