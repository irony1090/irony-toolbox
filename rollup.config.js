// import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";
// import pluginTypescript from "@rollup/plugin-typescript";
import pluginTypescript from "rollup-plugin-typescript2";
import pluginCommonjs from "@rollup/plugin-commonjs";
import pluginNodeResolve from "@rollup/plugin-node-resolve";
// import pluginMultiInput from "@rollup/plugin-multi-entry";
import { babel } from "@rollup/plugin-babel";
import * as path from "path";
// import flatDtsPlugin from "rollup-plugin-flat-dts";
// import pluginDts from 'rollup-plugin-dts'
// import pluginDts from 'rollup-plugin-flat-dts'
// import pluginDel from "rollup-plugin-delete";
const moduleName = pkg.name.replace(/^@.*\//, '');
const inputFileName = "src/index.ts";
// const inputFileNames = [ 'src/**/*.ts' ];
const author = pkg.author;
const banner = `
  /**
   * @license
   * author: ${author}
   * ${moduleName}.js v${pkg.version}
   * Released under the ${pkg.license} license.
   */
`;
const typescriptConfig = {
  // package: 'tsconfig.json',
  // clean: true,
  useTsconfigDeclarationDir: true,
  // module: 'esnext'
  // exclude: ["test/**/*"]
  // tsconfigOverride: {
  //   exclude: ["test/**/*"]
  // }
}
export default [

  // new !?
  // new ES
  // {
  //   input: inputFileNames,
  //   output: {
  //     format: 'es',
  //     dir: 'dist',
  //     entryFileNames: `[name].${pkg.module.replace(/[^.]*\./, '')}`,
  //     sourceMap: true,
  //     exports: "named",

  //     banner,
  //   },
  //   plugins: [ 
  //     pluginMultiInput(),
  //     pluginTypescript(typescriptConfig),
  //     pluginCommonjs({
  //       extensions: [".js", ".ts"],
  //     }),
  //     babel({
  //       babelHelpers: "bundled",
  //       configFile: path.resolve(__dirname, ".babelrc.js"),
  //     }),
  //     pluginNodeResolve({
  //       browser: false,
  //     }),
  //   ],
  // },

  // new CommonJS
  // {
  //   input: inputFileNames,
  //   output: [
  //     {
  //       file: pkg.main,
  //       // dir: 'dist',
  //       format: "cjs",
  //       // entryFileNames: `[name].${pkg.main.replace(/[^.]*\./, '')}`,
  //       sourcemap: "inline",
  //       // sourcemap: true,
  //       banner,
  //       exports: "default",
  //     },
  //   ],
  //   external: [
  //     ...Object.keys(pkg.dependencies || {}),
  //     ...Object.keys(pkg.devDependencies || {}),
  //   ],
  //   plugins: [
  //     pluginMultiInput(),
  //     pluginTypescript(typescriptConfig),
  //     pluginCommonjs({
  //       extensions: [".js", ".ts"],
  //     }),
  //     babel({
  //       babelHelpers: "bundled",
  //       configFile: path.resolve(__dirname, ".babelrc.js"),
  //     }),
  //     pluginNodeResolve({
  //       browser: false,
  //     }),
  //   ],
  // },



  {
    input: inputFileName,
    output: [
      {
        name: moduleName,
        file: pkg.browser,
        format: "iife",
        sourcemap: "inline",
        banner,
      },
      {
        name: moduleName,
        file: pkg.browser.replace(".js", ".min.js"),
        format: "iife",
        sourcemap: "inline",
        banner,
        // plugins: [terser()],
      },
    ],
    // preserveModules: true,
    plugins: [
      pluginTypescript(typescriptConfig),
      pluginCommonjs({
        extensions: [".js", ".ts"],
      }),
      babel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      pluginNodeResolve({
        browser: true,
      }),
    ],
  },

  // ES
  {
    input: inputFileName,
    output: [
      {
        // dir: 'dist',
        file: pkg.module,
        format: "es",
        sourcemap: "inline",
        // sourcemap: true,
        banner,
        exports: "named",
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    // preserveModules: true,
    plugins: [
      pluginTypescript(typescriptConfig),
      pluginCommonjs({
        extensions: [".js", ".ts"],
      }),
      babel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      pluginNodeResolve({
        browser: false,
      }),
    ],
  },

  // // CommonJS
  {
    input: inputFileName,
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: "inline",
        banner,
        exports: "default",
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      pluginTypescript(typescriptConfig),
      pluginCommonjs({
        extensions: [".js", ".ts"],
      }),
      babel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      pluginNodeResolve({
        browser: false,
      }),
    ],
  },

  // type
  // {
  //   input: inputFileName,
  //   // output: [{ file: pkg.types, format: 'cjs' }],
  //   output: [{ file: pkg.types, format: 'es' }],
  //   plugins: [
  //     pluginDts(),
  //     // pluginDel({ hook: "buildEnd", targets: "./dist/dts" })
  //   ],
  // }
];