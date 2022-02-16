import typescript from '@rollup/plugin-typescript';

export default {
	input: 'src/index.ts',
	output: {
		dir: 'dist',
		name: 'webcola',
		format: 'umd',
		sourcemap: true
	},
	external: [],
	plugins: [
		typescript()
	]
};
