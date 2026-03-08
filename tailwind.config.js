// 6NGen — Tailwind CSS v3 Konfigürasyonu
// Marka renkleri ve içerik yolları burada tanımlanır

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ari: {
          turuncu: '#E8960A',
          koyu: '#2a1500',
        }
      }
    },
  },
  plugins: [],
}
