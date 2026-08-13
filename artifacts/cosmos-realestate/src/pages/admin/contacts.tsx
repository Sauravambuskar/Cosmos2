import { useState, useEffect, useMemo } from "react";
import {
  MessageSquare, Mail, Phone, Calendar, Search, Download,
  Trash2, StickyNote, ChevronDown, X, Check, Filter,
  MailOpen, AlertTriangle, RefreshCw, CheckCheck,
} from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import AdminBulkBar, { type BulkAction } from "@/components/admin-bulk-bar";
import { adminFetch, adminJson, readError } from "@/lib/adminAuth";
import { matchesContactQuery } from "@/lib/search";
import type { Contact } from "@/lib/types";

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  new:       { label: "New",       color: "bg-blue-50 text-blue-700 border-blue-200",     dot: "bg-blue-500"   },
  contacted: { label: "Contacted", color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" },
  qualified: { label: "Qualified", color: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
  closed:    { label: "Closed",    color: "bg-green-50 text-green-700 border-green-200",   dot: "bg-green-500"  },
};

const INTEREST_COLORS: Record<string, string> = {
  residential: "bg-sky-50 text-sky-700",
  commercial:  "bg-violet-50 text-violet-700",
  industrial:  "bg-orange-50 text-orange-700",
  general:     "bg-gray-100 text-gray-600",
};

const BULK_ACTIONS: BulkAction[] = [
  { key: "mark-read", label: "Mark read", icon: CheckCheck },
  { key: "mark-unread", label: "Mark unread", icon: Mail },
  { key: "status-contacted", label: "→ Contacted", icon: Check },
  { key: "status-qualified", label: "→ Qualified", icon: Check },
  { key: "status-closed", label: "→ Closed", icon: Check },
  { key: "delete", label: "Delete", icon: Trash2, destructive: true },
];

function StatusDropdown({
  contactId, current, onChange,
}: { contactId: number; current: string; onChange: (id: number, s: string) => void }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[current] ?? STATUS_CONFIG.new;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.color}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
        <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 min-w-[140px]">
          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
            <button
              key={key}
              onClick={() => { onChange(contactId, key); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 transition-colors ${current === key ? "font-semibold" : ""}`}
            >
              <span className={`w-2 h-2 rounded-full ${val.dot}`} />
              {val.label}
              {current === key && <Check size={11} className="ml-auto text-green-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NotesModal({
  contact, onClose, onSave,
}: { contact: Contact; onClose: () => void; onSave: (id: number, notes: string) => void }) {
  const [notes, setNotes] = useState(contact.notes ?? "");
  const [saving, setSaving] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Notes — {contact.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{contact.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add your notes about this lead…"
          rows={5}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
          <button
            onClick={async () => { setSaving(true); await onSave(contact.id, notes); setSaving(false); onClose(); }}
            disabled={saving}
            className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Notes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function exportCSV(contacts: Contact[]) {
  const headers = ["Name", "Email", "Phone", "Interest", "Status", "Read", "Message", "Notes", "Date"];
  const rows = contacts.map((c) => [
    c.name, c.email, c.phone, c.interest, c.leadStatus, c.readAt ? "Yes" : "No", c.message, c.notes,
    new Date(c.createdAt).toLocaleDateString("en-IN"),
  ].map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterInterest, setFilterInterest] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "status">("date");
  const [notesContact, setNotesContact] = useState<Contact | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setContacts(await adminJson<Contact[]>("/api/admin/contacts"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load leads");
    } finally {
      setLoading(false);
    }
  }

  async function patchContact(id: number, data: Partial<Pick<Contact, "leadStatus" | "notes" | "readAt">>) {
    const res = await adminFetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json() as Contact;
      setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } else {
      setError(await readError(res));
    }
  }

  /** Toggle the read flag — the `readAt` column exists but nothing ever set it. */
  function toggleRead(c: Contact) {
    void patchContact(c.id, { readAt: c.readAt ? null : new Date().toISOString() });
  }

  async function deleteContact(id: number) {
    const res = await adminFetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    if (res.ok || res.status === 204) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } else {
      setError(await readError(res));
    }
    setDeleteConfirm(null);
  }

  async function runBulk(key: string) {
    const ids = [...selected];
    if (ids.length === 0) return;
    setBusy(true);
    setError("");

    const body = key.startsWith("status-")
      ? { ids, action: "set-status", leadStatus: key.slice("status-".length) }
      : { ids, action: key };

    try {
      if (key === "delete") {
        await adminJson("/api/admin/contacts/bulk", { method: "POST", body: JSON.stringify(body) });
        setContacts((prev) => prev.filter((c) => !selected.has(c.id)));
      } else {
        const { contacts: updated } = await adminJson<{ contacts: Contact[] }>(
          "/api/admin/contacts/bulk",
          { method: "POST", body: JSON.stringify(body) },
        );
        const byId = new Map(updated.map((c) => [c.id, c]));
        setContacts((prev) => prev.map((c) => byId.get(c.id) ?? c));
      }
      setSelected(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk action failed");
    } finally {
      setBusy(false);
      setConfirmBulkDelete(false);
    }
  }

  const filtered = useMemo(() => {
    let list = [...contacts];
    if (filterInterest !== "all") list = list.filter((c) => c.interest === filterInterest);
    if (filterStatus !== "all") list = list.filter((c) => c.leadStatus === filterStatus);
    if (onlyUnread) list = list.filter((c) => !c.readAt);
    if (search.trim()) {
      list = list.filter((c) => matchesContactQuery(c, search));
    }
    list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "status") return a.leadStatus.localeCompare(b.leadStatus);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [contacts, filterInterest, filterStatus, onlyUnread, search, sortBy]);

  const newCount = contacts.filter((c) => c.leadStatus === "new").length;
  const unreadCount = contacts.filter((c) => !c.readAt).length;
  const allVisibleSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.id));

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) filtered.forEach((c) => next.delete(c.id));
      else filtered.forEach((c) => next.add(c.id));
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

  function fmt(d: string | Date) {
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <AdminLayout>
      {notesContact && (
        <NotesModal
          contact={notesContact}
          onClose={() => setNotesContact(null)}
          onSave={(id, notes) => patchContact(id, { notes })}
        />
      )}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-gray-900 mb-2">Delete Lead?</h3>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={() => void deleteContact(deleteConfirm)} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
      {confirmBulkDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-gray-900 mb-2">Delete {selected.size} leads?</h3>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmBulkDelete(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={() => void runBulk("delete")} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium">Delete all</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Leads & Enquiries</h2>
            <p className="text-sm text-gray-500">
              {contacts.length} total · <span className="text-blue-600 font-medium">{newCount} new</span>
              {unreadCount > 0 && <> · {unreadCount} unread</>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {filtered.length > 0 && (
              <button
                onClick={toggleAll}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2"
              >
                {allVisibleSelected ? "Clear selection" : "Select all"}
              </button>
            )}
            <button
              onClick={() => exportCSV(filtered)}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm"
            >
              <Download size={15} /> Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
            <button onClick={() => void load()} className="flex items-center gap-1 font-medium underline">
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {/* Filters + Search */}
        <div className="bg-white rounded-xl p-3 shadow-sm flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone…"
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter size={13} className="text-gray-400" />
            {["all", "residential", "commercial", "industrial", "general"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterInterest(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filterInterest === f ? "bg-primary text-white" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => setOnlyUnread(!onlyUnread)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${onlyUnread ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <Mail size={12} /> Unread only
          </button>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-600"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "name" | "status")}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-600"
          >
            <option value="date">Newest First</option>
            <option value="name">Name A–Z</option>
            <option value="status">By Status</option>
          </select>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex items-center justify-center h-48 bg-white rounded-xl shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm text-center py-16 text-gray-400">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">
              {contacts.length === 0 ? "No enquiries yet" : "No leads match your filters"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <div
                key={c.id}
                className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative ${
                  selected.has(c.id) ? "ring-2 ring-primary" : !c.readAt ? "ring-2 ring-blue-400/40" : ""
                }`}
              >
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {!c.readAt && (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                  )}
                  <input
                    type="checkbox"
                    checked={selected.has(c.id)}
                    onChange={() => toggleOne(c.id)}
                    className="rounded border-gray-300"
                    aria-label={`Select ${c.name}`}
                  />
                </div>

                {/* Top row */}
                <div className="flex items-start gap-3 mb-3 pr-16">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{c.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${INTEREST_COLORS[c.interest] ?? "bg-gray-100 text-gray-600"}`}>
                        {c.interest}
                      </span>
                      <StatusDropdown
                        contactId={c.id}
                        current={c.leadStatus}
                        onChange={(id, s) => patchContact(id, { leadStatus: s })}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-1.5 mb-3">
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
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={12} />
                    {fmt(c.createdAt)}
                  </div>
                </div>

                {/* Message */}
                {c.message && (
                  <div className="bg-gray-50 rounded-lg p-2.5 mb-3">
                    <p className="text-xs text-gray-600 line-clamp-2">{c.message}</p>
                  </div>
                )}

                {/* Notes preview */}
                {c.notes && (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-2.5 mb-3">
                    <p className="text-xs text-yellow-800 line-clamp-2">📝 {c.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-1.5 mt-3">
                  <a href={`mailto:${c.email}`} className="flex-1 text-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors">
                    Email
                  </a>
                  {c.phone && (
                    <a
                      href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-center text-xs bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg transition-colors"
                    >
                      WhatsApp
                    </a>
                  )}
                  <button
                    onClick={() => toggleRead(c)}
                    className={`px-3 py-2 text-xs rounded-lg transition-colors ${c.readAt ? "bg-gray-100 hover:bg-gray-200 text-gray-500" : "bg-blue-50 hover:bg-blue-100 text-blue-700"}`}
                    title={c.readAt ? "Mark as unread" : "Mark as read"}
                  >
                    {c.readAt ? <MailOpen size={13} /> : <Mail size={13} />}
                  </button>
                  <button
                    onClick={() => setNotesContact(c)}
                    className="px-3 py-2 text-xs bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-colors"
                    title="Add / edit notes"
                  >
                    <StickyNote size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(c.id)}
                    className="px-3 py-2 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    title="Delete lead"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <AdminBulkBar
          count={selected.size}
          actions={BULK_ACTIONS}
          busy={busy}
          onClear={() => setSelected(new Set())}
          onAction={(key) => (key === "delete" ? setConfirmBulkDelete(true) : void runBulk(key))}
        />
      </div>
    </AdminLayout>
  );
}
