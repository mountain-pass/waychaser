// negotiated (https://www.npmjs.com/package/negotiated) doesn't working in IE 11 due to missing regex polyfill stuff
// @hapi/accept https://www.npmjs.com/package/@hapi/accept is too big (with all it's dependencies)

/**
 * @param {string} accept
 */
export function parseAccept(accept: string): Array<{ type: string }> {
  const entries = accept.split(',')
  return entries
    .map(entry => {
      const fields = entry.split(';')
      const type = fields.shift()
      const types = type?.split('/')
      const parsedEntry = {
        type,
        parentType: types?.[0],
        subType: types?.[1],
        q: 1
      }
      for (const field of fields) {
        const parsedFields = field.split('=')
        if (field[0] === 'q') {
          parsedEntry[parsedFields[0]] = Number.parseFloat(parsedFields[1])
        }
      }
      return parsedEntry
    })
    .sort((first, second) => {
      // It is expected to return a negative value if first argument is less than second argument, zero if they're
      // equal and a positive value otherwise
      if (first.q > second.q) {
        return -1
      } else if (first.q < second.q) {
        return 1
      } else if (first.parentType === '*' && second.parentType !== '*') {
        return 1
      } else if (first.parentType !== '*' && second.parentType === '*') {
        return -1
      } else if (first.subType === '*' && second.subType !== '*') {
        return 1
      } else if (first.subType !== '*' && second.subType === '*') {
        return -1
      } else {
        return 0
      }
    })
    .map(entry => {
      return {
        type: entry.type || ''
      }
    })
    .filter(entry => entry.type !== '')
}
