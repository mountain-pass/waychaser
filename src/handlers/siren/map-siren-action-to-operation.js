import { Operation } from '../../waychaser'

/**
 * @param {object} action the siren action to map
 *
 * @returns {object} the link objection that the @{param action} maps to
 */
export function mapSirenActionToOperation (action) {
  const { name, href, fields, type, ...otherProperties } = action
  const bodyParameters = {}
  fields?.forEach(parameter => {
    bodyParameters[parameter.name] = {}
  })
  return Operation.builder(name)
    .uri(href)
    .accept(type)
    .parameters(bodyParameters)
    .other(Object.assign({ handler: 'siren-action' }, otherProperties))
    .build()
}
