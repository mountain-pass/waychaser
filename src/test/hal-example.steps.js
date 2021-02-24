import { Given, Then, When } from '@cucumber/cucumber'
import { expect } from 'chai'
import fetch from 'isomorphic-fetch'
import logger from '../util/logger'
import aws4 from 'aws4'
import MediaTypes from '../util/media-types'
import { halHandler } from '../handlers/hal/hal-handler'
import { handleResponseError } from './handle-response-error'

function awsFetch (url, options) {
  const parsedUrl = new URL(url)
  const signedOptions = aws4.sign(
    Object.assign(
      {
        host: parsedUrl.host,
        path: `${parsedUrl.pathname}?${parsedUrl.searchParams}`,
        method: 'GET'
      },
      options
    )
  )
  logger.debug({ signedOptions })
  return fetch(url, signedOptions)
}

Given('waychaser is using a HAL handler', async function () {
  await this.waychaserProxy.use(halHandler, MediaTypes.HAL)
})

Given('waychaser is using aws4 signing fetcher', async function () {
  /* istanbul ignore next: only gets executed when there are test config issues */
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return 'skipped'
  }
  await this.waychaserProxy.withFetch(awsFetch)
})

Given('Assuming a HAL API is available at {string}', async function (url) {
  const response = await awsFetch(url)
  /* istanbul ignore next: only gets executed when there are aws API issues */
  handleResponseError(response, url)
  this.currentResourceRoute = url
})

Then('it will have successfully downloaded a schema', async function () {
  expect(this.result.$schema).to.not.be.undefined()
})

When('we get the {string} schema for the {string} API gateway', async function (
  schemaName,
  gatewayName
) {
  this.result = await this.waychaserProxy.getAwsApiGatewaySchema(
    gatewayName,
    schemaName
  )
})
