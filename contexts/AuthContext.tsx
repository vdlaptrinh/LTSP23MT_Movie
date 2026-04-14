import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync("user");
        if (stored) setUser(JSON.parse(stored));
      } catch {
        // ignore read errors
      }
      setIsLoading(false);
    })();
  }, []);

  const login = async (email: string, _password: string) => {
    const name = email.split("@")[0].replace(/[._]/g, " ");
    const capitalized = name
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const u = { name: capitalized, email };
    setUser(u);
    await SecureStore.setItemAsync("user", JSON.stringify(u));
    return true;
  };

  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync("user");
  };

  const updateProfile = (name: string) => {
    if (user) {
      const updated = { ...user, name };
      setUser(updated);
      SecureStore.setItemAsync("user", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, isLoading, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}