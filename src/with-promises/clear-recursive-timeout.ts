import type { RecursiveTimeout } from './recursive-timeout'

/**
 * Cancels a recursive timeout created by `setRecursive`.
 * 
 * Note: When using the promise-based API, you can also use AbortController
 * to cancel the timeout, or simply break out of the `for await...of` loop.
 * 
 * @param recursive - The RecursiveTimeout instance to clear
 */
export function clearRecursiveTimeout<T>(recursive: RecursiveTimeout<T>): void {
  recursive.clear()
}
