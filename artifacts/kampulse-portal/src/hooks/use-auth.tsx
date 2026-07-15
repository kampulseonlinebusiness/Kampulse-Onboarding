import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AdminUser } from "@workspace/api-client-react";
import { setAuthTokenGetter } from "@workspace/api-client-react/custom-fetch";

interface AuthState {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (tokens: AuthState) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "kampulse_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAuthState(parsed);
      }
    } catch (e) {
      console.error("Failed to parse auth state", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setAuthTokenGetter(() => authState?.accessToken || null);
  }, [authState]);

  const login = (data: AuthState) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    setAuthState(data);
  };

  const logout = () => {
    // Revoke the refresh token server-side so it cannot be reused.
    // This is best-effort: we clear client state regardless of the response.
    const currentRefreshToken = authState?.refreshToken;
    if (currentRefreshToken) {
      fetch(`${import.meta.env.BASE_URL}api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: currentRefreshToken }),
      }).catch(() => {
        // Non-blocking — the token will expire naturally in 7 days even if
        // this call fails (e.g. network is offline).
      });
    }

    localStorage.removeItem(AUTH_KEY);
    setAuthState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState?.user || null,
        isAuthenticated: !!authState,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
