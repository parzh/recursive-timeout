import { RecursiveTimeout, type ArgsShape, type Callback } from './recursive-timeout'

export function createRecursiveTimeout<Args extends ArgsShape>(
  callback: Callback<Args>,
  delay?: number,
  ...args: Args
): RecursiveTimeout<Args> {
  return new RecursiveTimeout(callback, delay, args)
}
