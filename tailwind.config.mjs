/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9f9f9',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#c0c0c0',
          400: '#909090',
          500: '#1a1a1a',
          600: '#111111',
          700: '#000000',
        },
        accent: {
          50: '#f5f5f5',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#808080',
          500: '#333333',
          600: '#222222',
        },
      },
      fontFamily: {
        logo: ['"Baloo 2"', 'cursive'],
        body: ['"Quicksand"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
