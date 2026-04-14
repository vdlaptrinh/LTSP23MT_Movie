import { createContext, useContext, useState, ReactNode } from "react";
import { useColorScheme } from "react-native";

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  card: string;
  error: string;
  tabBarActive: string;
  tabBarInactive: string;
  tabBarBg: string;
  inputBg: string;
  buttonGradient: string[];
}

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const lightColors: ThemeColors = {
  background: "#F5F5F5",
  surface: "#FFFFFF",
  text: "#1A1A2E",
  textSecondary: "#6B7280",
  primary: "#6C63FF",
  border: "#E5E7EB",
  card: "#FFFFFF",
  error: "#EF4444",
  tabBarActive: "#6C63FF",
  tabBarInactive: "#9CA3AF",
  tabBarBg: "#FFFFFF",
  inputBg: "#F3F4F6",
  buttonGradient: ["#6C63FF", "#5A52E0"],
};

const darkColors: ThemeColors = {
  background: "#0F0F1A",
  surface: "#1A1A2E",
  text: "#EAEAEA",
  textSecondary: "#9CA3AF",
  primary: "#8B83FF",
  border: "#2D2D44",
  card: "#1E1E32",
  error: "#F87171",
  tabBarActive: "#8B83FF",
  tabBarInactive: "#6B7280",
  tabBarBg: "#1A1A2E",
  inputBg: "#252540",
  buttonGradient: ["#8B83FF", "#7A72E8"],
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === "dark");

  const toggleTheme = () => setIsDark((prev) => !prev);
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}