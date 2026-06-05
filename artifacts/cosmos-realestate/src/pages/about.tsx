import { motion } from "framer-motion";
import { Award, Briefcase, GraduationCap, Users } from "lucide-react";

export default function About() {
  return (
    <div className="w-full pt-28">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-secondary">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" 
          style={{ backgroundImage: "url('/images/about-bg.png')" }} 
        />
        <div className="container relative z-20 mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">About Us</span>
            <h1 className="text-5xl md:text-7xl font-serif text-white font-bold leading-tight mb-6">
              Legacy of Trust
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
              Building lifelong relationships in Pune's luxury real estate market.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                <img 
                  src="/business-card.png" 
                  alt="Cosmos Real Estate Business Card" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-secondary p-8 text-white max-w-[250px] hidden md:block border border-primary/20">
                <div className="text-4xl font-serif text-primary mb-2">20+</div>
                <div className="text-sm tracking-wider uppercase">Years of Excellence</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-serif font-bold text-foreground mb-6">Jatin Arora</h2>
              <div className="flex gap-4 mb-8">
                <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-sm font-semibold tracking-wider rounded-none">NAR India Life Member</span>
                <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-sm font-semibold tracking-wider rounded-none">FMP Certified</span>
              </div>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  As the driving force behind Cosmos Real Estate, Jatin Arora brings over two decades of profound expertise in Pune's premium property market. Specializing in luxury residential and high-yield commercial properties.
                </p>
                <p>
                  His commitment to ethical practices and transparent dealings has established Cosmos as a trusted name among HNIs, corporate clients, and NRI investors looking for the perfect asset in Koregaon Park, Kalyani Nagar, and beyond.
                </p>
                <p>
                  "Real estate is not just about square footage; it's about finding the perfect backdrop for your life's next chapter or the ideal foundation for your business growth."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-background p-12 border border-border shadow-sm">
              <h3 className="text-3xl font-serif font-bold mb-6 text-secondary">Our Mission</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To provide unparalleled real estate advisory services characterized by integrity, market intelligence, and a client-first approach. We strive to make property transactions seamless, transparent, and highly rewarding for every individual we serve.
              </p>
            </div>
            <div className="bg-background p-12 border border-border shadow-sm">
              <h3 className="text-3xl font-serif font-bold mb-6 text-secondary">Our Vision</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To be the most respected and sought-after luxury real estate consultancy in Pune, known for redefining standards of professionalism and creating lasting value for generations of property owners and investors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-secondary text-white border-t-4 border-primary">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold">By the Numbers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Briefcase, value: "₹500+ Cr", label: "Properties Sold" },
              { icon: Users, value: "1000+", label: "Happy Families" },
              { icon: Award, value: "50+", label: "Industry Awards" },
              { icon: GraduationCap, value: "100%", label: "Professional Integrity" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6 text-primary">
                  <stat.icon size={32} />
                </div>
                <div className="text-4xl font-serif font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/60 text-sm tracking-widest uppercase font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
