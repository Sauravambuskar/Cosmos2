import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, ChevronRight, Building, CheckCircle, Download, Calendar, Ruler, Award, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchProject, projectImage } from "@/lib/api";

export default function ProjectDetail() {
  const params = useParams<{ id: string }>();
  const projectId = parseInt(params.id, 10);

  // Project details come straight from the CMS so admin edits are reflected here.
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
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
          src={projectImage(project)}
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
