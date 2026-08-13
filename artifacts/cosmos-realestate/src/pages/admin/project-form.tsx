import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Save } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { adminFetch, adminJson, readError } from "@/lib/adminAuth";
import { useSiteSettings } from "@/hooks/use-site-settings";
import type { Project } from "@/lib/types";

const PROJECT_TYPES = ["Residential", "Commercial", "Industrial"] as const;
const STATUS_OPTIONS = ["Completed", "Ongoing", "Upcoming"] as const;

type FormState = {
  name: string;
  description: string;
  location: string;
  type: string;
  status: string;
  units: string;
  highlights: string;
  image: string;
  brochureUrl: string;
  videoUrl: string;
  area: string;
  amenities: string;
  gallery: string;
  rera: string;
  possession: string;
  priceRange: string;
  developer: string;
  featured: boolean;
  active: boolean;
};

const defaultForm: FormState = {
  name: "",
  description: "",
  location: "",
  type: "Residential",
  status: "Upcoming",
  units: "",
  highlights: "",
  image: "",
  brochureUrl: "",
  videoUrl: "",
  area: "",
  amenities: "",
  gallery: "",
  rera: "",
  possession: "",
  priceRange: "",
  developer: "",
  featured: false,
  active: true,
};

export default function ProjectForm() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params.id && params.id !== "new";
  const settings = useSiteSettings();

  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    async function load() {
      try {
        const all = await adminJson<Project[]>("/api/admin/projects");
        const proj = all.find((p) => p.id === parseInt(params.id!, 10));
        if (!proj) {
          setError("That project no longer exists. It may have been deleted.");
          return;
        }
        setForm({
          name: proj.name,
          description: proj.description,
          location: proj.location,
          type: proj.type,
          status: proj.status,
          units: proj.units,
          highlights: proj.highlights,
          image: proj.image,
          brochureUrl: proj.brochureUrl,
          videoUrl: proj.videoUrl,
          area: proj.area,
          amenities: proj.amenities.join(", "),
          gallery: proj.gallery.join("\n"),
          rera: proj.rera,
          possession: proj.possession,
          priceRange: proj.priceRange,
          developer: proj.developer,
          featured: proj.featured,
          active: proj.active,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load this project");
      } finally {
        setFetchLoading(false);
      }
    }
    void load();
  }, [isEdit, params.id]);

  // A new project defaults to your own business name from Site Settings.
  useEffect(() => {
    if (!isEdit && !form.developer) {
      setForm((prev) => (prev.developer ? prev : { ...prev, developer: settings.brand.legalName }));
    }
  }, [isEdit, settings.brand.legalName, form.developer]);

  function set(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        location: form.location,
        type: form.type,
        status: form.status,
        units: form.units,
        highlights: form.highlights,
        image: form.image,
        brochureUrl: form.brochureUrl,
        videoUrl: form.videoUrl,
        area: form.area,
        amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
        gallery: form.gallery.split("\n").map((s) => s.trim()).filter(Boolean),
        rera: form.rera,
        possession: form.possession,
        priceRange: form.priceRange,
        developer: form.developer,
        featured: form.featured,
        active: form.active,
      };

      const url = isEdit ? `/api/admin/projects/${params.id}` : "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";
      const res = await adminFetch(url, { method, body: JSON.stringify(payload) });

      if (!res.ok) {
        setError(await readError(res));
        return;
      }
      setLocation("/admin/projects");
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
            onClick={() => setLocation("/admin/projects")}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Project" : "Add New Project"}</h2>
            <p className="text-sm text-gray-500">{isEdit ? "Update project details" : "Create a new project"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Basic Information</h3>

            <div>
              <label className={labelClass}>Project Name *</label>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="e.g. Cosmos Grandeur" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Describe the project..." className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Type *</label>
                <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputClass}>
                  {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Status *</label>
                <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Location *</label>
              <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)} required placeholder="e.g. Koregaon Park, Pune" className={inputClass} />
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Project Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Units / Inventory</label>
                <input type="text" value={form.units} onChange={(e) => set("units", e.target.value)} placeholder="e.g. 42 Exclusive Units" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Total Area</label>
                <input type="text" value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="e.g. 19,000 Sq. Ft." className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Highlights (comma separated)</label>
              <input type="text" value={form.highlights} onChange={(e) => set("highlights", e.target.value)} placeholder="Private Pools, Home Automation, Clubhouse" className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price Range</label>
                <input type="text" value={form.priceRange} onChange={(e) => set("priceRange", e.target.value)} placeholder="e.g. 1.5 Cr - 4.5 Cr" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Possession</label>
                <input type="text" value={form.possession} onChange={(e) => set("possession", e.target.value)} placeholder="e.g. Dec 2025" className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>RERA Number</label>
                <input type="text" value={form.rera} onChange={(e) => set("rera", e.target.value)} placeholder="e.g. P52100012345" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Developer</label>
                <input type="text" value={form.developer} onChange={(e) => set("developer", e.target.value)} placeholder="Cosmos Real Estate" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Amenities (comma separated)</label>
              <input type="text" value={form.amenities} onChange={(e) => set("amenities", e.target.value)} placeholder="Swimming Pool, Gym, Clubhouse, Security, Parking" className={inputClass} />
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Media</h3>

            <div>
              <label className={labelClass}>Cover Image URL</label>
              <input type="text" value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://example.com/project-cover.jpg" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Gallery Image URLs (one per line)</label>
              <textarea value={form.gallery} onChange={(e) => set("gallery", e.target.value)} rows={4} placeholder={"https://example.com/img1.jpg\nhttps://example.com/img2.jpg"} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Video Embed URL</label>
              <input type="text" value={form.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} placeholder="https://www.youtube.com/embed/xxx or Vimeo embed URL" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Brochure Download URL</label>
              <input type="text" value={form.brochureUrl} onChange={(e) => set("brochureUrl", e.target.value)} placeholder="https://example.com/brochure.pdf" className={inputClass} />
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Settings</h3>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="rounded text-primary" />
                <span className="text-sm text-gray-700">Featured project</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="rounded text-primary" />
                <span className="text-sm text-gray-700">Active (visible on site)</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setLocation("/admin/projects")}
              className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Save size={15} />
              {loading ? "Saving..." : isEdit ? "Update Project" : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
