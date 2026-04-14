import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import { FavouritesProvider } from "../contexts/FavouritesContext";
import { useTheme } from "../contexts/ThemeContext";

function InnerLayout() {
  const { isDark, colors } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavouritesProvider>
          <InnerLayout />
        </FavouritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}