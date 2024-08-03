import type {Config} from 'tailwindcss'

export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
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
} satisfies Config
