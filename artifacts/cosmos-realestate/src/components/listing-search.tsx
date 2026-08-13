import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Free-text search box used by the residential / commercial / industrial listings. */
export default function ListingSearch({
  value,
  onChange,
  placeholder = "Search by project, locality or landmark…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search properties"
        className="w-full h-11 pl-9 pr-9 border border-border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
