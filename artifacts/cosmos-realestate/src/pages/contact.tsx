import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for reaching out. We will get back to you shortly.",
    });
  };

  return (
    <div className="w-full pt-28 pb-24 bg-muted/10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">Get in Touch</span>
          <h1 className="text-5xl font-serif font-bold text-foreground mb-6">Contact Cosmos</h1>
          <p className="text-lg text-muted-foreground">
            Whether you're looking to buy, sell, or invest, our experts are ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-serif font-bold mb-8">Office Information</h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Location</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    No.2, "H" Building, Ground Floor, Liberty-II,<br />
                    Opp. Pizza Hut, North Main Road,<br />
                    Koregaon Park, Pune - 411001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Phone / TeleFax</h4>
                  <p className="text-muted-foreground mb-1">+91-9325097835</p>
                  <p className="text-muted-foreground mb-1">+91-9823056983</p>
                  <p className="text-muted-foreground">+91 20 26152956 (Tele/Fax)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Email</h4>
                  <p className="text-muted-foreground mb-1">jatin@cosmosrealestate.in</p>
                  <p className="text-muted-foreground">cosmosestate@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary text-white p-8 mb-8 text-center">
              <h3 className="text-xl font-serif font-bold mb-4">Direct WhatsApp Support</h3>
              <p className="text-white/70 mb-6">Chat with our agents instantly for quick queries.</p>
              <Button asChild className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white rounded-none h-14 text-lg">
                <a href="https://wa.me/919325097835" target="_blank" rel="noopener noreferrer">
                  <SiWhatsapp className="mr-2" size={24} /> Chat on WhatsApp
                </a>
              </Button>
            </div>
            
            {/* Map Placeholder */}
            <div className="h-64 bg-muted border border-border w-full flex items-center justify-center relative overflow-hidden">
                <img src={`https://placehold.co/800x400/e2e8f0/64748b?text=Map:+Koregaon+Park,+Pune`} alt="Map of Koregaon Park" className="w-full h-full object-cover opacity-50 grayscale" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary font-semibold font-serif">
                  <MapPin size={32} className="text-primary mb-2" />
                  <span>Koregaon Park, Pune</span>
                </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-background p-10 border border-border shadow-xl"
          >
            <h2 className="text-3xl font-serif font-bold mb-8">Send an Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input id="name" placeholder="John Doe" className="h-12 rounded-none bg-muted/50 border-transparent focus-visible:border-primary" required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                  <Input id="email" type="email" placeholder="john@example.com" className="h-12 rounded-none bg-muted/50 border-transparent focus-visible:border-primary" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                  <Input id="phone" type="tel" placeholder="+91 90000 00000" className="h-12 rounded-none bg-muted/50 border-transparent focus-visible:border-primary" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Property Interest</label>
                <Select defaultValue="buy">
                  <SelectTrigger className="h-12 rounded-none bg-muted/50 border-transparent focus:ring-1 focus:ring-primary">
                    <SelectValue placeholder="Select interest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Your Message</label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us about your requirements..." 
                  className="min-h-[150px] rounded-none bg-muted/50 border-transparent focus-visible:border-primary resize-none"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-14 rounded-none text-lg tracking-wide mt-4">
                Submit Inquiry
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
