import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      reportsDirectory: './coverage',
    },
    globals: true,
    mockReset: true,
    passWithNoTests: true,
    resolveSnapshotPath(path, extension) {
      return path.replace('.spec', extension)
    },
  },
})
