/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#F8F9FB',
          dark: '#0D1117'
        },
        surface: {
          light: '#FFFFFF',
          dark: '#161B22',
          elevatedLight: '#F3F4F6',
          elevatedDark: '#21262D'
        },
        border: {
          light: '#E2E8F0',
          dark: '#30363D'
        },
        accent: {
          teal: '#0D9488',
          tealDark: '#14B8A6',
          blue: '#2563EB',
          blueDark: '#3B82F6'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
