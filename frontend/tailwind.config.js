/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // --- FONT CONFIGURATION ---
      fontFamily: {
        // The default font (replaces standard sans)
        sans: ['var(--font-inter)', 'sans-serif'],
        // Your custom fonts
        logo: ['var(--font-abril)', 'cursive'],
        subtitle: ['var(--font-aref)', 'serif'],
      },
      // --------------------------
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'primary': '#1E3A8A',
        'primary-dark': '#172554',
        'secondary': '#93C5FD',
        'background': '#F0F4F8',
        'sidebar': '#FFFFFF',
        'sidebar-text': '#334155',
        'sidebar-active': '#BFDBFE',
      },
    },
  },
  plugins: [],
};