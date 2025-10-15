import * as promises from './promises'

export { promises }

export {
  createRecursiveTimeout as setRecursive,
  createRecursiveTimeout as setInterval, // alias (allows drop-in replacement)
} from './with-callback/create-recursive-timeout'

export {
  clearRecursiveTimeout as clearRecursive,
  clearRecursiveTimeout as clearInterval, // alias (allows drop-in replacement)
} from './with-callback/clear-recursive-timeout'
