import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';  // instala con `npm install -D svelte-preprocess`

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({ typescript: true }),  // habilita TS
  kit: {
    adapter: adapter()
  }
};

export default config;
