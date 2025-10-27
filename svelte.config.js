// SOSTITUISCI COMPLETAMENTE il file svelte.config.js
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'$components': './src/components',
			'$lib': './src/lib'
		}
	}
};

export default config;
