import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig({
	plugins: [
		laravel({
			input: ['resources/css/app.css', 'resources/js/app.ts'],
			refresh: true,
		}),
		tailwindcss(),
		svelte(),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './resources/js'),
		},
	},
});
