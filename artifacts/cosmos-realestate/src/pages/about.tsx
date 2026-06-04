import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Briefcase, GraduationCap, Users, TrendingUp } from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip
} from "recharts";

const segmentData = [
  { segment: "Residential", A: 90 },
  { segment: "Commercial", A: 80 },
  { segment: "Industrial", A: 70 },
  { segment: "Land/Plots", A: 55 },
  { segment: "NRI Advisory", A: 75 },
  { segment: "Co-working", A: 60 },
];

const growthData = [
  { year: "2019", value: 30 },
  { year: "2020", value: 45 },
  { year: "2021", value: 55 },
  { year: "2022", value: 70 },
  { year: "2023", value: 88 },
  { year: "2024", value: 100 },
];

const values = [
  { title: "Integrity First", desc: "Every transaction is conducted with complete transparency. No hidden charges, no surprises." },
  { title: "Client-Centric", desc: "We listen before we advise. Your needs shape every recommendation we make." },
  { title: "Market Intelligence", desc: "Deep knowledge of Pune micro-markets — Koregaon Park, Kalyani Nagar, Kharadi, Hinjawadi, and beyond." },
  { title: "Long-Term Vision", desc: "We think beyond the transaction — building relationships that serve you for decades." },
];

/* ─── Animated Bar ─── */
function AnimatedBar({ label, value, color = "#C5962B" }: { label: string; value: number; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="mb-5">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-white/70 font-medium">{label}</span>
        <span className="text-primary font-bold">{value}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: inView ? `${value}%` : 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div className="w-full pt-28">
      {/* ── Page Hero ── */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center overflow-hidden bg-[hsl(222,47%,10%)]">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/images/about-bg.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[hsl(222,47%,10%)/80]" />
        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-primary font-semibold tracking-[0.3em] uppercase text-xs mb-4 block">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-serif text-white font-bold leading-tight mb-5">
              Legacy of Trust
            </h1>
            <p className="text-lg text-white/65 max-w-2xl mx-auto font-light">
              Building lifelong relationships in Pune's luxury real estate market for over two decades.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Profile ── */}
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
                  alt="Cosmos Real Estate — Jatin Arora"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-[hsl(222,47%,10%)] p-8 text-white max-w-[240px] hidden md:block border-l-2 border-primary">
                <div className="text-4xl font-serif text-primary mb-1">20+</div>
                <div className="text-xs tracking-widest uppercase text-white/60">Years of Excellence</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:pl-8"
            >
              <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Jatin Arora</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {["NAR India Life Member", "FMP Certified", "Pune Market Expert"].map((tag) => (
                  <span key={tag} className="bg-primary/10 text-primary border border-primary/30 px-3 py-1 text-xs font-bold tracking-wider uppercase">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  As the driving force behind Cosmos Real Estate, Jatin Arora brings over two decades of deep expertise in Pune's premium property market — from intimate luxury residences to landmark commercial complexes and large-scale industrial facilities.
                </p>
                <p>
                  His commitment to ethical practices and transparent dealings has established Cosmos as the go-to name among HNIs, corporate clients, and NRI investors across Koregaon Park, Kalyani Nagar, Kharadi, and beyond.
                </p>
                <blockquote className="border-l-2 border-primary pl-5 py-1 text-foreground/80 font-serif italic text-lg">
                  "Real estate is not just about square footage; it's about finding the perfect backdrop for your life's next chapter."
                </blockquote>
              </div>

              {/* Contact quick-info */}
              <div className="mt-8 grid grid-cols-1 gap-2 text-sm">
                {[
                  { label: "Phone", value: "+91-9325097835 / +91-9823056983" },
                  { label: "Email", value: "jatin@cosmosrealestate.in" },
                  { label: "Office", value: "Koregaon Park, Pune — 411001" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3 text-sm">
                    <span className="text-primary font-semibold w-14 flex-shrink-0">{label}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Our Mission", body: "To provide unparalleled real estate advisory characterized by integrity, market intelligence, and a client-first approach. We make property transactions seamless, transparent, and highly rewarding." },
              { title: "Our Vision", body: "To be the most respected luxury real estate consultancy in Pune — known for redefining professionalism and creating lasting value for generations of property owners and investors." },
            ].map(({ title, body }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-background p-10 border-t-2 border-primary shadow-sm"
              >
                <h3 className="text-3xl font-serif font-bold mb-5 text-foreground">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Infographics ── */}
      <section className="py-24 bg-[hsl(222,47%,10%)]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold tracking-widest uppercase text-xs mb-3 block">Expertise Breakdown</span>
            <h2 className="text-4xl font-serif font-bold text-white">Our Competency Profile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Radar chart */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 p-8"
            >
              <h3 className="text-lg font-serif font-bold text-white mb-1">Segment Expertise</h3>
              <p className="text-white/40 text-xs tracking-wider uppercase mb-6">Relative strength per segment</p>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={segmentData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="segment" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }} />
                  <Radar name="Expertise" dataKey="A" stroke="#C5962B" fill="#C5962B" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Progress bars + area chart */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 p-8"
              >
                <h3 className="text-lg font-serif font-bold text-white mb-1">Client Satisfaction Metrics</h3>
                <p className="text-white/40 text-xs tracking-wider uppercase mb-6">Self-assessed performance scores</p>
                <AnimatedBar label="Transparency & Ethics" value={98} />
                <AnimatedBar label="Market Knowledge" value={95} />
                <AnimatedBar label="Deal Closure Rate" value={90} />
                <AnimatedBar label="NRI Client Service" value={88} />
                <AnimatedBar label="Post-sale Support" value={92} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="bg-white/5 border border-white/10 p-8"
              >
                <h3 className="text-lg font-serif font-bold text-white mb-1">Business Growth</h3>
                <p className="text-white/40 text-xs tracking-wider uppercase mb-4">Indexed portfolio growth (2019 = 100 base)</p>
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C5962B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C5962B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: "hsl(222,47%,12%)", border: "1px solid rgba(197,150,43,0.3)", borderRadius: 0 }}
                      labelStyle={{ color: "#C5962B", fontWeight: 700 }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#C5962B" strokeWidth={2} fill="url(#growthGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold tracking-widest uppercase text-xs mb-3 block">What We Stand For</span>
            <h2 className="text-4xl font-serif font-bold">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, index) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 border-t-2 border-primary bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <h3 className="text-xl font-serif font-bold mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Briefcase, value: "₹500+ Cr", label: "Portfolio Handled" },
              { icon: Users, value: "1,000+", label: "Families Served" },
              { icon: Award, value: "50+", label: "Industry Awards" },
              { icon: GraduationCap, value: "100%", label: "Professional Integrity" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 mx-auto bg-white/15 rounded-full flex items-center justify-center mb-4">
                  <stat.icon size={26} className="text-white" />
                </div>
                <div className="text-3xl font-serif font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/65 text-xs tracking-widest uppercase font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
