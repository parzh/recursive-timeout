import { RecursiveTimeout } from './recursive-timeout'
import { clearRecursiveTimeout } from './clear-recursive-timeout'

describe(RecursiveTimeout, () => {
  it('should implement AsyncIterator interface', () => {
    const recursive = new RecursiveTimeout(100)

    expect(typeof recursive.next).toBe('function')
    expect(typeof recursive.return).toBe('function')
    expect(typeof recursive[Symbol.asyncIterator]).toBe('function')

    recursive.clear()
  })

  it('should return itself when Symbol.asyncIterator is called', () => {
    const recursive = new RecursiveTimeout(100)

    expect(recursive[Symbol.asyncIterator]()).toBe(recursive)

    recursive.clear()
  })

  it('should return done: false when iterating', async () => {
    const recursive = new RecursiveTimeout(50)

    const result = await recursive.next()

    expect(result.done).toBe(false)
    expect(result.value).toBeUndefined()

    recursive.clear()
  })

  it('should return done: true after being cleared', async () => {
    const recursive = new RecursiveTimeout(50)

    recursive.clear()

    const result = await recursive.next()

    expect(result.done).toBe(true)
  })

  it('should handle return() method', async () => {
    const recursive = new RecursiveTimeout(50)

    const result = await recursive.return()

    expect(result.done).toBe(true)
  })
})

describe(clearRecursiveTimeout, () => {
  it('should clear a recursive timeout', async () => {
    const recursive = new RecursiveTimeout(50)

    clearRecursiveTimeout(recursive)

    const result = await recursive.next()
    expect(result.done).toBe(true)
  })
})
