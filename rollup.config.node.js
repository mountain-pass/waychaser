import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'

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
    typescript(),
    commonjs()
  ]
}
