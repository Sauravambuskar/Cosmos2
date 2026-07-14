import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Building2, MessageSquare, TrendingUp, Star, Plus } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { adminFetch, isAdminLoggedIn } from "@/lib/adminAuth";
import type { Property, Contact } from "@/lib/types";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      setLocation("/admin/login");
      return;
    }
    async function load() {
      try {
        const [pRes, cRes] = await Promise.all([
          adminFetch("/api/admin/properties"),
          adminFetch("/api/admin/contacts"),
        ]);
        if (pRes.ok) setProperties(await pRes.json() as Property[]);
        if (cRes.ok) setContacts(await cRes.json() as Contact[]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [setLocation]);

  const stats = [
    {
      label: "Total Properties",
      value: properties.length,
      icon: Building2,
      color: "bg-blue-500",
      sub: `${properties.filter((p) => p.status === "active").length} active`,
    },
    {
      label: "Featured",
      value: properties.filter((p) => p.featured).length,
      icon: Star,
      color: "bg-yellow-500",
      sub: "highlighted on homepage",
    },
    {
      label: "Enquiries",
      value: contacts.length,
      icon: MessageSquare,
      color: "bg-green-500",
      sub: "total contact submissions",
    },
    {
      label: "For Rent",
      value: properties.filter((p) => p.transactionType === "rent").length,
      icon: TrendingUp,
      color: "bg-purple-500",
      sub: `${properties.filter((p) => p.transactionType === "buy").length} for sale`,
    },
  ];

  const typeBreakdown = ["residential", "commercial", "industrial"].map((t) => ({
    type: t.charAt(0).toUpperCase() + t.slice(1),
    count: properties.filter((p) => p.type === t).length,
  }));

  const recentProperties = properties.slice(0, 5);
  const recentContacts = contacts.slice(0, 5);

  return (
    <AdminLayout>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm" data-testid={`stat-${stat.label.toLowerCase().replace(/ /g, "-")}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`${stat.color} rounded-lg p-2.5`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Type Breakdown */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-4">By Category</h2>
              <div className="space-y-3">
                {typeBreakdown.map((t) => (
                  <div key={t.type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t.type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: properties.length ? `${(t.count / properties.length) * 100}%` : "0%" }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-6 text-right">{t.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Properties */}
            <div className="bg-white rounded-xl p-5 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">Recent Properties</h2>
                <button
                  onClick={() => setLocation("/admin/properties/new")}
                  className="flex items-center gap-1.5 text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                  data-testid="button-add-property"
                >
                  <Plus size={13} /> Add New
                </button>
              </div>
              {recentProperties.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No properties yet. Add your first one!</p>
              ) : (
                <div className="space-y-2">
                  {recentProperties.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0" data-testid={`row-property-${p.id}`}>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.location} &middot; {p.category}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">{p.price}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Enquiries */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">Recent Enquiries</h2>
            {recentContacts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No enquiries yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Email</th>
                      <th className="pb-2 font-medium">Phone</th>
                      <th className="pb-2 font-medium">Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentContacts.map((c) => (
                      <tr key={c.id} className="border-b border-gray-50 last:border-0" data-testid={`row-contact-${c.id}`}>
                        <td className="py-2.5 font-medium text-gray-800">{c.name}</td>
                        <td className="py-2.5 text-gray-600">{c.email}</td>
                        <td className="py-2.5 text-gray-600">{c.phone}</td>
                        <td className="py-2.5">
                          <span className="capitalize bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">{c.interest}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
