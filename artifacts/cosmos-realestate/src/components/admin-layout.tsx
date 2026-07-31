import { useState } from "react";
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
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { clearAdminToken } from "@/lib/adminAuth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  function handleLogout() {
    clearAdminToken();
    setLocation("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Admin pages must never be indexed or appear in search results. */}
      <Helmet>
        <title>Admin Panel | Cosmos Real Estate</title>
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
            <div>
              <p className="font-bold text-white text-sm">COSMOS</p>
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
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
                data-testid={`link-admin-${item.label.toLowerCase()}`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
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
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-gray-800 font-semibold text-lg">
            {navItems.find((n) => n.href === location)?.label ?? "Admin"}
          </h1>
          <span className="text-sm text-gray-500">Cosmos Real Estate</span>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
