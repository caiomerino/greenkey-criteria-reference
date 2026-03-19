/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ── Keep original colors for backward compat ── */
        'gk-blue': '#0066CC',
        'gk-blue-dark': '#004C99',
        'gk-blue-light': '#E6F0FA',
        'gk-green': '#009933',
        'gk-green-light': '#E6F5EC',
        'gk-green-dark': '#007A29',
        'gk-green-web': '#51AE32',
        'gk-teal': '#15AF97',
        'gk-surface': '#F8FAFB',
        'gk-border': '#E2E8F0',
        'gk-text': '#1E293B',
        'gk-text-muted': '#64748B',
        'gk-dark-bg': '#0F172A',
        'gk-dark-surface': '#1E293B',
        'gk-dark-border': '#334155',
        'gk-dark-text': '#E2E8F0',
        'gk-dark-text-muted': '#94A3B8',

        /* ── shadcn HSL color system ── */
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        'lato': ['Lato', 'Arial', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
