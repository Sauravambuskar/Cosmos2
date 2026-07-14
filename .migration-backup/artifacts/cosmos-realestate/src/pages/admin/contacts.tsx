import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MessageSquare, Mail, Phone, Calendar } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { adminFetch, isAdminLoggedIn } from "@/lib/adminAuth";
import type { Contact } from "@/lib/types";

export default function AdminContacts() {
  const [, setLocation] = useLocation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!isAdminLoggedIn()) { setLocation("/admin/login"); return; }
    async function load() {
      try {
        const res = await adminFetch("/api/admin/contacts");
        if (res.ok) setContacts(await res.json() as Contact[]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [setLocation]);

  const filtered = filter === "all" ? contacts : contacts.filter((c) => c.interest === filter);

  function formatDate(dateStr: string | Date) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  }

  const interestColors: Record<string, string> = {
    residential: "bg-blue-50 text-blue-700",
    commercial: "bg-purple-50 text-purple-700",
    industrial: "bg-orange-50 text-orange-700",
    general: "bg-gray-100 text-gray-600",
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Enquiries</h2>
            <p className="text-sm text-gray-500">{contacts.length} total submissions</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="bg-white rounded-xl p-1 shadow-sm inline-flex gap-1">
          {["all", "residential", "commercial", "industrial", "general"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? "bg-primary text-white" : "text-gray-500 hover:text-gray-800"}`}
              data-testid={`button-filter-${f}`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 bg-white rounded-xl shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm text-center py-16 text-gray-400">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No enquiries yet</p>
            <p className="text-sm mt-1">Contact form submissions will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <div key={c.id} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow" data-testid={`card-contact-${c.id}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${interestColors[c.interest] ?? "bg-gray-100 text-gray-600"}`}>
                      {c.interest}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={12} />
                    {formatDate(c.createdAt)}
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={13} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  {c.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={13} className="text-gray-400 flex-shrink-0" />
                      <span>{c.phone}</span>
                    </div>
                  )}
                </div>

                {c.message && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 line-clamp-3">{c.message}</p>
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <a
                    href={`mailto:${c.email}`}
                    className="flex-1 text-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
                    data-testid={`link-email-${c.id}`}
                  >
                    Email
                  </a>
                  {c.phone && (
                    <a
                      href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-xs bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg transition-colors"
                      data-testid={`link-whatsapp-${c.id}`}
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
