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
        "deep-ink": "#08090C",
        basalt: "#242127",
        crimson: "#7E2920",
        "burnt-orange": "#C45B27",
        ochre: "#D9A441",
        "linen-cream": "#E8DDC5",
        // Legacy aliases kept for the existing cart and catalog components.
        "meraki-black": "#08090C",
        "meraki-gold": "#D9A441",
        "meraki-cream": "#E8DDC5",
        "meraki-stone": "#A9A9A5",
      },
    },
  },
  plugins: [],
};
