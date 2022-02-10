/**
 * @param method
 */
export function methodCanHaveBody (method) {
  return !['GET', 'DELETE', 'TRACE', 'OPTIONS', 'HEAD'].includes(method)
}
