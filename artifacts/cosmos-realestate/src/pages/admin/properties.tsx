import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import {
  Plus, Pencil, Trash2, Star, Search, Filter, Building2, Copy,
  Eye, EyeOff, AlertTriangle, RefreshCw, ArrowUpDown, Download,
} from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import AdminBulkBar, { type BulkAction } from "@/components/admin-bulk-bar";
import { adminFetch, adminJson, readError } from "@/lib/adminAuth";
import { matchesPropertyQuery } from "@/lib/search";
import type { Property } from "@/lib/types";

type SortKey = "newest" | "oldest" | "price-high" | "price-low" | "title";

const BULK_ACTIONS: BulkAction[] = [
  { key: "activate", label: "Publish", icon: Eye },
  { key: "deactivate", label: "Hide", icon: EyeOff },
  { key: "feature", label: "Feature", icon: Star },
  { key: "unfeature", label: "Unfeature", icon: Star },
  { key: "delete", label: "Delete", icon: Trash2, destructive: true },
];

function exportCSV(properties: Property[]) {
  const headers = [
    "ID", "Title", "Type", "Category", "Transaction", "Price", "Price (lakhs)",
    "Area", "BHK", "Location", "Status", "Featured", "Created",
  ];
  const rows = properties.map((p) =>
    [
      p.id, p.title, p.type, p.category, p.transactionType, p.price, p.priceValue,
      p.area, p.bhk ?? "", p.location, p.status, p.featured ? "Yes" : "No",
      new Date(p.createdAt).toLocaleDateString("en-IN"),
    ]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(","),
  );
  const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `properties-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminProperties() {
  const [, setLocation] = useLocation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmBulk, setConfirmBulk] = useState<string | null>(null);

  useEffect(() => {
    void loadProperties();
  }, []);

  async function loadProperties() {
    setLoading(true);
    setError("");
    try {
      setProperties(await adminJson<Property[]>("/api/admin/properties"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load properties");
    } finally {
      setLoading(false);
    }
  }

  function flash(message: string) {
    setNotice(message);
    setTimeout(() => setNotice(""), 3000);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await adminFetch(`/api/admin/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        flash("Property deleted.");
      } else {
        setError(await readError(res));
      }
    } finally {
      setDeletingId(null);
    }
  }

  async function duplicate(id: number) {
    setBusy(true);
    try {
      const copy = await adminJson<Property>(`/api/admin/properties/${id}/duplicate`, {
        method: "POST",
      });
      setProperties((prev) => [copy, ...prev]);
      flash("Copy created as a hidden draft — edit it, then publish.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not duplicate listing");
    } finally {
      setBusy(false);
    }
  }

  async function patchOne(id: number, body: Partial<Property>) {
    const res = await adminFetch(`/api/admin/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updated = (await res.json()) as Property;
      setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      setError(await readError(res));
    }
  }

  async function runBulk(action: string) {
    const ids = [...selected];
    if (ids.length === 0) return;
    setBusy(true);
    setError("");
    try {
      if (action === "delete") {
        await adminJson("/api/admin/properties/bulk", {
          method: "POST",
          body: JSON.stringify({ ids, action }),
        });
        setProperties((prev) => prev.filter((p) => !selected.has(p.id)));
        flash(`${ids.length} listing${ids.length > 1 ? "s" : ""} deleted.`);
      } else {
        const { properties: updated } = await adminJson<{ properties: Property[] }>(
          "/api/admin/properties/bulk",
          { method: "POST", body: JSON.stringify({ ids, action }) },
        );
        const byId = new Map(updated.map((p) => [p.id, p]));
        setProperties((prev) => prev.map((p) => byId.get(p.id) ?? p));
        flash(`${ids.length} listing${ids.length > 1 ? "s" : ""} updated.`);
      }
      setSelected(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk action failed");
    } finally {
      setBusy(false);
      setConfirmBulk(null);
    }
  }

  const filtered = useMemo(() => {
    const list = properties.filter((p) => {
      const okType = typeFilter === "all" || p.type === typeFilter;
      const okStatus = statusFilter === "all" || p.status === statusFilter;
      return okType && okStatus && matchesPropertyQuery(p, search);
    });
    return [...list].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price-high":
          return b.priceValue - a.priceValue;
        case "price-low":
          return a.priceValue - b.priceValue;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [properties, typeFilter, statusFilter, search, sortBy]);

  const allVisibleSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) filtered.forEach((p) => next.delete(p.id));
      else filtered.forEach((p) => next.add(p.id));
      return next;
    });
  }

  function toggleOne(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <AdminLayout>
      {confirmBulk === "delete" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-gray-900 mb-2">Delete {selected.size} listings?</h3>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmBulk(null)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm">
                Cancel
              </button>
              <button onClick={() => void runBulk("delete")} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium">
                Delete all
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Properties</h2>
            <p className="text-sm text-gray-500">
              {properties.length} total ·{" "}
              {properties.filter((p) => p.status === "active").length} live ·{" "}
              {properties.filter((p) => p.featured).length} featured
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportCSV(filtered)}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm"
            >
              <Download size={15} /> Export
            </button>
            <button
              onClick={() => setLocation("/admin/properties/new")}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              data-testid="button-add-property"
            >
              <Plus size={16} /> Add Property
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
            <button onClick={() => void loadProperties()} className="flex items-center gap-1 font-medium underline">
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}
        {notice && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-2.5">
            {notice}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search by title, location or price..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="input-search-properties"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="select-filter-type"
            >
              <option value="all">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              <option value="active">Live</option>
              <option value="inactive">Hidden</option>
            </select>
            <div className="flex items-center gap-1.5">
              <ArrowUpDown size={14} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="price-high">Price: high to low</option>
                <option value="price-low">Price: low to high</option>
                <option value="title">Title A–Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Building2 size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No properties found</p>
              <p className="text-sm mt-1">
                {properties.length === 0
                  ? "Add your first listing to get started"
                  : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-500 text-xs uppercase tracking-wide">
                    <th className="pl-4 py-3 w-8">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleAll}
                        className="rounded border-gray-300"
                        aria-label="Select all"
                      />
                    </th>
                    <th className="px-4 py-3 font-medium">Property</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Transaction</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Featured</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p) => (
                    <tr
                      key={p.id}
                      className={`transition-colors ${selected.has(p.id) ? "bg-primary/5" : "hover:bg-gray-50"}`}
                      data-testid={`row-property-${p.id}`}
                    >
                      <td className="pl-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(p.id)}
                          onChange={() => toggleOne(p.id)}
                          className="rounded border-gray-300"
                          aria-label={`Select ${p.title}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.images[0] ? (
                            <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Building2 size={16} className="text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate max-w-[200px]">{p.title}</p>
                            <p className="text-xs text-gray-400 truncate">{p.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-gray-600">{p.type}</span>
                        <span className="block text-xs text-gray-400 capitalize">{p.category}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary">{p.price}</td>
                      <td className="px-4 py-3">
                        <span className={`capitalize text-xs px-2 py-1 rounded-full font-medium ${p.transactionType === "buy" ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"}`}>
                          {p.transactionType === "buy" ? "For Sale" : "For Rent"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => void patchOne(p.id, { status: p.status === "active" ? "inactive" : "active" })}
                          className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${p.status === "active" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                          title={p.status === "active" ? "Visible on the site — click to hide" : "Hidden from the site — click to publish"}
                          data-testid={`button-toggle-status-${p.id}`}
                        >
                          {p.status === "active" ? "Live" : "Hidden"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => void patchOne(p.id, { featured: !p.featured })}
                          className={`transition-colors ${p.featured ? "text-yellow-500 hover:text-yellow-600" : "text-gray-300 hover:text-yellow-400"}`}
                          title={p.featured ? "Featured on the homepage" : "Not featured"}
                          data-testid={`button-toggle-featured-${p.id}`}
                        >
                          <Star size={18} fill={p.featured ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setLocation(`/admin/properties/${p.id}/edit`)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                            data-testid={`button-edit-property-${p.id}`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => void duplicate(p.id)}
                            disabled={busy}
                            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-40"
                            title="Duplicate — handy for similar units in the same building"
                            data-testid={`button-duplicate-property-${p.id}`}
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => void handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                            title="Delete"
                            data-testid={`button-delete-property-${p.id}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <AdminBulkBar
          count={selected.size}
          actions={BULK_ACTIONS}
          busy={busy}
          onClear={() => setSelected(new Set())}
          onAction={(key) => (key === "delete" ? setConfirmBulk("delete") : void runBulk(key))}
        />
      </div>
    </AdminLayout>
  );
}
