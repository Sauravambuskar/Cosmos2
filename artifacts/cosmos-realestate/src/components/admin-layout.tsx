import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Home,
  FolderKanban,
  Settings,
  UserCog,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { clearAdminToken, adminJson, isAdminLoggedIn } from "@/lib/adminAuth";
import AdminGuard from "@/components/admin-guard";
import { useSiteSettings } from "@/hooks/use-site-settings";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  /** Routes that should light this item up, beyond an exact href match. */
  match?: (path: string) => boolean;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/admin/properties",
    label: "Properties",
    icon: Building2,
    match: (p) => p.startsWith("/admin/properties"),
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: FolderKanban,
    match: (p) => p.startsWith("/admin/projects"),
  },
  {
    href: "/admin/contacts",
    label: "Leads",
    icon: MessageSquare,
    match: (p) => p.startsWith("/admin/contacts"),
  },
  {
    href: "/admin/settings",
    label: "Site Settings",
    icon: Settings,
    match: (p) => p.startsWith("/admin/settings"),
  },
  {
    href: "/admin/account",
    label: "Account",
    icon: UserCog,
    match: (p) => p.startsWith("/admin/account"),
  },
];

/** Sub-page headings, so a nested route never falls back to a bare "Admin". */
const PAGE_TITLES: { test: RegExp; title: string }[] = [
  { test: /^\/admin\/properties\/new$/, title: "Add Property" },
  { test: /^\/admin\/properties\/\d+\/edit$/, title: "Edit Property" },
  { test: /^\/admin\/projects\/new$/, title: "Add Project" },
  { test: /^\/admin\/projects\/\d+\/edit$/, title: "Edit Project" },
];

function pageTitle(path: string): string {
  const exact = navItems.find((n) => n.href === path);
  if (exact) return exact.label;
  const nested = PAGE_TITLES.find((p) => p.test.test(path));
  if (nested) return nested.title;
  const section = navItems.find((n) => n.match?.(path));
  return section?.label ?? "Admin";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unread, setUnread] = useState<number | null>(null);
  const settings = useSiteSettings();

  // Unread-lead count for the sidebar badge, so new enquiries are visible from
  // any screen rather than only on the Leads page.
  useEffect(() => {
    let cancelled = false;
    // Skip when there is no usable session — AdminGuard is already routing to
    // the login screen, and firing this would only race it.
    if (!isAdminLoggedIn()) return;
    adminJson<{ leads: { unread: number } }>("/api/admin/stats")
      .then((stats) => {
        if (!cancelled) setUnread(stats.leads.unread);
      })
      .catch(() => {
        /* the badge is a nicety — never block the page on it */
      });
    return () => {
      cancelled = true;
    };
  }, [location]);

  function handleLogout() {
    clearAdminToken();
    setLocation("/admin/login");
  }

  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-gray-100">
        {/* Admin pages must never be indexed or appear in search results. */}
        <Helmet>
          {/* Helmet requires a single string child here — an interpolated
              fragment is rejected at runtime. */}
          <title>{`${pageTitle(location)} | Admin — ${settings.brand.legalName}`}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-16"
          } transition-all duration-300 bg-gray-900 text-white flex flex-col flex-shrink-0`}
        >
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="font-bold text-white text-sm truncate">{settings.brand.name}</p>
                <p className="text-gray-400 text-xs">Admin Panel</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white p-1"
              data-testid="button-toggle-sidebar"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.match?.(location) ?? false);
              const showBadge = item.href === "/admin/contacts" && !!unread;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarOpen ? undefined : item.label}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                  data-testid={`link-admin-${item.label.toLowerCase().replace(/ /g, "-")}`}
                >
                  <span className="relative flex-shrink-0">
                    <Icon size={18} />
                    {showBadge && !sidebarOpen && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </span>
                  {sidebarOpen && <span className="flex-1">{item.label}</span>}
                  {sidebarOpen && showBadge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unread}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="border-t border-gray-700 p-4 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-2 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              data-testid="link-admin-view-site"
            >
              <Home size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>View Site</span>}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-2 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors w-full"
              data-testid="button-admin-logout"
            >
              <LogOut size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4">
            <h1 className="text-gray-800 font-semibold text-lg truncate">{pageTitle(location)}</h1>
            <div className="flex items-center gap-3 flex-shrink-0">
              {settings.features.maintenanceMode && (
                <span
                  className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full"
                  title="The public site is showing the maintenance notice"
                >
                  <AlertTriangle size={12} /> Maintenance mode
                </span>
              )}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
              >
                {settings.brand.legalName} <ExternalLink size={13} />
              </a>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
