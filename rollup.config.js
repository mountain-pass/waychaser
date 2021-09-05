import resolve from '@rollup/plugin-node-resolve'
import { getBabelInputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import { babelConfig } from './browser-babel-config.js'

export default {
  input: ['src/waychaser.js'],
  output: [
    {
      file: 'dist/waychaser.iife.js',
      format: 'iife',
      name: 'waychaser',
      sourcemap: true
    },
    {
      file: 'dist/waychaser.iife.min.js',
      format: 'iife',
      name: 'waychaser',
      plugins: [terser()],
      sourcemap: true
    },
    {
      file: 'dist/waychaser.js',
      format: 'cjs',
      plugins: [terser()],
      sourcemap: true
    }
  ],
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
