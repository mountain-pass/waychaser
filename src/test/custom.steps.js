import { Given } from '@cucumber/cucumber'
import { Operation } from '../waychaser'

Given('waychaser has a custom header handler', async function () {
  await useCustomHeaderHandler.bind(this)('*/*;q=0.8')
})

Given(
  'waychaser has a custom header handler for an array of media types',
  async function () {
    await useCustomHeaderHandler.bind(this)(['application/json', '*/*;q=0.8'])
  }
)

Given(
  'waychaser has a custom body handler',
  async function () {
    await this.waychaserProxy.use(
      // this can't be an async function, otherwise we have troubles
      // sending it to the browser in waychaser-via-webdriver.js
      /* istanbul ignore next: won't work in browser otherwise */
      (response, bodyGetter) => {
        return bodyGetter().then(body => {
          return Object.keys(body.custom_links || {}).map(relationship => {
            return Operation.builder(relationship)
              .uri(body.custom_links[relationship].href)
              .build()
          })
        })
      }
    )
  },
  'application/json'
)

Given('waychaser has default handlers', async function () {
  await this.waychaserProxy.useDefaultHandlers()
})

Given('waychaser has a custom stopping header link handler', async function () {
  await this.waychaserProxy.use(
    /* istanbul ignore next: won't work in browser otherwise */
    (response, bodyGetter, stop) => {
      const linkHeader = response.headers.get('link')
      if (linkHeader) {
        const links = JSON.parse(linkHeader)
        stop()
        return links.map(reference => {
          const { rel, uri } = reference
          return Operation.builder(rel)
            .uri(uri)
            .build()
        })
      }
    },
    '*/*;q=0.8'
  )
})

Given('waychaser has a custom stopping body _links handler', async function () {
  await this.waychaserProxy.use(
    // this can't be an async function, otherwise we have troubles
    // sending it to the browser in waychaser-via-webdriver.js
    /* istanbul ignore next: won't work in browser otherwise */
    (response, bodyGetter, stop) => {
      return bodyGetter().then(body => {
        const links = body._links

        stop()
        return Object.keys(links || {}).map(relationship => {
          return Operation.builder(relationship)
            .uri(links[relationship].href)
            .build()
        })
      })
    },
    'application/json'
  )
})
async function useCustomHeaderHandler (acceptable) {
  await this.waychaserProxy.use(
    /* istanbul ignore next: won't work in browser otherwise */
    response => {
      const linkHeader = response.headers.get('custom-link')
      if (linkHeader) {
        const links = JSON.parse(linkHeader)
        return links.map(reference => {
          return Operation.builder(reference.rel)
            .uri(reference.uri)
            .build()
        })
      }
    },
    acceptable
  )
}
