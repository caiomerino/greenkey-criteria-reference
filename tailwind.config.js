/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
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
        // Dark mode equivalents
        'gk-dark-bg': '#0F172A',
        'gk-dark-surface': '#1E293B',
        'gk-dark-border': '#334155',
        'gk-dark-text': '#E2E8F0',
        'gk-dark-text-muted': '#94A3B8',
      },
      fontFamily: {
        'lato': ['Lato', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
