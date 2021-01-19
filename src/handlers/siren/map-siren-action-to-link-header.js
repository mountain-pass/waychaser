/**
 * @param {object} action the siren action to map
 *
 * @returns {object} the link objection that the @{param action} maps to
 */
export function mapSirenActionToLinkHeader (action) {
  const { name, href, fields, type, ...otherProperties } = action
  const bodyParameters = {}
  fields?.forEach(parameter => {
    bodyParameters[parameter.name] = {}
  })
  return {
    rel: name,
    uri: href,
    ...(fields && { 'params*': { value: JSON.stringify(bodyParameters) } }),
    ...(type && {
      'accept*': { value: type }
    }),
    ...otherProperties
  }
  /*
  rel: relationship,
    uri: dynamicUri,
    method: method,
    ...(Object.keys(bodyParameters).length > 0 && {
      'params*': { value: JSON.stringify(bodyParameters) }
    }),
    ...(accept && {
      'accept*': { value: accept }
    }) */
}
