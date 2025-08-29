import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Celestial theme colors
        celestial: {
          void: "hsl(var(--celestial-void))",
          cosmos: "hsl(var(--celestial-cosmos))",
          nebula: "hsl(var(--celestial-nebula))",
          star: "hsl(var(--celestial-star))",
          aurora: "hsl(var(--celestial-aurora))",
          plasma: "hsl(var(--celestial-plasma))",
          quantum: "hsl(var(--celestial-quantum))",
        },
        drift: {
          azure: "hsl(var(--drift-azure))",
          crimson: "hsl(var(--drift-crimson))",
          golden: "hsl(var(--drift-golden))",
          violet: "hsl(var(--drift-violet))",
          amber: "hsl(var(--drift-amber))",
          emerald: "hsl(var(--drift-emerald))",
          pearl: "hsl(var(--drift-pearl))",
          cosmic: "hsl(var(--drift-cosmic))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%": { "box-shadow": "0 0 5px hsl(var(--celestial-aurora))" },
          "100%": { "box-shadow": "0 0 20px hsl(var(--celestial-aurora)), 0 0 30px hsl(var(--celestial-aurora))" },
        },
        "drift": {
          "0%, 100%": { transform: "translateX(0px) rotateY(0deg)" },
          "33%": { transform: "translateX(10px) rotateY(5deg)" },
          "66%": { transform: "translateX(-10px) rotateY(-5deg)" },
        },
        "constellation": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite alternate",
        "drift": "drift 8s ease-in-out infinite",
        "constellation": "constellation 12s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
