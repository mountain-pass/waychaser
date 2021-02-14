import { Given, Then } from '@cucumber/cucumber'
import { expect } from 'chai'
import fetch from 'isomorphic-fetch'
import logger from '../util/logger'

Given('Assuming a Siren API is available at {string}', async function (url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/vnd.siren+json'
    }
  })
  if (!response.ok) {
    logger.error(`URL not available: ${url}`)
    logger.error(`status code: ${response.statusText} ${response.status}`)
    return 'skipped'
  }
  this.currentResourceRoute = url
})

Then('the adventure will have started', async function () {
  expect(
    await this.waychaserProxy.find([this.result], 'move')
  ).to.not.be.undefined()
})

Then('we will have completed the adventure', async function () {
  const returnOperation = await this.waychaserProxy.find(
    [this.result],
    'return'
  )
  expect(returnOperation[0]).to.not.be.undefined()
  expect(returnOperation[0].title).to.equal('Return to the void.')
})
