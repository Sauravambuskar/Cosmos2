import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const projects = [
  { id: 1, name: "Cosmos Heights", location: "Kalyani Nagar", type: "Residential", status: "Ongoing", desc: "Ultra-luxury 4 & 5 BHK residences with panoramic river views.", image: "/images/proj-1.png" },
  { id: 2, name: "Cosmos Business Park", location: "Baner", type: "Commercial", status: "Completed", desc: "Grade A office spaces designed for modern tech enterprises.", image: "/images/proj-2.png" },
  { id: 3, name: "The Zenith Villas", location: "Aundh", type: "Residential", status: "Ongoing", desc: "Exclusive community of 12 bespoke luxury villas.", image: "/images/proj-3.png" },
  { id: 4, name: "Cosmos Enclave", location: "Wakad", type: "Residential", status: "Completed", desc: "Premium 3 BHK apartments with world-class amenities.", image: "/images/proj-4.png" },
  { id: 5, name: "Aura Commercial Hub", location: "Kharadi", type: "Commercial", status: "Ongoing", desc: "Next-gen retail and office spaces in Pune's IT corridor.", image: "/images/proj-1.png" },
  { id: 6, name: "The Heritage", location: "Koregaon Park", type: "Residential", status: "Completed", desc: "Boutique luxury apartments in Pune's most affluent neighborhood.", image: "/images/proj-2.png" },
  { id: 7, name: "Cosmos Tech Center", location: "Hinjewadi", type: "Commercial", status: "Ongoing", desc: "Sustainable IT park with LEED Platinum certification.", image: "/images/proj-3.png" },
  { id: 8, name: "Serenity Woods", location: "NIBM Road", type: "Residential", status: "Completed", desc: "Nature-inspired living with sprawling landscaped gardens.", image: "/images/proj-4.png" },
];

export default function Projects() {
  return (
    <div className="w-full pt-28 pb-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">Our Portfolio</span>
          <h1 className="text-5xl font-serif font-bold text-foreground mb-6">Signature Projects</h1>
          <p className="text-lg text-muted-foreground">
            A showcase of Pune's most distinguished real estate developments, curated by Cosmos.
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
            >
              <div className="relative h-[400px] overflow-hidden mb-6 rounded-sm">
                <img 
                  src={project.image} 
                  alt={project.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/800x600/f1f5f9/64748b?text=${encodeURIComponent(project.name)}`;
                  }}
                />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="bg-white text-secondary px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-md">
                    {project.type}
                  </span>
                  <span className={`px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-md text-white ${project.status === 'Completed' ? 'bg-secondary' : 'bg-primary'}`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">{project.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground mb-4 font-medium">
                  <MapPin size={18} className="text-primary" />
                  <span>{project.location}</span>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {project.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
