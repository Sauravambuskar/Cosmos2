import { useEffect, useState } from "react";
import { KeyRound, UserCog, Eye, EyeOff, Check, ShieldCheck, Info } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { adminJson } from "@/lib/adminAuth";

interface Account {
  username: string;
  displayName: string;
  email: string;
  lastLoginAt: string | null;
  bootstrap?: boolean;
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

/** Rough strength signal — enough to discourage "admin123" without pretending to be a policy engine. */
function strength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"];
  const colors = ["bg-red-500", "bg-red-400", "bg-yellow-400", "bg-yellow-500", "bg-green-500", "bg-green-600"];
  return { score, label: labels[score], color: colors[score] };
}

export default function AdminAccount() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    adminJson<Account>("/api/admin/account")
      .then((data) => {
        setAccount(data);
        setDisplayName(data.displayName ?? "");
        setEmail(data.email ?? "");
      })
      .catch(() => {
        /* the guard already handles an invalid session */
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileErr("");
    setProfileMsg("");
    setSavingProfile(true);
    try {
      await adminJson("/api/admin/account", {
        method: "PATCH",
        body: JSON.stringify({ displayName, email }),
      });
      setProfileMsg("Profile saved.");
    } catch (err) {
      setProfileErr(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwErr("");
    setPwMsg("");

    if (next !== confirm) {
      setPwErr("The new passwords do not match.");
      return;
    }
    if (next.length < 8) {
      setPwErr("Choose a password of at least 8 characters.");
      return;
    }

    setSavingPw(true);
    try {
      const res = await adminJson<{ message: string }>("/api/admin/account/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      setPwMsg(res.message);
      setCurrent("");
      setNext("");
      setConfirm("");
      setAccount((prev) => (prev ? { ...prev, bootstrap: false } : prev));
    } catch (err) {
      setPwErr(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setSavingPw(false);
    }
  }

  const meter = strength(next);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Account</h2>
          <p className="text-sm text-gray-500">
            Signed in as <span className="font-medium text-gray-700">{account?.username}</span>
            {account?.lastLoginAt && (
              <> · last login {new Date(account.lastLoginAt).toLocaleString("en-IN")}</>
            )}
          </p>
        </div>

        {account?.bootstrap && (
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3">
            <Info size={16} className="flex-shrink-0 mt-0.5" />
            <span>
              Your password still comes from the server's environment variables. Change it below to
              move it into the database — after that you can update it any time from here, without
              a redeploy.
            </span>
          </div>
        )}

        {/* Profile */}
        <form onSubmit={saveProfile} className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 text-sm uppercase tracking-wide">
            <UserCog size={15} /> Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClass} placeholder="e.g. Jatin Arora" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} type="email" placeholder="you@example.com" />
            </div>
          </div>
          {profileErr && <p className="text-sm text-red-600">{profileErr}</p>}
          {profileMsg && (
            <p className="flex items-center gap-1.5 text-sm text-green-700"><Check size={14} /> {profileMsg}</p>
          )}
          <button
            type="submit"
            disabled={savingProfile}
            className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60"
          >
            {savingProfile ? "Saving…" : "Save profile"}
          </button>
        </form>

        {/* Password */}
        <form onSubmit={changePassword} className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 text-sm uppercase tracking-wide">
            <KeyRound size={15} /> Change password
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
            <input
              type={show ? "text" : "password"}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
              className={inputClass}
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={next}
                onChange={(e) => setNext(e.target.value)}
                required
                minLength={8}
                className={inputClass}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={show ? "Hide passwords" : "Show passwords"}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {next && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${meter.color} transition-all`} style={{ width: `${(meter.score / 5) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-20 text-right">{meter.label}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
            <input
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className={inputClass}
              autoComplete="new-password"
            />
            {confirm && next !== confirm && (
              <p className="text-xs text-red-600 mt-1">Passwords do not match.</p>
            )}
          </div>

          {pwErr && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{pwErr}</div>
          )}
          {pwMsg && (
            <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3">
              <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" /> {pwMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={savingPw}
            className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60"
            data-testid="button-change-password"
          >
            {savingPw ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
