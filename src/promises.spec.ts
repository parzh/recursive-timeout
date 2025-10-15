export {}

const promises = await import('./promises')

describe('indexfile', () => {
  it('should export `setRecursive(…)` function', () => {
    expect(promises).toHaveProperty('setRecursive', expect.any(Function))
  })

  it('should export `setRecursive(…)` under the alias `setInterval(…)`', () => {
    expect(promises.setInterval === promises.setRecursive).toBe(true)
  })

  it('should export `clearRecursive(…)` function', () => {
    expect(promises).toHaveProperty('clearRecursive', expect.any(Function))
  })

  it('should export `clearRecursive(…)` under the alias `clearInterval(…)`', () => {
    expect(promises.clearInterval === promises.clearRecursive).toBe(true)
  })
})
