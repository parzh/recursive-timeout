export {}

const promises = await import('./promises')

describe('indexfile', () => {
  it('should export `setInterval(…)` function', () => {
    expect(promises).toHaveProperty('setInterval', expect.any(Function))
  })

  it('should export `setRecursive(…)` function', () => {
    expect(promises).toHaveProperty('setRecursive', expect.any(Function))
  })

  it('should export the same function under the aliases `setInterval` and `setRecursive`', () => {
    expect(promises.setInterval === promises.setRecursive).toBe(true)
  })
})
