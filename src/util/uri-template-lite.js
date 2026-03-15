import Template, { expand } from 'uri-template-lite'

export const URI = {
  Template,
  expand,
  parameters(url) {
    const template = new Template(url)
    return template.match(url)
  }
}
