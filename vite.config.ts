import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import autoImport from 'sveltekit-autoimport';

export default defineConfig({
	plugins: [
		autoImport({
			components: ['./src/components'],
			module: {
				svelte: ['onMount', 'createEventDispatcher'],
				'flowbite-svelte': ['Button','DarkMode'],
				'flowbite-svelte-blocks': ['Section', 'HeroHeader', "HeroBody"]
			},
			mapping: {
				IconifyIcon: `import IconifyIcon from '@iconify/svelte'`,
				AnimatedCounter: `import { AnimatedCounter } from '@benzara/svelte-animated-counter'`

			}
		}),
		sveltekit()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
