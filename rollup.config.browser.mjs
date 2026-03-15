import { createRequire } from "module";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
const require = createRequire(import.meta.url);
const tsconfig = require("./tsconfig.production.json");
const production = !process.env.ROLLUP_WATCH;

//globalThis.regeneratorRuntime = undefined

const exclude = tsconfig.exclude;

export default {
  input: ["src/waychaser.ts"],
  output: [
    {
      file: "dist/waychaser.es.js",
      format: "es",
      name: "waychaser",
      sourcemap: !production,
      plugins: [],
    },
    {
      file: "dist/waychaser.es.min.js",
      format: "es",
      name: "waychaser",
      plugins: [terser()],
      sourcemap: !production,
    },
  ],
  context: "window",
  plugins: [
    typescript({
      sourceMap: !production,
      inlineSources: !production,
      exclude: exclude,
    }),
    commonjs(),
    resolve({
      browser: true,
      preferBuiltins: true,
    }),
  ],
};
