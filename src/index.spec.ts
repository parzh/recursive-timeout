export {}

const indexfile = await import('./index')

describe('indexfile', () => {
  it('should export `setInterval(…)` function', () => {
    expect(indexfile).toHaveProperty('setInterval', expect.any(Function))
  })

  it('should export `setRecursive(…)` function', () => {
    expect(indexfile).toHaveProperty('setRecursive', expect.any(Function))
  })

  it('should export the same function under the aliases `setInterval` and `setRecursive`', () => {
    expect(indexfile.setInterval === indexfile.setRecursive).toBe(true)
  })

  it('should export `promises` namespace', () => {
    expect(indexfile).toHaveProperty('promises', expect.any(Object))
  })
})
