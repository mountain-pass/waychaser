import { Given } from '@cucumber/cucumber'
import { Operation } from '../operation'

import { CustomWorld } from './world'

Given('waychaser has a custom header handler', async function (
  this: CustomWorld
) {
  await useCustomHeaderHandler.bind(this)('*/*;q=0.8')
})

Given(
  'waychaser has a custom header handler for an array of media types',
  async function (this: CustomWorld) {
    await useCustomHeaderHandler.bind(this)(['application/json', '*/*;q=0.8'])
  }
)

Given('waychaser has a custom body handler', async function (
  this: CustomWorld
) {
  await this.waychaserProxy.use(
    // this can't be an async function, otherwise we have troubles
    // sending it to the browser in waychaser-via-webdriver.js
    /* istanbul ignore next: won't work in browser otherwise */
    response => {
      const body = response.content
      return Object.keys(body.customLinks || {}).map(relationship => {
        return {
          rel: relationship,
          uri: body.customLinks[relationship].href
        }
      })
    },
    'application/json'
  )
})

Given('waychaser has default handlers', async function (this: CustomWorld) {
  await this.waychaserProxy.useDefaultHandlers()
})

Given('waychaser has a custom stopping header link handler', async function (
  this: CustomWorld
) {
  await this.waychaserProxy.use(
    /* istanbul ignore next: won't work in browser otherwise */
    (response, stop) => {
      const linkHeader = response.headers.get('link')
      if (linkHeader) {
        const links = JSON.parse(linkHeader)
        stop()
        return links
      }
    },
    '*/*'
  )
})

Given('waychaser has a custom stopping body _links handler', async function (
  this: CustomWorld
) {
  await this.waychaserProxy.use(
    // this can't be an async function, otherwise we have troubles
    // sending it to the browser in waychaser-via-webdriver.js
    /* istanbul ignore next: won't work in browser otherwise */
    (response, stop) => {
      const body = response.content
      const links = body._links

      stop()
      return Object.keys(links || {}).map(relationship => {
        return { rel: relationship, uri: links[relationship].href }
      })
    },
    'application/json'
  )
})
async function useCustomHeaderHandler (this: CustomWorld, acceptable) {
  await this.waychaserProxy.use(
    /* istanbul ignore next: won't work in browser otherwise */
    (response): Operation[] => {
      const linkHeader = response.headers.get('custom-link')
      if (linkHeader) {
        const links = JSON.parse(linkHeader)
        return links
      }
    },
    acceptable
  )
}
