import nodeResolve from '@rollup/plugin-node-resolve'
import { getBabelInputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import babelConfig from './babel.config.json'
import json from '@rollup/plugin-json'

export default {
  input: ['src/waychaser.js'],
  output: [
    {
      file: 'dist/waychaser.mjs',
      format: 'es',
      plugins: [terser()],
      sourcemap: true
    },
    {
      file: 'dist/waychaser.cjs',
      format: 'cjs',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  context: 'global',
  plugins: [
    json(),
    nodeResolve({
      browser: false
    }),
    commonjs(),
    getBabelInputPlugin(
      Object.assign(
        {
          babelHelpers: 'runtime'
        },
        babelConfig
      )
    )
  ]
}
