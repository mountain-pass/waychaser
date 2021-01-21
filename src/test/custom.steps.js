import { Given } from '@cucumber/cucumber'
import { Operation } from '../waychaser'

Given('waychaser has a custom handler for that resource', async function () {
  await this.waychaserProxy.use(
    /* istanbul ignore next: won't work in browser otherwise */
    (response, next) => {
      const linkHeader = response.headers.get('custom-link')
      const links = JSON.parse(linkHeader)
      return links.map(reference => {
        const {
          rel,
          uri,
          method = 'GET',
          'accept*': accept,
          'params*': parameters,
          ...otherProperties
        } = reference
        const parsedParameters = parameters?.value
          ? JSON.parse(parameters?.value)
          : undefined
        return Operation.builder(rel)
          .uri(uri)
          .method(method)
          .parameters(parsedParameters)
          .accept(accept)
          .other(otherProperties)
          .build()
      })
    }
  )
})
