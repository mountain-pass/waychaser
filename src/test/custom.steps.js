import { Given } from '@cucumber/cucumber'

Given('waychaser has a custom handler for that resource', async function () {
  await this.waychaserProxy.use(
    /* istanbul ignore next: won't work in browser otherwise */
    (response, next) => {
      const linkHeader = response.headers.get('custom-link')
      const links = JSON.parse(linkHeader)
      return links
    }
  )
})
