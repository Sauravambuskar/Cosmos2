import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Plus, Pencil, Trash2, Star, Search, Filter, Building2 } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { adminFetch, isAdminLoggedIn } from "@/lib/adminAuth";
import { matchesProjectQuery } from "@/lib/search";
import type { Project } from "@/lib/types";

export default function AdminProjects() {
  const [, setLocation] = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) { setLocation("/admin/login"); return; }
    loadProjects();
  }, [setLocation]);

  async function loadProjects() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/projects");
      if (res.ok) setProjects(await res.json() as Project[]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await adminFetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) setProjects((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleFeatured(project: Project) {
    const res = await adminFetch(`/api/admin/projects/${project.id}`, {
      method: "PUT",
      body: JSON.stringify({ featured: !project.featured }),
    });
    if (res.ok) {
      const updated = await res.json() as Project;
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
  }

  async function toggleActive(project: Project) {
    const res = await adminFetch(`/api/admin/projects/${project.id}`, {
      method: "PUT",
      body: JSON.stringify({ active: !project.active }),
    });
    if (res.ok) {
      const updated = await res.json() as Project;
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
  }

  const filtered = projects.filter((p) => {
    const matchesType = typeFilter === "all" || p.type.toLowerCase() === typeFilter;
    return matchesType && matchesProjectQuery(p, search);
  });

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Projects</h2>
            <p className="text-sm text-gray-500">{projects.length} total projects</p>
          </div>
          <button
            onClick={() => setLocation("/admin/projects/new")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> Add Project
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
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
              <p className="text-sm mt-1">Try adjusting your filters or add a new project</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-500 text-xs uppercase tracking-wide">
                    <th className="px-4 py-3 font-medium">Project</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Units</th>
                    <th className="px-4 py-3 font-medium">Active</th>
                    <th className="px-4 py-3 font-medium">Featured</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
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
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          p.status === "Completed" ? "bg-green-100 text-green-700" :
                          p.status === "Ongoing" ? "bg-blue-100 text-blue-700" :
                          "bg-orange-100 text-orange-700"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.units}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive(p)}
                          className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${p.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                        >
                          {p.active ? "Active" : "Hidden"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleFeatured(p)}
                          className={`transition-colors ${p.featured ? "text-yellow-500 hover:text-yellow-600" : "text-gray-300 hover:text-yellow-400"}`}
                        >
                          <Star size={18} fill={p.featured ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setLocation(`/admin/projects/${p.id}/edit`)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
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
      </div>
    </AdminLayout>
  );
}
