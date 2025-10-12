import * as promises from './promises'

export { promises }

export {
  createRecursiveTimeout as setRecursive,
  createRecursiveTimeout as setInterval, // alias (allows drop-in replacement)
} from './with-callback/create-recursive-timeout'
