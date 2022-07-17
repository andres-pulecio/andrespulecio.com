import resolve from '@rollup/plugin-node-resolve'; // locate and bundle dependencies in node_modules (mandatory)
import { terser } from "rollup-plugin-terser"; // code minification (optional)
import * as THREE from 'three';
import * as CANNON from "cannon-es";

export default {
	external: [
		'https://cdn.jsdelivr.net/npm/cannon-es@0.18.0/dist/cannon-es.js',
		'https://cdnjs.cloudflare.com/ajax/libs/three.js/110/three.min.js',
	],
	input: 'src/main.js',
	output: [
		{
			format: 'umd',
			name: 'MYAPP',
			file: 'build/bundle.js',
		},
	],	
	plugins: [ resolve(), terser() ],
};
