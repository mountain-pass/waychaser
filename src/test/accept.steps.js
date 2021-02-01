import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from 'chai'

Given('an accept value of {string}', async function (accept) {
  this.currentAccept = accept
})

When('the accept value is parsed', async function () {
  this.result = await this.waychaserProxy.parseAccept(this.currentAccept)
})

Then('the following is returned:', async function (documentString) {
  expect(this.result).to.deep.equal(JSON.parse(documentString))
})
