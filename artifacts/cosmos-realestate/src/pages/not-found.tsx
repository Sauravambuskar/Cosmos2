import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { AlertCircle, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center bg-secondary/20 px-4 py-16">
      <Helmet>
        <title>Page Not Found | Cosmos Real Estate</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
          <AlertCircle size={30} />
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or may have been moved. Browse our
          property listings instead.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Button asChild className="bg-primary text-white hover:bg-primary/90 h-11 px-6">
            <Link href="/">
              <Home size={16} className="mr-2" /> Back to Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white h-11 px-6"
          >
            <Link href="/contact">
              <Search size={16} className="mr-2" /> Talk to an Advisor
            </Link>
          </Button>
        </div>

        {/* Internal links help users recover and keep crawlers moving through the site. */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {[
            { href: "/residential", label: "Residential" },
            { href: "/commercial", label: "Commercial" },
            { href: "/industrial", label: "Industrial" },
            { href: "/projects", label: "Projects" },
            { href: "/about", label: "About Us" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="text-muted-foreground hover:text-primary transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
