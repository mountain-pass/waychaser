import resolve from '@rollup/plugin-node-resolve'
import { getBabelInputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import { babelConfig } from './browser-babel-config.js'

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
    commonjs(),
    resolve({
      browser: true
    }),
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
