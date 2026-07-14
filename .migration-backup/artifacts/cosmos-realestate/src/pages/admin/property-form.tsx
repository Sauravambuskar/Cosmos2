import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Save } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { adminFetch, isAdminLoggedIn } from "@/lib/adminAuth";
import type { Property } from "@/lib/types";

const PROPERTY_TYPES = ["residential", "commercial", "industrial"] as const;
const CATEGORIES: Record<string, string[]> = {
  residential: ["flat", "bungalow", "row-house", "duplex"],
  commercial: ["office", "co-working", "managed-office", "shop", "showroom", "hotel"],
  industrial: ["warehouse", "factory", "industrial-plot", "cold-storage"],
};
const TRANSACTION_TYPES = ["buy", "rent"] as const;
const LOCATIONS = [
  "Koregaon Park, Pune", "Baner, Pune", "Kalyani Nagar, Pune",
  "Viman Nagar, Pune", "Aundh, Pune", "Wakad, Pune", "Kharadi, Pune",
  "Hinjewadi, Pune", "Chakan, Pune", "Bhosari, Pune", "Talegaon, Pune", "Other",
];

type FormState = {
  title: string; description: string; type: string; category: string;
  transactionType: string; price: string; priceValue: string;
  area: string; bhk: string; location: string; address: string;
  images: string; amenities: string; status: string; featured: boolean;
};

const defaultForm: FormState = {
  title: "", description: "", type: "residential", category: "flat",
  transactionType: "buy", price: "", priceValue: "0",
  area: "0", bhk: "", location: LOCATIONS[0], address: "",
  images: "", amenities: "", status: "active", featured: false,
};

export default function PropertyForm() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params.id && params.id !== "new";

  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdminLoggedIn()) { setLocation("/admin/login"); return; }
    if (!isEdit) return;
    async function load() {
      try {
        const res = await adminFetch(`/api/admin/properties`);
        if (!res.ok) return;
        const all = await res.json() as Property[];
        const prop = all.find((p) => p.id === parseInt(params.id!, 10));
        if (!prop) return;
        setForm({
          title: prop.title, description: prop.description,
          type: prop.type, category: prop.category,
          transactionType: prop.transactionType, price: prop.price,
          priceValue: String(prop.priceValue), area: String(prop.area),
          bhk: prop.bhk != null ? String(prop.bhk) : "",
          location: prop.location, address: prop.address,
          images: prop.images.join("\n"), amenities: prop.amenities.join(", "),
          status: prop.status, featured: prop.featured,
        });
      } finally {
        setFetchLoading(false);
      }
    }
    load();
  }, [isEdit, params.id, setLocation]);

  function set(field: keyof FormState, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "type") next.category = CATEGORIES[value as string]?.[0] ?? "";
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        category: form.category,
        transactionType: form.transactionType,
        price: form.price,
        priceValue: parseInt(form.priceValue, 10) || 0,
        area: parseInt(form.area, 10) || 0,
        bhk: form.bhk ? parseInt(form.bhk, 10) : null,
        location: form.location,
        address: form.address,
        images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
        amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
        status: form.status,
        featured: form.featured,
      };

      const url = isEdit ? `/api/admin/properties/${params.id}` : "/api/admin/properties";
      const method = isEdit ? "PUT" : "POST";
      const res = await adminFetch(url, { method, body: JSON.stringify(payload) });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "Failed to save property");
        return;
      }
      setLocation("/admin/properties");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  if (fetchLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setLocation("/admin/properties")}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Property" : "Add New Property"}</h2>
            <p className="text-sm text-gray-500">{isEdit ? "Update listing details" : "Create a new listing"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Basic Information</h3>

            <div>
              <label className={labelClass}>Title *</label>
              <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="e.g. Spacious 3BHK in Koregaon Park" className={inputClass} data-testid="input-title" />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Describe the property..." className={inputClass} data-testid="input-description" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Property Type *</label>
                <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputClass} data-testid="select-type">
                  {PROPERTY_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Category *</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass} data-testid="select-category">
                  {(CATEGORIES[form.type] ?? []).map((c) => (
                    <option key={c} value={c} className="capitalize">{c.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Transaction Type *</label>
              <div className="flex gap-3">
                {TRANSACTION_TYPES.map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="transactionType" value={t} checked={form.transactionType === t} onChange={() => set("transactionType", t)} className="text-primary" />
                    <span className="text-sm capitalize text-gray-700">{t === "buy" ? "For Sale" : "For Rent"}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Details */}
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Pricing & Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price Display *</label>
                <input type="text" value={form.price} onChange={(e) => set("price", e.target.value)} required placeholder='e.g. "1.2 Cr" or "25,000/mo"' className={inputClass} data-testid="input-price" />
              </div>
              <div>
                <label className={labelClass}>Price Value (in Lakhs, for sorting)</label>
                <input type="number" value={form.priceValue} onChange={(e) => set("priceValue", e.target.value)} min={0} placeholder="e.g. 120 for 1.2 Cr" className={inputClass} data-testid="input-price-value" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Area (sq ft) *</label>
                <input type="number" value={form.area} onChange={(e) => set("area", e.target.value)} min={0} placeholder="e.g. 1200" className={inputClass} data-testid="input-area" />
              </div>
              <div>
                <label className={labelClass}>BHK (leave blank for commercial)</label>
                <input type="number" value={form.bhk} onChange={(e) => set("bhk", e.target.value)} min={1} max={10} placeholder="e.g. 3" className={inputClass} data-testid="input-bhk" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Location</h3>
            <div>
              <label className={labelClass}>Locality *</label>
              <select value={form.location} onChange={(e) => set("location", e.target.value)} className={inputClass} data-testid="select-location">
                {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Full Address</label>
              <input type="text" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street address, landmark..." className={inputClass} data-testid="input-address" />
            </div>
          </div>

          {/* Media & Amenities */}
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Media & Amenities</h3>
            <div>
              <label className={labelClass}>Image URLs (one per line)</label>
              <textarea value={form.images} onChange={(e) => set("images", e.target.value)} rows={4} placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"} className={inputClass} data-testid="input-images" />
            </div>
            <div>
              <label className={labelClass}>Amenities (comma separated)</label>
              <input type="text" value={form.amenities} onChange={(e) => set("amenities", e.target.value)} placeholder="Parking, Gym, Pool, Security, Power Backup" className={inputClass} data-testid="input-amenities" />
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Settings</h3>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="rounded text-primary" data-testid="checkbox-featured" />
                <span className="text-sm text-gray-700">Featured on homepage</span>
              </label>
              <div className="flex items-center gap-2">
                <label className={labelClass + " mb-0"}>Status:</label>
                <select value={form.status} onChange={(e) => set("status", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" data-testid="select-status">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3" data-testid="text-form-error">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setLocation("/admin/properties")}
              className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              data-testid="button-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              data-testid="button-save-property"
            >
              <Save size={15} />
              {loading ? "Saving..." : isEdit ? "Update Property" : "Add Property"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
