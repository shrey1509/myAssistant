/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors:{
        'myBg':'#ffd6ff',
        'myPrimary':'#865eff',
        'mySecondary':'#6898ff',

      },
    },
  },
  plugins: [],
}
