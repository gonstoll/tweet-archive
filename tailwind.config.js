/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      gridTemplateColumns: {
        'tweet-md': 'repeat(2, minmax(250px, 550px))',
        'tweet-xl': 'repeat(3, minmax(250px, 550px))',
      },
      maxWidth: {
        '8xl': '100rem', // 1600px
      },
    },
  },
  plugins: [],
}
