import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FBF9EF',
        black: '#0A0A0A',
        charcoal: '#1A1A1A',
        gray: {
          50: '#F8F8F6',
          100: '#EDEDE5',
          200: '#D4D4CC',
          300: '#B8B8B0',
          400: '#94948C',
          500: '#707068',
          600: '#4C4C44',
          700: '#383830',
          800: '#24241C',
          900: '#10100C',
        },
        accent: {
          blue: '#3B82F6',
          violet: '#8B5CF6',
          amber: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
export default config