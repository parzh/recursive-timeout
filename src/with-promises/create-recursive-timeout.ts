import { RecursiveTimeout, type RecursiveTimeoutOptions } from './recursive-timeout'

/**
 * Creates a promise-based recursive timeout that yields values at regular intervals.
 * 
 * Unlike Node.js's `setInterval` from `timers/promises`, this implementation:
 * 1. Yields immediately on the first iteration (no initial delay)
 * 2. Waits for the loop body to complete before starting the delay timer
 * 3. Only then schedules the next iteration
 * 
 * This ensures that the delay happens AFTER the work completes, not BEFORE it starts,
 * matching the behavior of the callback-based `setRecursive`.
 * 
 * @param delay - The number of milliseconds to wait between iterations (after work completes)
 * @param value - Optional value to yield on each iteration
 * @param options - Optional configuration including AbortSignal for cancellation
 * @returns An AsyncIterator that can be used with `for await...of`
 * 
 * @example
 * ```ts
 * // Basic usage - first iteration happens immediately
 * for await (const _ of setRecursive(1000)) {
 *   console.log('tick')
 *   // After this completes, waits 1000ms, then yields again
 * }
 * 
 * // Demonstrating the key difference from Node.js setInterval:
 * // setInterval: delay -> yield -> work -> delay -> yield -> work
 * // setRecursive: yield -> work -> delay -> yield -> work -> delay
 * for await (const _ of setRecursive(1000)) {
 *   await doWork() // Takes 500ms
 *   // Next iteration happens 1000ms AFTER doWork() completes
 *   // Total time between iterations: 500ms (work) + 1000ms (delay) = 1500ms
 * }
 * 
 * // With abort signal
 * const ac = new AbortController()
 * setTimeout(() => ac.abort(), 5000)
 * 
 * try {
 *   for await (const _ of setRecursive(1000, undefined, { signal: ac.signal })) {
 *     await doAsyncWork()
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
