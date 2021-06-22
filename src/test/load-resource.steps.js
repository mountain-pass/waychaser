import { expect } from 'chai'
import { When, Then } from '@cucumber/cucumber'
import logger from '../util/logger'
import { API_PORT } from './config'

function loadResourceByUrl (url) {
  logger.debug(`loading ${url}`)
  return this.waychaserProxy.load(url)
}

function loadResourceByPath (path) {
  return loadResourceByUrl.bind(this)(new URL(path, this.baseUrl))
}

async function loadAndCheckResourceByPath (path) {
  const result = await loadResourceByPath.bind(this)(path)
  logger.debug('result', result)
  expect(result.success).to.be.true()
  return result
}

When('waychaser loads that resource', async function () {
  this.result = await loadResourceByPath.bind(this)(this.currentResourceRoute)
})

When("waychaser loads a resource that's not available", async function () {
  this.result = await loadResourceByUrl.bind(this)(
    `${this.baseUrl.replace(
      // eslint-disable-next-line security/detect-non-literal-regexp -- not regex DoS vulnerable
      new RegExp(`(:${API_PORT})?$`),
      ':33556'
    )}/api`
  )
})

Then('it will have loaded successfully', async function () {
  expect(this.result.success).to.be.true()
})

Then('it will NOT have loaded successfully', async function () {
  for (const key in this.results) {
    expect(this.results[key].success).to.be.false()
  }
})

When('waychaser successfully loads that resource', async function () {
  logger.debug(
    'loading current resource',
    this.currentResourceRoute,
    this.baseUrl
  )
  this.results = [
    await loadAndCheckResourceByPath.bind(this)(this.currentResourceRoute)
  ]
  this.rootResourceResult = this.results[0]
})

When('waychaser successfully loads the latter resource', async function () {
  this.results = [
    await loadAndCheckResourceByPath.bind(this)(this.currentResourceRoute)
  ]
})

When(
  'waychaser successfully loads the first resource in the list',
  async function () {
    this.results = [
      await loadAndCheckResourceByPath.bind(this)(this.currentResourceRoute)
    ]
  }
)

When('the following code is executed:', async function (documentString) {
  this.result = await this.waychaserProxy.executeCode(
    documentString,
    this.firstResourceRoute
  )
  expect(this.result.success).to.be.true()
})
