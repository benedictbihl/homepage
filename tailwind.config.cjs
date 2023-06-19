/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				background: 'rgb(var(--xanthous) / <alpha-value>)',
				white: 'rgb(var(--antiflash-white) / <alpha-value>)',
				primary: 'rgb(var(--sapphire) / <alpha-value>)',
				secondary: 'rgb(var(--blue-gray) / <alpha-value>)',
				accent: 'rgb(var(--tiffany-blue) / <alpha-value>)',
			}
		}
	},
	plugins: [],
}
