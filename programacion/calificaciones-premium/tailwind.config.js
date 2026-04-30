module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E11D48', // rose-600
          hover: '#BE123C',
          soft: '#FFF1F2'
        },
        dark: {
          DEFAULT: '#0F172A', // slate-900
          card: '#1E293B',
          accent: '#334155'
        }
      },
      borderRadius: {
        'premium': '2.5rem',
      }
    },
  },
  plugins: [],
}
