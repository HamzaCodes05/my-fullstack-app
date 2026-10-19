import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { API_BASE_URL } from "../config";
import {
  clearSession,
  loadSession,
  saveSession,
  type Session,
  type StoredUser,
} from "./storage";

type AuthContextValue = {
  user: StoredUser | null;
  /** True until the stored session has been read on boot. */
  initializing: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** fetch() that attaches the access token and retries once after refreshing. */
  authFetch: (path: string, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthResponse = {
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: StoredUser;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Mirrors `session` so authFetch always reads current tokens without being
  // re-created (and invalidating callers' deps) on every rotation.
  const sessionRef = useRef<Session | null>(null);
  // Collapses concurrent 401s into a single refresh call.
  const refreshRef = useRef<Promise<Session | null> | null>(null);

  const applySession = useCallback(async (next: Session | null) => {
    sessionRef.current = next;
    setSession(next);

    if (next) {
      await saveSession(next);
    } else {
      await clearSession();
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadSession()
      .then((stored) => {
        if (cancelled) {
          return;
        }

        sessionRef.current = stored;
        setSession(stored);
      })
      .finally(() => {
        if (!cancelled) {
          setInitializing(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json().catch(() => ({}))) as AuthResponse;

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (!data.accessToken || !data.refreshToken || !data.user) {
        throw new Error("Login response was incomplete.");
      }

      await applySession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    const current = sessionRef.current;

    // Clear locally first so a slow/unreachable API can't keep you signed in.
    await applySession(null);

    if (current) {
      // Best-effort revocation in the background.
      fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: current.refreshToken }),
      }).catch(() => undefined);
    }
  }, [applySession]);

  const refresh = useCallback(async () => {
    const current = sessionRef.current;

    if (!current) {
      return null;
    }

    if (!refreshRef.current) {
      refreshRef.current = (async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: current.refreshToken }),
          });

          const data = (await response
            .json()
            .catch(() => ({}))) as AuthResponse;

          if (
            !response.ok ||
            !data.accessToken ||
            !data.refreshToken ||
            !data.user
          ) {
            await applySession(null);
            return null;
          }

          const next: Session = {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: data.user,
          };

          await applySession(next);
          return next;
        } catch {
          // Network error: keep the session so the user can retry offline.
          return null;
        } finally {
          refreshRef.current = null;
        }
      })();
    }

    return refreshRef.current;
  }, [applySession]);

  const authFetch = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

      const call = (token: string | undefined) => {
        const headers = new Headers(init.headers);

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }

        return fetch(url, { ...init, headers });
      };

      const response = await call(sessionRef.current?.accessToken);

      if (response.status !== 401 || !sessionRef.current) {
        return response;
      }

      const refreshed = await refresh();

      if (!refreshed) {
        return response;
      }

      return call(refreshed.accessToken);
    },
    [refresh],
  );

  const value = useMemo(
    () => ({ user: session?.user ?? null, initializing, login, logout, authFetch }),
    [session, initializing, login, logout, authFetch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
