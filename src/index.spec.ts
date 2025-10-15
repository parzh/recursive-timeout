export {}

const indexfile = await import('./index')

describe('indexfile', () => {
  it('should export `setRecursive(…)` function', () => {
    expect(indexfile).toHaveProperty('setRecursive', expect.any(Function))
  })

  it('should export `setRecursive(…)` under the alias `setInterval(…)`', () => {
    expect(indexfile.setInterval === indexfile.setRecursive).toBe(true)
  })

  it('should export `clearRecursive(…)` function', () => {
    expect(indexfile).toHaveProperty('clearRecursive', expect.any(Function))
  })

  it('should export `clearRecursive(…)` under the alias `clearInterval(…)`', () => {
    expect(indexfile.clearInterval === indexfile.clearRecursive).toBe(true)
  })

  it('should export `promises` namespace', () => {
    expect(indexfile).toHaveProperty('promises', expect.any(Object))
  })
})
