export {
  createRecursiveTimeout as setRecursive,
  createRecursiveTimeout as setInterval, // alias (allows drop-in replacement)
} from './with-promises/create-recursive-timeout'

export {
  clearRecursiveTimeout as clearRecursive,
  clearRecursiveTimeout as clearInterval, // alias (allows drop-in replacement)
} from './with-promises/clear-recursive-timeout'
