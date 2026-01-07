import { RecursiveTimeout, type RecursiveTimeoutOptions } from './recursive-timeout'

/**
 * Creates a promise-based recursive timeout that yields values at regular intervals.
 * 
 * Unlike Node.js's `setInterval` from `timers/promises`, this implementation waits
 * for any async work in the iteration to complete before scheduling the next iteration.
 * 
 * @param delay - The number of milliseconds to wait between iterations
 * @param value - Optional value to yield on each iteration
 * @param options - Optional configuration including AbortSignal for cancellation
 * @returns An AsyncIterator that can be used with `for await...of`
 * 
 * @example
 * ```ts
 * // Basic usage
 * for await (const _ of setRecursive(1000)) {
 *   console.log('tick')
 * }
 * 
 * // With abort signal
 * const ac = new AbortController()
 * setTimeout(() => ac.abort(), 5000)
 * 
 * try {
 *   for await (const _ of setRecursive(1000, undefined, { signal: ac.signal })) {
 *     await doAsyncWork() // Next iteration waits for this to complete
 *   }
 * } catch (err) {
 *   if (err.name === 'AbortError') {
 *     console.log('Cancelled')
 *   }
 * }
 * ```
 */
export function createRecursiveTimeout<T = undefined>(
  delay: number,
  value?: T,
  options?: RecursiveTimeoutOptions,
): RecursiveTimeout<T> {
  return new RecursiveTimeout(delay, value, options)
}
