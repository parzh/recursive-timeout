// @ts-check
import typescript from '@rollup/plugin-typescript'
import { fileURLToPath } from 'url'

/**
 * @param {string} pathname
 */
const resolve = (pathname) => fileURLToPath(new URL(pathname, import.meta.url))

const configPath = resolve('tsconfig.build.json')
const esmOutPath = resolve('dist/esm')
const cjsOutPath = resolve('dist/cjs')

const input = {
  index: resolve('src/index.ts'),
  promises: resolve('src/promises.ts'),
}

const external = ['util', /^node:/] // this produces a much better output than rollup-plugin-node-externals

export default [
  {
    input,
    output: {
      dir: esmOutPath,
      format: 'esm',
      sourcemap: true,
    },
    external,
    plugins: [
      typescript({
        tsconfig: configPath,
        target: 'es2022',
        outDir: esmOutPath,
      }),
    ],
  },
  {
    input,
    output: {
      dir: cjsOutPath,
      format: 'cjs',
      sourcemap: true,
      entryFileNames: '[name].cjs',
    },
    external,
    plugins: [
      typescript({
        tsconfig: configPath,
        target: 'es2020',
        outDir: cjsOutPath,
      }),
    ],
  },
]
