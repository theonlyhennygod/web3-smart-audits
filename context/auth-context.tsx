"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  address: string;
  network: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (userData: User) => void; // Function to set user after successful backend sign-in
  logout: () => Promise<void>; // Function to handle logout
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Loading session initially
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check session on initial mount
  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/auth/session");
        if (!isMounted) return;

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser({
              name: data.user.displayName || 'Wallet',
              address: data.user.walletAddress,
              network: data.user.network || 'unknown'
            });
          } else {
            setUser(null);
          }
        } else {
          console.error("Session check API error:", response.statusText);
          setUser(null);
        }
      } catch (fetchError) {
        if (!isMounted) return;
        console.error("Session check fetch failed:", fetchError);
        setUser(null);
        // Optionally set an error state here if needed
        // setError("Failed to check session.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    setError(null); // Clear any previous errors on successful login
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" });
      if (!response.ok) {
         throw new Error("Sign out failed");
      }
      setUser(null);
      // Optionally add router.push('/') or similar if needed after logout
      router.refresh(); // Refresh to ensure server state is cleared
    } catch (logoutError: any) {
      console.error("Error disconnecting wallet:", logoutError);
      setError("Failed to disconnect wallet."); // Provide user feedback
    }
  }, [router]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
