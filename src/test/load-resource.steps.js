import { expect } from 'chai'
import { When, Then } from '@cucumber/cucumber'
import logger from '../util/logger'
import { API_ACCESS_PORT, API_ACCESS_HOST } from './config'

async function loadResourceByUrl (waychaserProxy, url) {
  logger.debug(`loading ${url}`)
  return waychaserProxy.load(url)
}

async function loadResourceByPath (waychaserProxy, path) {
  return loadResourceByUrl(
    waychaserProxy,
    `http://${API_ACCESS_HOST}:${API_ACCESS_PORT}${path}`
  )
}

async function loadAndCheckResourceByPath (
  waychaserProxy,
  currentResourceRoute
) {
  const result = await loadResourceByPath(waychaserProxy, currentResourceRoute)
  logger.debug('result', result)
  expect(result.success).to.be.true()
  return result
}

When('waychaser loads that resource', async function () {
  this.result = await loadResourceByPath(
    this.waychaserProxy,
    this.currentResourceRoute
  )
})

When("waychaser loads a resource that's not available", async function () {
  this.result = await loadResourceByUrl(
    this.waychaserProxy,
    `http://${API_ACCESS_HOST}:33556/api`
  )
})

Then('it will have loaded successfully', async function () {
  expect(this.result.success).to.be.true()
})

Then('it will NOT have loaded successfully', async function () {
  expect(this.result.success).to.be.false()
})

When('waychaser successfully loads that resource', async function () {
  logger.debug('loading current resource', this.currentResourceRoute)
  this.result = await loadAndCheckResourceByPath(
    this.waychaserProxy,
    this.currentResourceRoute
  )
  this.rootResourceResult = this.result
})

When('waychaser successfully loads the latter resource', async function () {
  this.result = await loadAndCheckResourceByPath(
    this.waychaserProxy,
    this.currentResourceRoute
  )
})

When(
  'waychaser successfully loads the first resource in the list',
  async function () {
    this.result = await loadAndCheckResourceByPath(
      this.waychaserProxy,
      this.currentResourceRoute
    )
  }
)
