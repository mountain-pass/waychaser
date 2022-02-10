/**
 * @param {object} action the siren action to map
 * @returns {object} the link objection that the @{param action} maps to
 */
export function mapSirenActionToOperation (action) {
  const { name, href, fields, type, ...otherProperties } = action
  const bodyParameters = {}
  if (fields) {
    for (const parameter of fields) {
      bodyParameters[parameter.name] = {}
    }
  }
  return {
    rel: name,
    uri: href,
    accept: type,
    parameters: fields && bodyParameters,
    ...otherProperties
  }
}
