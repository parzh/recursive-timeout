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
    // First iteration should happen immediately (within a few ms)
    expect(iterations[0]).toBeLessThan(10)
    // Second iteration should happen after ~50ms delay from first
    expect(iterations[1]).toBeGreaterThanOrEqual(45)
    expect(iterations[1]).toBeLessThan(100)
    // Third iteration should happen after ~50ms delay from second
    expect(iterations[2] - iterations[1]).toBeGreaterThanOrEqual(45)
    expect(iterations[2] - iterations[1]).toBeLessThan(100)
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

    // The second iteration should start AFTER the first one completes AND the delay
    // First iteration: starts at ~0ms, ends at ~100ms
    // Then 50ms delay
    // Second iteration: should start at ~150ms (100ms work + 50ms delay)
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

    setTimeout(() => ac.abort(), 125) // Abort after first iteration completes and during second delay

    let count = 0
    let errorThrown = false
    let errorName = ''
    try {
      for await (const _ of recursive) {
        count++
      }
    } catch (err: any) {
      errorThrown = true
      errorName = err.name
    }

    // Should have completed at least 2 iterations before abort (first is immediate, second after 50ms)
    expect(count).toBeGreaterThanOrEqual(2)
    expect(errorThrown).toBe(true)
    expect(errorName).toBe('AbortError')
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
    let errorName = ''
    try {
      for await (const _ of recursive) {
        count++
      }
    } catch (err: any) {
      errorThrown = true
      errorName = err.name
    }

    expect(count).toBe(0)
    expect(errorThrown).toBe(true)
    expect(errorName).toBe('AbortError')
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
