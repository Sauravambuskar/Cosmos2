import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import {
  Plus, Pencil, Trash2, Star, Search, Filter, Building2, Copy,
  Eye, EyeOff, AlertTriangle, RefreshCw,
} from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import AdminBulkBar, { type BulkAction } from "@/components/admin-bulk-bar";
import { adminFetch, adminJson, readError } from "@/lib/adminAuth";
import { matchesProjectQuery } from "@/lib/search";
import type { Project } from "@/lib/types";

const BULK_ACTIONS: BulkAction[] = [
  { key: "activate", label: "Publish", icon: Eye },
  { key: "deactivate", label: "Hide", icon: EyeOff },
  { key: "feature", label: "Feature", icon: Star },
  { key: "unfeature", label: "Unfeature", icon: Star },
  { key: "delete", label: "Delete", icon: Trash2, destructive: true },
];

export default function AdminProjects() {
  const [, setLocation] = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmBulk, setConfirmBulk] = useState<string | null>(null);

  useEffect(() => {
    void loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    setError("");
    try {
      setProjects(await adminJson<Project[]>("/api/admin/projects"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load projects");
    } finally {
      setLoading(false);
    }
  }

  function flash(message: string) {
    setNotice(message);
    setTimeout(() => setNotice(""), 3000);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await adminFetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        flash("Project deleted.");
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
      const copy = await adminJson<Project>(`/api/admin/projects/${id}/duplicate`, { method: "POST" });
      setProjects((prev) => [copy, ...prev]);
      flash("Copy created as a hidden draft — edit it, then publish.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not duplicate project");
    } finally {
      setBusy(false);
    }
  }

  async function patchOne(id: number, body: Partial<Project>) {
    const res = await adminFetch(`/api/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updated = (await res.json()) as Project;
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
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
        await adminJson("/api/admin/projects/bulk", {
          method: "POST",
          body: JSON.stringify({ ids, action }),
        });
        setProjects((prev) => prev.filter((p) => !selected.has(p.id)));
        flash(`${ids.length} project${ids.length > 1 ? "s" : ""} deleted.`);
      } else {
        const { projects: updated } = await adminJson<{ projects: Project[] }>(
          "/api/admin/projects/bulk",
          { method: "POST", body: JSON.stringify({ ids, action }) },
        );
        const byId = new Map(updated.map((p) => [p.id, p]));
        setProjects((prev) => prev.map((p) => byId.get(p.id) ?? p));
        flash(`${ids.length} project${ids.length > 1 ? "s" : ""} updated.`);
      }
      setSelected(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk action failed");
    } finally {
      setBusy(false);
      setConfirmBulk(null);
    }
  }

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const okType = typeFilter === "all" || p.type.toLowerCase() === typeFilter;
        const okStatus = statusFilter === "all" || p.status === statusFilter;
        return okType && okStatus && matchesProjectQuery(p, search);
      }),
    [projects, typeFilter, statusFilter, search],
  );

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
            <h3 className="font-semibold text-gray-900 mb-2">Delete {selected.size} projects?</h3>
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
            <h2 className="text-xl font-bold text-gray-900">Projects</h2>
            <p className="text-sm text-gray-500">
              {projects.length} total · {projects.filter((p) => p.active).length} live ·{" "}
              {projects.filter((p) => p.featured).length} featured
            </p>
          </div>
          <button
            onClick={() => setLocation("/admin/projects/new")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> Add Project
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
            <button onClick={() => void loadProjects()} className="flex items-center gap-1 font-medium underline">
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
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
              <option value="all">All Stages</option>
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Upcoming">Upcoming</option>
            </select>
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
              <p className="font-medium">No projects found</p>
              <p className="text-sm mt-1">
                {projects.length === 0
                  ? "Add your first project to get started"
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
                    <th className="px-4 py-3 font-medium">Project</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Stage</th>
                    <th className="px-4 py-3 font-medium">Units</th>
                    <th className="px-4 py-3 font-medium">Visibility</th>
                    <th className="px-4 py-3 font-medium">Featured</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p) => (
                    <tr
                      key={p.id}
                      className={`transition-colors ${selected.has(p.id) ? "bg-primary/5" : "hover:bg-gray-50"}`}
                      data-testid={`row-project-${p.id}`}
                    >
                      <td className="pl-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(p.id)}
                          onChange={() => toggleOne(p.id)}
                          className="rounded border-gray-300"
                          aria-label={`Select ${p.name}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.image ? (
                            <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Building2 size={16} className="text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate max-w-[200px]">{p.name}</p>
                            <p className="text-xs text-gray-400 truncate">{p.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-gray-600">{p.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            p.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : p.status === "Ongoing"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.units}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => void patchOne(p.id, { active: !p.active })}
                          className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${p.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                          title={p.active ? "Visible on the site — click to hide" : "Hidden — click to publish"}
                        >
                          {p.active ? "Live" : "Hidden"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => void patchOne(p.id, { featured: !p.featured })}
                          className={`transition-colors ${p.featured ? "text-yellow-500 hover:text-yellow-600" : "text-gray-300 hover:text-yellow-400"}`}
                          title={p.featured ? "Featured on the homepage" : "Not featured"}
                        >
                          <Star size={18} fill={p.featured ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setLocation(`/admin/projects/${p.id}/edit`)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => void duplicate(p.id)}
                            disabled={busy}
                            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-40"
                            title="Duplicate"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => void handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                            title="Delete"
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
