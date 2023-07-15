/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.svelte',
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

