import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import {
  Building2, MessageSquare, TrendingUp, Star, Plus, FolderKanban,
  Settings, AlertTriangle, RefreshCw, Mail, ArrowRight, EyeOff,
} from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { adminJson } from "@/lib/adminAuth";
import { useSiteSettings } from "@/hooks/use-site-settings";
import type { Property, Contact } from "@/lib/types";

interface Stats {
  properties: {
    total: number; active: number; inactive: number; featured: number;
    forSale: number; forRent: number; byType: Record<string, number>;
    activeValueLakhs: number;
  };
  projects: {
    total: number; active: number; featured: number;
    byStatus: Record<string, number>; byType: Record<string, number>;
  };
  leads: {
    total: number; unread: number; new: number; last7Days: number; last30Days: number;
    byStatus: Record<string, number>; byInterest: Record<string, number>;
    trend: { date: string; count: number }[];
  };
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500",
  contacted: "bg-yellow-500",
  qualified: "bg-purple-500",
  closed: "bg-green-500",
};

/** Lakhs → a readable Indian-format figure. */
function formatLakhs(lakhs: number): string {
  if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)} Cr`;
  return `₹${lakhs.toLocaleString("en-IN")} L`;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const settings = useSiteSettings();
  const [stats, setStats] = useState<Stats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [s, p, c] = await Promise.all([
        adminJson<Stats>("/api/admin/stats"),
        adminJson<Property[]>("/api/admin/properties"),
        adminJson<Contact[]>("/api/admin/contacts"),
      ]);
      setStats(s);
      setProperties(p);
      setContacts(c);
    } catch (e) {
      // Surfaced rather than swallowed: a failed load used to render as "0
      // properties", which reads like the data is gone.
      setError(e instanceof Error ? e.message : "Could not load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const cards = stats
    ? [
        {
          label: "Total Properties",
          value: stats.properties.total,
          icon: Building2,
          color: "bg-blue-500",
          sub: `${stats.properties.active} active · ${stats.properties.inactive} hidden`,
          href: "/admin/properties",
        },
        {
          label: "Featured",
          value: stats.properties.featured,
          icon: Star,
          color: "bg-yellow-500",
          sub: "shown on the homepage",
          href: "/admin/properties",
        },
        {
          label: "New Leads",
          value: stats.leads.new,
          icon: MessageSquare,
          color: stats.leads.new > 0 ? "bg-red-500" : "bg-green-500",
          sub: `${stats.leads.last7Days} this week · ${stats.leads.total} all time`,
          href: "/admin/contacts",
        },
        {
          label: "Active Portfolio",
          value: formatLakhs(stats.properties.activeValueLakhs),
          icon: TrendingUp,
          color: "bg-purple-500",
          sub: `${stats.properties.forSale} for sale · ${stats.properties.forRent} for rent`,
          href: "/admin/properties",
        },
      ]
    : [];

  const quickActions = [
    { label: "Add Property", icon: Plus, href: "/admin/properties/new", primary: true },
    { label: "Add Project", icon: FolderKanban, href: "/admin/projects/new" },
    { label: "View Leads", icon: Mail, href: "/admin/contacts" },
    { label: "Site Settings", icon: Settings, href: "/admin/settings" },
  ];

  const recentProperties = properties.slice(0, 5);
  const recentContacts = contacts.slice(0, 5);
  const maxTrend = Math.max(1, ...(stats?.leads.trend.map((t) => t.count) ?? [1]));

  return (
    <AdminLayout>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl p-8 shadow-sm text-center max-w-md mx-auto">
          <AlertTriangle className="mx-auto mb-3 text-red-500" size={32} />
          <h2 className="font-semibold text-gray-900 mb-1">Couldn't load your dashboard</h2>
          <p className="text-sm text-gray-500 mb-5">{error}</p>
          <button
            onClick={() => void load()}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium"
          >
            <RefreshCw size={14} /> Try again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {settings.features.maintenanceMode && (
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3">
              <EyeOff size={16} className="flex-shrink-0 mt-0.5" />
              <span>
                <strong>Maintenance mode is on</strong> — visitors see a notice instead of your
                site.{" "}
                <Link href="/admin/settings" className="underline font-medium">
                  Turn it off
                </Link>
              </span>
            </div>
          )}

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.href}
                  onClick={() => setLocation(a.href)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    a.primary
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-white text-gray-700 shadow-sm hover:bg-gray-50"
                  }`}
                  data-testid={`button-quick-${a.label.toLowerCase().replace(/ /g, "-")}`}
                >
                  <Icon size={15} /> {a.label}
                </button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((stat) => {
              const Icon = stat.icon;
              return (
                <button
                  key={stat.label}
                  onClick={() => setLocation(stat.href)}
                  className="bg-white rounded-xl p-5 shadow-sm text-left hover:shadow-md transition-shadow"
                  data-testid={`stat-${stat.label.toLowerCase().replace(/ /g, "-")}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`${stat.color} rounded-lg p-2.5`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lead trend */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-1">Enquiries this week</h2>
              <p className="text-xs text-gray-400 mb-4">{stats?.leads.last7Days ?? 0} in the last 7 days</p>
              <div className="flex items-end justify-between gap-1.5 h-28">
                {stats?.leads.trend.map((day) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[10px] text-gray-400">{day.count || ""}</span>
                    <div
                      className="w-full bg-primary/80 rounded-t min-h-[2px]"
                      style={{ height: `${(day.count / maxTrend) * 100}%` }}
                      title={`${day.count} on ${day.date}`}
                    />
                    <span className="text-[10px] text-gray-400">
                      {new Date(day.date).toLocaleDateString("en-IN", { weekday: "narrow" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead funnel */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-4">Lead pipeline</h2>
              <div className="space-y-3">
                {["new", "contacted", "qualified", "closed"].map((status) => {
                  const count = stats?.leads.byStatus[status] ?? 0;
                  const total = stats?.leads.total || 1;
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`${STATUS_COLORS[status]} h-1.5 rounded-full`}
                            style={{ width: `${(count / total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-6 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!!stats?.leads.unread && (
                <Link
                  href="/admin/contacts"
                  className="flex items-center gap-1.5 mt-4 pt-3 border-t border-gray-50 text-sm text-primary hover:underline"
                >
                  {stats.leads.unread} unread {stats.leads.unread === 1 ? "enquiry" : "enquiries"}
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>

            {/* Category breakdown */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-4">Listings by category</h2>
              <div className="space-y-3">
                {["residential", "commercial", "industrial"].map((type) => {
                  const count = stats?.properties.byType[type] ?? 0;
                  const total = stats?.properties.total || 1;
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(count / total) * 100}%` }} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-6 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 text-sm text-gray-500">
                {stats?.projects.total ?? 0} projects · {stats?.projects.active ?? 0} live
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent properties */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">Recent Properties</h2>
                <Link href="/admin/properties" className="text-xs text-primary hover:underline">
                  View all
                </Link>
              </div>
              {recentProperties.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">
                  No properties yet. Add your first one!
                </p>
              ) : (
                <div className="space-y-2">
                  {recentProperties.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setLocation(`/admin/properties/${p.id}/edit`)}
                      className="w-full flex items-center justify-between py-2 border-b border-gray-50 last:border-0 text-left hover:bg-gray-50 rounded px-1 -mx-1"
                      data-testid={`row-property-${p.id}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                        <p className="text-xs text-gray-400">
                          {p.location} &middot; {p.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">{p.price}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            p.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recent enquiries */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">Recent Enquiries</h2>
                <Link href="/admin/contacts" className="text-xs text-primary hover:underline">
                  View all
                </Link>
              </div>
              {recentContacts.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No enquiries yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentContacts.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                      data-testid={`row-contact-${c.id}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {c.name}
                          {!c.readAt && (
                            <span className="ml-2 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full align-middle">
                              NEW
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {c.email}
                          {c.phone ? ` · ${c.phone}` : ""}
                        </p>
                      </div>
                      <span className="capitalize bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs ml-3 flex-shrink-0">
                        {c.interest}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
