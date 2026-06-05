import { motion } from "framer-motion";
import { Home, Briefcase, Key, Globe, FileText, Paintbrush, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const services = [
  {
    icon: Home,
    title: "Residential Sales",
    desc: "Expert guidance in buying and selling premium apartments, penthouses, and luxury villas across Pune's most sought-after neighborhoods."
  },
  {
    icon: Briefcase,
    title: "Commercial Leasing",
    desc: "Strategic advisory for corporate leasing, retail spaces, and IT parks. We match your business needs with the perfect commercial address."
  },
  {
    icon: Key,
    title: "Property Management",
    desc: "Comprehensive end-to-end management for property owners, including tenant screening, rent collection, and maintenance."
  },
  {
    icon: Globe,
    title: "NRI Investment Advisory",
    desc: "Specialized services tailored for Non-Resident Indians seeking high-yield real estate investments in Pune with full legal compliance."
  },
  {
    icon: FileText,
    title: "Legal & Documentation",
    desc: "Hassle-free execution of property transactions, title verification, registration, and all necessary legal paperwork handled by experts."
  },
  {
    icon: Paintbrush,
    title: "Interior Consultation",
    desc: "Collaborations with top interior designers to transform your bare-shell property into a luxurious, bespoke living or working space."
  }
];

export default function Services() {
  return (
    <div className="w-full pt-28 pb-24 bg-muted/10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">What We Do</span>
          <h1 className="text-5xl font-serif font-bold text-foreground mb-6">Comprehensive Real Estate Solutions</h1>
          <p className="text-lg text-muted-foreground">
            From discovering the perfect property to finalizing the paperwork, we offer a full spectrum of services designed for the discerning client.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background border border-border p-10 hover:shadow-xl hover:border-primary/30 transition-all group"
            >
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-secondary">
                <service.icon size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-8 h-24">
                {service.desc}
              </p>
              <Link href="/contact" className="inline-flex items-center text-primary font-semibold hover:text-secondary transition-colors uppercase tracking-wide text-sm">
                Learn More <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
