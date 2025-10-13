import type { RecursiveTimeout, ArgsShape } from './recursive-timeout'

export function clearRecursiveTimeout(recursive: RecursiveTimeout<ArgsShape>): void {
  recursive.clear()
}
