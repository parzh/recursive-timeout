import { createRecursiveTimeout } from './create-recursive-timeout'
import { clearRecursiveTimeout } from './clear-recursive-timeout'

describe(clearRecursiveTimeout, () => {
  it('should stop the recursive timeout', async () => {
    const recursive = createRecursiveTimeout(50)

    let count = 0
    const promise = (async () => {
      try {
        for await (const _ of recursive) {
          count++
        }
      } catch (err) {
        // Expected when clear() is called
      }
    })()

    // Wait a bit and then clear
    await new Promise(resolve => setTimeout(resolve, 125))
    clearRecursiveTimeout(recursive)

    // Wait for the loop to finish
    await promise

    // Should have completed ~2 iterations before being cleared
    expect(count).toBeGreaterThanOrEqual(2)
    expect(count).toBeLessThanOrEqual(3)
  })

  it('should be idempotent', () => {
    const recursive = createRecursiveTimeout(50)

    clearRecursiveTimeout(recursive)
    clearRecursiveTimeout(recursive) // Should not throw

    expect(true).toBe(true) // If we get here, no error was thrown
  })
})
