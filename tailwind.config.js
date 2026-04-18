/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  safelist: [
    "md:bg-transparent",
    "md:shadow-none",
    "md:backdrop-blur-none",
    "md:text-white",
    "md:text-white/70",
    "md:bg-white",
    "md:before:bg-white",
    "md:after:bg-white",
  ],

  theme: {
    extend: {
      // 🎨 CORES DO DESIGN SYSTEM
      colors: {
        primary: "#1e3a8a",
        "primary-light": "#3b82f6",
        secondary: "#dc2626",
        "secondary-hover": "#b91c1c",
        accent: "#fbbf24",
        "bg-alt": "#f9fafb",
        "bg-dark": "#0d1b4b",
        "bg-bg-dark": "#0d1b4b",
        "text-muted": "#6b7280",
        "text-light": "#9ca3af",
        border: "#e5e7eb",
        "border-strong": "#d1d5db",
      },

      // 🔤 FONTES
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'Nunito'", "system-ui", "sans-serif"],
      },

      // 📐 CONTAINERS
      maxWidth: {
        container: "1100px",
        "container-sm": "860px",
      },

      // 🔘 BORDAS
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
      },

      // 🌑 SOMBRAS
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.08)",
        md: "0 4px 16px rgba(0,0,0,0.08)",
        lg: "0 16px 40px rgba(30,58,138,0.12)",
        hover: "0 20px 48px rgba(30,58,138,0.2)",
      },

      // ✨ ANIMAÇÕES CUSTOM
      animation: {
        pulseSlow: "ping 2s infinite",
      },
    },
  },

  plugins: [],
};