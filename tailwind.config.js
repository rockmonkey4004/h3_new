/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,md,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          light: '#D0E1F9',
          DEFAULT: '#4D648D',
          dark: '#283655',
        },
        highlight: '#F5E663',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.accent.DEFAULT'),
              '&:hover': {
                color: theme('colors.accent.dark'),
              },
            },
            h1: {
              color: theme('colors.accent.dark'),
            },
            h2: {
              color: theme('colors.accent.dark'),
            },
            h3: {
              color: theme('colors.accent.DEFAULT'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}; 