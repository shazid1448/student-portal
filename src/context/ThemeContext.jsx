// src/context/ThemeContext.jsx
// Dark/Light mode + accent color, applied as data attributes on <html> so
// global.css can swap CSS variables per theme. Persisted via
// hooks/useLocalStorage.js (small single-key preferences — exactly what that
// hook is for), so the choice survives a refresh.

import { createContext, useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const ThemeContext = createContext(null);

export const ACCENTS = ["gold", "violet", "emerald", "rose"];

export function ThemeProvider({ children }) {
  const [mode, setMode] = useLocalStorage("themeMode", "dark");
  const [accent, setAccent] = useLocalStorage("themeAccent", "gold");
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage(
    "notificationsEnabled",
    true
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
  }, [accent]);

  function toggleMode() {
    setMode((m) => (m === "dark" ? "light" : "dark"));
  }

  const value = {
    mode,
    setMode,
    toggleMode,
    accent,
    setAccent,
    notificationsEnabled,
    setNotificationsEnabled,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
