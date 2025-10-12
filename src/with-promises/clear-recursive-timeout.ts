import type { RecursiveTimeout, ArgsShape } from './recursive-timeout'

export function clearRecursiveTimeout(timeout: RecursiveTimeout<ArgsShape>): void {
  timeout.clear()
}
