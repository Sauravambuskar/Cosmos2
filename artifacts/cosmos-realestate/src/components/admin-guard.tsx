import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ShieldAlert } from "lucide-react";
import { adminFetch, isAdminLoggedIn, millisUntilExpiry, clearAdminToken } from "@/lib/adminAuth";

type State = "checking" | "ok" | "denied";

/**
 * Gate for every admin screen.
 *
 * Previously each page only checked that *a* token string existed in
 * localStorage. Once the 7-day JWT lapsed the pages still rendered, every API
 * call 401'd, and the panel showed "0 properties / no leads" — indistinguishable
 * from an empty database. This verifies the session against the server before
 * rendering anything, and schedules a sign-out for the moment the token expires
 * so a long-lived tab does not drift into that state either.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<State>("checking");

  useEffect(() => {
    let cancelled = false;

    if (!isAdminLoggedIn()) {
      clearAdminToken();
      setLocation("/admin/login?reason=expired");
      return;
    }

    // `adminFetch` redirects to the login screen on a 401 by itself; this call
    // exists so that happens on page load rather than after a blank render.
    adminFetch("/api/admin/session")
      .then((res) => {
        if (cancelled) return;
        setState(res.ok ? "ok" : "denied");
      })
      .catch(() => {
        if (!cancelled) setState("denied");
      });

    // Sign out precisely when the token dies, instead of leaving an open tab
    // making calls that will all be rejected.
    const remaining = millisUntilExpiry();
    const timer =
      remaining !== null && remaining > 0 && remaining < 2 ** 31 - 1
        ? window.setTimeout(() => {
            clearAdminToken();
            setLocation("/admin/login?reason=expired");
          }, remaining)
        : undefined;

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [setLocation]);

  if (state === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-sm text-center">
          <ShieldAlert className="mx-auto mb-3 text-red-500" size={32} />
          <h1 className="font-semibold text-gray-900 mb-1">Session ended</h1>
          <p className="text-sm text-gray-500 mb-5">
            We couldn't verify your sign-in. Please log in again.
          </p>
          <button
            onClick={() => {
              clearAdminToken();
              setLocation("/admin/login");
            }}
            className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium"
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
