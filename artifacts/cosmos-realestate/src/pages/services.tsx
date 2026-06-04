import { motion } from "framer-motion";
import { Home, Briefcase, Key, Globe, FileText, Paintbrush, ArrowRight, CheckCircle, Phone } from "lucide-react";
import { Link } from "wouter";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Home,
    title: "Residential Sales",
    desc: "Expert guidance in buying and selling premium apartments, penthouses, and luxury villas across Pune's most sought-after neighbourhoods. We negotiate the best deal — every time.",
    image: "/stock/luxury-living.jpg",
    highlights: ["Luxury apartments & penthouses", "Villa & bungalow transactions", "New project launches", "Resale advisory"],
  },
  {
    icon: Briefcase,
    title: "Commercial Leasing",
    desc: "Strategic advisory for corporate leasing, retail spaces, and IT parks. We match your business needs with the perfect commercial address in Pune's fastest-growing corridors.",
    image: "/stock/modern-office.jpg",
    highlights: ["Grade-A office spaces", "IT parks & SEZ units", "Retail & showroom leasing", "Co-working advisory"],
  },
  {
    icon: Key,
    title: "Property Management",
    desc: "Comprehensive end-to-end management for property owners — tenant screening, rent collection, maintenance coordination, and periodic reporting. Your asset, fully cared for.",
    image: "/stock/luxury-lobby.jpg",
    highlights: ["Tenant acquisition & screening", "Rent collection & disbursal", "Maintenance & upkeep", "Detailed owner reports"],
  },
  {
    icon: Globe,
    title: "NRI Investment Advisory",
    desc: "Specialised services for Non-Resident Indians seeking high-yield real estate in Pune. Full FEMA compliance, power of attorney handling, and seamless remote transactions.",
    image: "/stock/aerial-city.jpg",
    highlights: ["FEMA & RBI compliance", "POA-based transactions", "Repatriation guidance", "Video consultation & tours"],
  },
  {
    icon: FileText,
    title: "Legal & Documentation",
    desc: "Hassle-free execution from title verification to registration. Our network of legal experts ensures every transaction is clean, compliant, and stress-free.",
    image: "/stock/handshake.jpg",
    highlights: ["Title search & due diligence", "Sale deed drafting", "Registration support", "Stamp duty guidance"],
  },
  {
    icon: Paintbrush,
    title: "Interior Consultation",
    desc: "We collaborate with Pune's top interior designers to help you transform a bare shell into a bespoke luxury home or world-class workspace — tailored to your vision and budget.",
    image: "/stock/luxury-bedroom.jpg",
    highlights: ["Designer tie-ups", "Concept-to-completion", "Budget optimisation", "Luxury finish options"],
  },
];

const process = [
  { step: "01", title: "Initial Consultation", desc: "A free, no-obligation call with Jatin to understand your exact requirements, budget, and timeline." },
  { step: "02", title: "Curated Shortlist", desc: "We handpick the best-matching properties from our exclusive inventory and present them to you." },
  { step: "03", title: "Site Visits & Analysis", desc: "Accompanied visits with detailed market analysis, neighbourhood insights, and fair valuation." },
  { step: "04", title: "Negotiation & Close", desc: "We negotiate hard on your behalf and manage the full legal and documentation process to closing." },
];

export default function Services() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="relative pt-40 pb-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/stock/city-skyline.jpg')" }}
        />
        <div className="absolute inset-0 bg-[hsl(222,47%,10%)]/88" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container relative z-10 mx-auto px-4 md:px-8 max-w-3xl text-center"
        >
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">What We Do</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Comprehensive Real Estate Solutions
          </h1>
          <p className="text-white/65 text-lg font-light leading-relaxed">
            From discovering the perfect property to finalising the paperwork — we offer a full spectrum of premium services designed for the discerning client.
          </p>
        </motion.div>
      </section>

      {/* Service Cards */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group bg-card border border-border hover:border-primary/30 transition-all hover:shadow-xl overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-colors duration-500" />

                  {/* Icon badge */}
                  <div className="absolute bottom-4 left-4 w-11 h-11 bg-primary flex items-center justify-center text-white shadow-lg">
                    <service.icon size={20} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-serif font-bold mb-3 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{service.desc}</p>

                  {/* Highlight bullets */}
                  <ul className="space-y-2 mb-8 flex-grow">
                    {service.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground/70">
                        <CheckCircle size={13} className="text-primary flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase hover:gap-3 transition-all group/link"
                  >
                    Enquire Now <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-24 bg-[hsl(222,47%,9%)]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">How We Work</span>
            <h2 className="text-4xl font-serif font-bold text-white mb-4">Our Process</h2>
            <p className="text-white/45 max-w-xl mx-auto text-sm">Simple, transparent, and built around you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-primary/20" />

            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="flex flex-col items-center text-center px-6 relative"
              >
                <div className="w-20 h-20 border-2 border-primary bg-[hsl(222,47%,9%)] flex items-center justify-center mb-6 relative z-10">
                  <span className="text-primary font-serif font-bold text-2xl">{step.step}</span>
                </div>
                <h3 className="text-white font-serif font-bold text-lg mb-3">{step.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split CTA */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
          {/* Left — image */}
          <div className="relative h-72 md:h-auto overflow-hidden">
            <img src="/stock/luxury-house.jpg" alt="Premium property" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[hsl(222,47%,10%)]/60" />
          </div>

          {/* Right — CTA */}
          <div className="bg-primary flex items-center justify-center p-16">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-sm"
            >
              <span className="text-white/60 font-bold tracking-widest uppercase text-xs mb-4 block">Get Started</span>
              <h2 className="text-4xl font-serif font-bold text-white mb-6 leading-tight">
                Ready to Begin Your Real Estate Journey?
              </h2>
              <p className="text-white/75 text-sm leading-relaxed mb-8">
                Speak with Jatin Arora directly — no middlemen, no guesswork. Just expert, honest advice.
              </p>
              <div className="flex flex-col gap-3">
                <Button asChild size="lg" className="rounded-none h-12 bg-white text-primary hover:bg-white/90 font-bold tracking-wider w-full">
                  <Link href="/contact">
                    <Phone size={16} className="mr-2" /> Book a Consultation
                  </Link>
                </Button>
                <a
                  href="https://wa.me/919325097835"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-12 bg-[#25D366] text-white font-bold text-sm hover:bg-[#1fad54] transition-colors w-full"
                >
                  <SiWhatsapp size={17} /> Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
