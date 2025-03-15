/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          salltech: {
            blue: '#3498db',
            purple: '#9b59b6',
            red: '#e74c3c',
            dark: '#1a1a2e',
            light: '#f7f7f7',
          }
        },
        fontFamily: {
          poppins: ['Poppins', 'sans-serif'],
        },
        backgroundSize: {
          '200%': '200% auto',
        },
        opacity: {
          '15': '0.15',
        },
        scale: {
          '105': '1.05',
        },
      },
    },
    plugins: [],
  };