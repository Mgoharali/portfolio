// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "portfolio-theme";
const THEMES = /** @type {const} */ (["dark", "light"]);

/**
 * Reads saved theme, falling back to OS preference, then 'dark'.
 * Runs only once on mount — no flash of wrong theme.
 */
function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEMES.includes(saved)) return saved;
  } catch {
    // localStorage blocked (private browsing, security policy) — ignore
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  return "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme class to <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    // Also drive Tailwind darkMode if ever switched to class strategy
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors silently
    }
  }, [theme]);

  // Listen to OS preference changes (e.g. user switches system theme)
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: light)");
    if (!mq) return;
    const handler = (e) => {
      // Only auto-switch if user has no saved preference
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          setTheme(e.matches ? "light" : "dark");
        }
      } catch {
        setTheme(e.matches ? "light" : "dark");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}