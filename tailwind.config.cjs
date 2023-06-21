/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				background: 'rgb(var(--background) / <alpha-value>)',
				white: 'rgb(var(--antiflash-white) / <alpha-value>)',
				primary: 'rgb(var(--primary) / <alpha-value>)',
				secondary: 'rgb(var(--secondary) / <alpha-value>)',
				accent: 'rgb(var(--tiffany-blue) / <alpha-value>)',
			}
		}
	},
	plugins: [],
}
