import { motion } from "framer-motion";
import { Link } from "wouter";
import { Award, Briefcase, GraduationCap, Users, ChevronRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Seo from "@/components/seo";
import { PAGE_SEO, breadcrumbSchema, localBusinessSchema } from "@/lib/seo";
import { useSiteSettings } from "@/hooks/use-site-settings";

export default function About() {
  const settings = useSiteSettings();
  return (
    <div className="w-full bg-secondary/20 min-h-screen pb-20">
      <Seo
        {...PAGE_SEO.about}
        schemas={[
          localBusinessSchema(settings),
          breadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "About Us", path: "/about" },
            ],
            settings,
          ),
        ]}
      />

      <div className="bg-foreground text-white pt-16 pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="font-medium text-white">About Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Legacy of Trust & Excellence</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Pune's most trusted real estate consultancy for over two decades.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-12">
        
        {/* Founder Section */}
        <div className="bg-white rounded-xl shadow-sm border p-8 md:p-12 mb-12">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/3">
              <div className="relative rounded-lg overflow-hidden border-4 border-muted/20">
                <img 
                  src="/images/about-agent.png" 
                  alt="Jatin Arora - Founder" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            <div className="w-full lg:w-2/3">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Jatin Arora</h2>
              <p className="text-muted-foreground text-lg mb-6">Founder & Managing Director</p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1.5 font-semibold text-sm">
                  NAR India Life Member
                </Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1.5 font-semibold text-sm">
                  FMP Certified Professional
                </Badge>
              </div>
              
              <div className="space-y-4 text-foreground/80 leading-relaxed text-lg">
                <p>
                  As the driving force behind Cosmos Real Estate, Jatin Arora brings over two decades of profound expertise in Pune's premium property market. He specializes in high-value transactions across residential, commercial, and industrial sectors.
                </p>
                <p>
                  His commitment to ethical practices, transparency, and market intelligence has established Cosmos as a trusted partner for HNIs, corporate clients, and NRI investors seeking the perfect asset in localities like Koregaon Park, Kalyani Nagar, and prime IT corridors.
                </p>
                <blockquote className="border-l-4 border-primary pl-4 italic text-foreground font-serif text-xl mt-6">
                  "Real estate is not just about square footage; it's about finding the perfect backdrop for your life's next chapter or the ideal foundation for your business growth."
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Briefcase, value: "500+", label: "Properties Listed" },
            { icon: Users, value: "1000+", label: "Happy Clients" },
            { icon: Award, value: "20+", label: "Years of Trust" },
            { icon: GraduationCap, value: "100%", label: "Professional Integrity" }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm border text-center">
              <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4 text-primary">
                <stat.icon size={32} />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-foreground text-white p-10 rounded-xl shadow-lg">
            <h3 className="text-2xl font-serif font-bold mb-4 flex items-center gap-3">
              <CheckCircle2 className="text-primary" /> Our Mission
            </h3>
            <p className="text-white/80 text-lg leading-relaxed">
              To provide unparalleled real estate advisory services characterized by integrity, market intelligence, and a client-first approach. We strive to make property transactions seamless, transparent, and highly rewarding for every individual we serve.
            </p>
          </div>
          <div className="bg-primary text-white p-10 rounded-xl shadow-lg">
            <h3 className="text-2xl font-serif font-bold mb-4 flex items-center gap-3">
              <CheckCircle2 className="text-white" /> Our Vision
            </h3>
            <p className="text-white/90 text-lg leading-relaxed">
              To be the most respected and sought-after luxury real estate consultancy in Pune, known for redefining standards of professionalism and creating lasting value for generations of property owners and investors.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
