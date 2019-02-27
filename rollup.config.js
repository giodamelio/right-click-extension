import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import banner from 'rollup-plugin-banner';

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
      builtins(),

      // Add banner to compiled js
      banner(
        '<%= pkg.name %> version <%= pkg.version %>\nby <%= pkg.author %>\nFull source at <%= pkg.homepage %>'
      )
    ]
  }
];
