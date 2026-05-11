// src/components/ui/ThemeToggle.jsx
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

/**
 * Accessible, animated theme toggle button.
 * Works in both Navbar (desktop + mobile) and AdminLayout.
 */
export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`
        relative w-9 h-9 rounded-xl flex items-center justify-center
        bg-[var(--surface)] border border-[var(--border)]
        text-[var(--subtle)] hover:text-[var(--accent)]
        hover:border-[var(--accent-soft)]
        transition-all duration-200 overflow-hidden
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]
        ${className}
      `}
    >
      {/* Sun icon — shown in dark mode (click → go light) */}
      <span
        aria-hidden="true"
        className={`absolute transition-all duration-300 ${
          isDark ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 rotate-90"
        }`}
      >
        <Sun size={15} />
      </span>

      {/* Moon icon — shown in light mode (click → go dark) */}
      <span
        aria-hidden="true"
        className={`absolute transition-all duration-300 ${
          !isDark ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 -rotate-90"
        }`}
      >
        <Moon size={15} />
      </span>
    </button>
  );
}
