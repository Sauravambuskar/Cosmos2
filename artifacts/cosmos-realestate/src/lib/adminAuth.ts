const ADMIN_TOKEN_KEY = "cosmos_admin_token";

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

/**
 * Expiry timestamp (ms) encoded in the JWT, or null if the token is missing or
 * unreadable. Only the `exp` claim is read — the signature is still verified by
 * the server on every request; this is purely so the UI can tell an expired
 * session apart from a valid one before making a call.
 */
export function getTokenExpiry(token: string | null = getAdminToken()): number | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const claims = JSON.parse(json) as { exp?: number };
    return typeof claims.exp === "number" ? claims.exp * 1000 : null;
  } catch {
    return null;
  }
}

/**
 * A stored token is not the same thing as a working session: the JWT lasts 7
 * days, and once it lapses every admin request 401s. Checking `exp` here is what
 * stops the panel from rendering an empty dashboard that looks like data loss.
 */
export function isAdminLoggedIn(): boolean {
  const token = getAdminToken();
  if (!token) return false;
  const expiry = getTokenExpiry(token);
  if (expiry === null) return true; // Unreadable but present — let the server decide.
  return expiry > Date.now();
}

/** Milliseconds until the session lapses, or null when there is no session. */
export function millisUntilExpiry(): number | null {
  const expiry = getTokenExpiry();
  return expiry === null ? null : expiry - Date.now();
}

export class AdminAuthError extends Error {
  constructor(message = "Your session has expired. Please sign in again.") {
    super(message);
    this.name = "AdminAuthError";
  }
}

/** Sends the admin to the login screen, preserving where they were headed. */
export function redirectToLogin(reason: "expired" | "unauthorized" = "expired"): void {
  clearAdminToken();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const from = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.href = `${base}/admin/login?reason=${reason}&from=${from}`;
}

export async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // A rejected token is a dead end for every other call on the page, so handle
  // it once here instead of leaving each screen to render a confusing blank.
  if (res.status === 401) {
    redirectToLogin("expired");
    throw new AdminAuthError();
  }

  return res;
}

/**
 * `adminFetch` that parses JSON and throws on failure, so callers can surface a
 * real error instead of silently falling through to an empty state.
 */
export async function adminJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await adminFetch(path, options);
  if (!res.ok) {
    throw new Error(await readError(res));
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Best-effort extraction of the API's error message. */
export async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    if (data.error) return data.error;
  } catch {
    /* not JSON */
  }
  return `Request failed (${res.status})`;
}
