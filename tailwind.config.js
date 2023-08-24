/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,css}'],
	theme: {
		extend: {
			fontSize: {
				xxs: '.625rem',
			}
		},
	},
	darkMode: 'class',
	plugins: [require('tailwind-scrollbar')],
};
