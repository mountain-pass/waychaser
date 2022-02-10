import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'

globalThis.regeneratorRuntime = undefined

export default {
  input: ['src/waychaser.js'],
  output: [
    {
      file: 'dist/waychaser.js',
      format: 'umd',
      name: 'waychaser',
      sourcemap: true,
      plugins: []
    },
    {
      file: 'dist/waychaser.min.js',
      format: 'umd',
      name: 'waychaser',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  context: 'window',
  plugins: [
    typescript(),
    commonjs(),
    resolve({
      browser: true
    })
  ]
}
