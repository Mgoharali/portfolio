/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  // We manage dark mode via [data-theme] attribute + CSS variables,
  // NOT Tailwind's built-in dark: prefix — so no darkMode key needed.

  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },

      // All colours reference CSS variables → automatically respond to theme switches
      colors: {
        bg:       "var(--bg)",
        surface:  "var(--surface)",
        surface2: "var(--surface-2)",
        border:   "var(--border)",
        accent:   "var(--accent)",
        accent2:  "var(--accent2)",
        muted:    "var(--muted)",
        text:     "var(--text)",
        subtle:   "var(--subtle)",
      },

      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "glow":    "glow 2s ease-in-out infinite alternate",
        "spin-slow": "spin 3s linear infinite",
      },

      keyframes: {
        fadeUp: {
          "0%":   { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: 0 },
          "100%": { opacity: 1 },
        },
        glow: {
          "0%":   { boxShadow: "0 0 20px var(--accent-soft)" },
          "100%": { boxShadow: "0 0 40px var(--accent-soft)" },
        },
      },

      screens: {
        xs: "480px",   // Extra small — wide phones
        // sm: 640  (tailwind default)
        // md: 768  (tailwind default)
        // lg: 1024 (tailwind default)
        // xl: 1280 (tailwind default)
      },

      spacing: {
        // Consistent max-width containers
        "container-sm": "640px",
        "container-md": "768px",
        "container-lg": "1024px",
        "container-xl": "1280px",
      },
    },
  },

  plugins: [],
}
