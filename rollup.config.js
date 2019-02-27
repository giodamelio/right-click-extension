import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

export default [
  {
    input: 'src/background.js',
    output: {
      file: 'build/background.js',
      format: 'esm',
      name: 'background'
    },
    plugins: [
      // Handle commonjs imports
      resolve({
        preferBuiltins: true
      }),
      commonjs(),

      // Nodejs buildins shim
      builtins()
    ]
  }
];
