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
          warm: '#FDFBF7',
          light: '#FAF8F5',
          dark: '#0D1117'
        },
        surface: {
          warm: '#FFFFFF',
          warmElevated: '#F8F5EE',
          light: '#FFFFFF',
          dark: '#161B22',
          elevatedLight: '#F3F4F6',
          elevatedDark: '#21262D'
        },
        border: {
          warm: '#EAE4D8',
          light: '#E2E8F0',
          dark: '#30363D'
        },
        accent: {
          warm: '#D97706',
          gold: '#F59E0B',
          teal: '#0D9488',
          tealDark: '#14B8A6',
          blue: '#2563EB',
          blueDark: '#3B82F6'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Newsreader', 'Charter', 'Georgia', 'Cambria', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        'warm-sm': '0 1px 2px 0 rgba(120, 80, 20, 0.05)',
        'warm': '0 4px 20px -2px rgba(120, 80, 20, 0.06), 0 2px 6px -1px rgba(120, 80, 20, 0.04)',
        'warm-lg': '0 12px 36px -4px rgba(120, 80, 20, 0.08), 0 4px 12px -2px rgba(120, 80, 20, 0.04)'
      }
    },
  },
  plugins: [],
}
