import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ out: 'build' }),
		alias: {
			$components: "src/lib/components",
			$utils: "src/lib/utils",
			$stores: "src/stores"
		}
	}
};

export default config;
