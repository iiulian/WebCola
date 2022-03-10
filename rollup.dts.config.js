import dts from "rollup-plugin-dts";

export default [
	{
		input: "./tmp/index.d.ts",
		output: [{
			file: "dist/index.d.ts",
			format: "esm",
			banner: 'export as namespace cola;'
		}],
		plugins: [dts()],
	},
];
