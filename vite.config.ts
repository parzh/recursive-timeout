import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { fileURLToPath } from 'url'

const resolve = (pathname: string) => fileURLToPath(new URL(pathname, import.meta.url))

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      entry: {
        index: resolve('src/index.ts'),
        promises: resolve('src/promises.ts'),
      },
      fileName(format, entryName) {
        if (format === 'es') {
          return `esm/${entryName}.js`
        }

        if (format === 'cjs') {
          return `cjs/${entryName}.cjs`
        }

        return `${entryName}.js`
      },
    },
  },
  plugins: [
    dts({
      tsconfigPath: resolve('tsconfig.build.json'),
    }),
  ],
})
