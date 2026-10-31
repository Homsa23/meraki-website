/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "meraki-black": "#101010",
        "meraki-gold": "#D9A441",
        "meraki-cream": "#EEE7D8",
        "meraki-stone": "#A9A9A5",
      },
    },
  },
  plugins: [],
};
