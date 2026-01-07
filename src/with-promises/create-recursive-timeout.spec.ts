import { createRecursiveTimeout } from './create-recursive-timeout'
import { RecursiveTimeout } from './recursive-timeout'

describe(createRecursiveTimeout, () => {
  it('should create an instance of RecursiveTimeout class', () => {
    const recursive = createRecursiveTimeout(100)

    expect(recursive).toBeInstanceOf(RecursiveTimeout)

    recursive.clear()
  })

  it('should yield values at regular intervals', async () => {
    const recursive = createRecursiveTimeout(50)
    const startTime = Date.now()
    const iterations: number[] = []

    let count = 0
    for await (const _ of recursive) {
      iterations.push(Date.now() - startTime)
      count++
      if (count >= 3) {
        break
      }
    }

    expect(count).toBe(3)
    // Each iteration should be approximately 50ms apart
    expect(iterations[0]).toBeGreaterThanOrEqual(45)
    expect(iterations[0]).toBeLessThan(100)
    expect(iterations[1] - iterations[0]).toBeGreaterThanOrEqual(45)
    expect(iterations[1] - iterations[0]).toBeLessThan(100)
  })

  it('should wait for async work to complete before scheduling next iteration', async () => {
    const recursive = createRecursiveTimeout(50)
    const timestamps: { start: number; end: number }[] = []

    let count = 0
    for await (const _ of recursive) {
      const start = Date.now()
      // Simulate async work that takes 100ms
      await new Promise(resolve => setTimeout(resolve, 100))
      const end = Date.now()
      timestamps.push({ start, end })
      count++
      if (count >= 2) {
        break
      }
    }

    expect(count).toBe(2)

    // The second iteration should start AFTER the first one completes (not during)
    // First iteration: starts at ~50ms, ends at ~150ms
    // Second iteration: should start at ~200ms (150ms + 50ms delay), not at ~100ms
    const firstEnd = timestamps[0].end
    const secondStart = timestamps[1].start

    expect(secondStart).toBeGreaterThanOrEqual(firstEnd + 40) // Allow some timing variance
  })

  it('should support yielding custom values', async () => {
    const testValue = 'custom-value'
    const recursive = createRecursiveTimeout(50, testValue)

    let count = 0
    for await (const value of recursive) {
      expect(value).toBe(testValue)
      count++
      if (count >= 2) {
        break
      }
    }

    expect(count).toBe(2)
  })

  it('should support cancellation via AbortController', async () => {
    const ac = new AbortController()
    const recursive = createRecursiveTimeout(50, undefined, { signal: ac.signal })

    setTimeout(() => ac.abort(), 125) // Abort after ~2.5 iterations

    let count = 0
    let errorThrown = false
    try {
      for await (const _ of recursive) {
        count++
      }
    } catch (err: any) {
      errorThrown = true
    }

    // Should have completed 2 iterations before abort
    expect(count).toBe(2)
    expect(errorThrown).toBe(true)
  })

  it('should support ref option', () => {
    const recursive1 = createRecursiveTimeout(100, undefined, { ref: true })
    const recursive2 = createRecursiveTimeout(100, undefined, { ref: false })

    recursive1.clear()
    recursive2.clear()
  })

  it('should handle already-aborted signal', async () => {
    const ac = new AbortController()
    ac.abort()

    const recursive = createRecursiveTimeout(50, undefined, { signal: ac.signal })

    let count = 0
    let errorThrown = false
    try {
      for await (const _ of recursive) {
        count++
      }
    } catch (err: any) {
      errorThrown = true
    }

    expect(count).toBe(0)
    expect(errorThrown).toBe(true)
  })

  it('should be cancellable via clear() method', async () => {
    const recursive = createRecursiveTimeout(50)

    let count = 0
    for await (const _ of recursive) {
      count++
      if (count >= 2) {
        recursive.clear()
        break
      }
    }

    expect(count).toBe(2)
  })

  it('should clean up resources when breaking from loop', async () => {
    const recursive = createRecursiveTimeout(50)

    let count = 0
    for await (const _ of recursive) {
      count++
      if (count >= 3) {
        break // This should trigger cleanup
      }
    }

    expect(count).toBe(3)
  })
})
