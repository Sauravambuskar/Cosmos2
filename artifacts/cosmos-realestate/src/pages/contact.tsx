import { useState } from "react";
import { Link } from "wouter";
import { MapPin, Phone, Mail, ChevronRight, Clock } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { submitContact } from "@/lib/api";
import Seo from "@/components/seo";
import { PAGE_SEO, breadcrumbSchema, localBusinessSchema } from "@/lib/seo";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { phoneDigits } from "@/lib/site-settings";

// Map the detailed UI interest options to the CMS interest buckets.
function mapInterest(value: string): string {
  if (value.includes("commercial")) return "commercial";
  if (value === "industrial") return "industrial";
  if (value.includes("residential")) return "residential";
  return "general";
}

export default function Contact() {
  const { toast } = useToast();
  const settings = useSiteSettings();
  const { contact, features } = settings;

  // Parse interest from query parameter if present
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const interestParam = params.get("interest") || "buy_residential";
  const [interest, setInterest] = useState(interestParam);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = new FormData(formEl);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    setSubmitting(true);
    try {
      await submitContact({
        name,
        email,
        phone,
        message,
        interest: mapInterest(interest),
      });
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. Our team will get back to you shortly.",
      });
      formEl.reset();
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-secondary/20 min-h-screen pb-20">
      <Seo
        {...PAGE_SEO.contact}
        schemas={[
          localBusinessSchema(settings),
          breadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "Contact Us", path: "/contact" },
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
            <span className="font-medium text-white">Contact Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Get in Touch</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Whether you're looking to buy, sell, or lease, our experts are ready to assist you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contact Form */}
          <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Send an Inquiry</h2>
            {!features.contactFormEnabled ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-6">
                  Our enquiry form is temporarily closed. Please reach us directly — we reply quickly.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {contact.phonePrimary && (
                    <Button asChild className="bg-primary text-white h-12 px-8">
                      <a href={`tel:${phoneDigits(contact.phonePrimary)}`}>Call {contact.phonePrimary}</a>
                    </Button>
                  )}
                  {contact.whatsapp && (
                    <Button asChild variant="outline" className="h-12 px-8">
                      <a href={`https://wa.me/${phoneDigits(contact.whatsapp)}`} target="_blank" rel="noopener noreferrer">
                        WhatsApp us
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name *</label>
                  <Input id="name" name="name" placeholder="John Doe" className="h-12 bg-secondary/30 focus-visible:ring-primary" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address *</label>
                  <Input id="email" name="email" type="email" placeholder="john@example.com" className="h-12 bg-secondary/30 focus-visible:ring-primary" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number *</label>
                  <Input id="phone" name="phone" type="tel" placeholder="+91 90000 00000" className="h-12 bg-secondary/30 focus-visible:ring-primary" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">I am interested in *</label>
                  <Select value={interest} onValueChange={setInterest}>
                    <SelectTrigger className="h-12 bg-secondary/30 focus:ring-primary">
                      <SelectValue placeholder="Select interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy_residential">Buying Residential</SelectItem>
                      <SelectItem value="rent_residential">Renting Residential</SelectItem>
                      <SelectItem value="buy_commercial">Buying Commercial</SelectItem>
                      <SelectItem value="rent_commercial">Leasing Commercial</SelectItem>
                      <SelectItem value="industrial">Industrial Space</SelectItem>
                      <SelectItem value="sell_property">Selling my Property</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">Your Message / Requirements</label>
                <Textarea 
                  id="message" 
                  name="message"
                  placeholder="Tell us about the locality, budget, and specific requirements..." 
                  className="min-h-[150px] bg-secondary/30 focus-visible:ring-primary resize-none"
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full md:w-auto px-10 h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base disabled:opacity-60">
                {submitting ? "Submitting…" : "Submit Inquiry"}
              </Button>
            </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h3 className="text-xl font-serif font-bold mb-6 text-foreground border-b pb-4">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-foreground">Office Address</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {contact.addressLine}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-foreground">Phone & WhatsApp</h4>
                    {[contact.phonePrimary, contact.phoneSecondary].filter(Boolean).map((p) => (
                      <a key={p} href={`tel:${phoneDigits(p)}`} className="block text-muted-foreground text-sm mb-1 hover:text-primary transition-colors">
                        {p}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-foreground">Email Address</h4>
                    <a href={`mailto:${contact.email}`} className="text-muted-foreground text-sm mb-1 hover:text-primary transition-colors">
                      {contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-foreground">Working Hours</h4>
                    <p className="text-muted-foreground text-sm">{contact.workingHours}</p>
                    <p className="text-muted-foreground text-sm">{contact.workingHoursNote}</p>
                  </div>
                </div>
              </div>
            </div>

            {contact.whatsapp && (
              <Button asChild className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white h-14 text-base font-bold shadow-md">
                <a href={`https://wa.me/${phoneDigits(contact.whatsapp)}`} target="_blank" rel="noopener noreferrer">
                  <SiWhatsapp className="mr-2" size={24} /> Chat on WhatsApp
                </a>
              </Button>
            )}

            {/* A real embedded map once one is configured in Site Settings,
                otherwise a labelled placeholder rather than a broken frame. */}
            {contact.mapEmbedUrl ? (
              <iframe
                src={contact.mapEmbedUrl}
                title={`Map of ${contact.city}`}
                className="h-48 w-full rounded-xl border border-border shadow-sm"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="h-48 bg-muted rounded-xl border border-border w-full flex flex-col items-center justify-center gap-2 shadow-sm">
                <MapPin size={28} className="text-primary drop-shadow-md" />
                <span className="bg-white/90 px-3 py-1 rounded text-sm shadow-sm font-serif font-semibold text-foreground">
                  {contact.city}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
