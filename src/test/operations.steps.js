import { assert, expect } from 'chai'
import { When, Then, Before } from 'cucumber'
import logger from '../util/logger'

Before(async function () {
  this.checkUrls = async function (expectedUrl) {
    const previousResultUrl = expectedUrl === undefined ? await this.waychaserProxy.getUrl(this.previousResult) : expectedUrl
    const resultUrl = await this.waychaserProxy.getUrl(this.result)
    expect(resultUrl).to.equal(previousResultUrl, 'resultUrl')

    const resultLokiStyleUrl = await this.waychaserProxy.getUrl(this.result)
    expect(resultLokiStyleUrl).to.equal(previousResultUrl, 'resultLokiStyleUrl')

    const operationResultUrl = await this.waychaserProxy.getUrl(
      this.operationResult
    )
    expect(operationResultUrl).to.equal(previousResultUrl, 'operationResultUrl')

    const operationResultLokiStyleUrl = await this.waychaserProxy.getUrl(
      this.operationResultLokiStyle
    )
    expect(operationResultLokiStyleUrl).to.equal(previousResultUrl, 'operationResultLokiStyleUrl')

    const opResultUrl = await this.waychaserProxy.getUrl(this.opResult)
    expect(opResultUrl).to.equal(previousResultUrl, 'opResultUrl')

    const opResultLokiStyleUrl = await this.waychaserProxy.getUrl(this.opResult)
    expect(opResultLokiStyleUrl).to.equal(previousResultUrl, 'opResultLokiStyleUrl')
  }

  this.expectFindOne = async function (relationship, expectation) {
    const {
      foundOperation,
      foundOperationLokiStyle,
      foundOp,
      foundOpLokiStyle
    } = await this.findOne(relationship)
    expectation(foundOperation)
    expectation(foundOperationLokiStyle)
    expectation(foundOp)
    expectation(foundOpLokiStyle)
  }

  this.findOne = async function (relationship) {
    const foundOperation = await this.waychaserProxy.findOneOperation(
      this.result,
      relationship
    )

    const foundOperationLokiStyle = await this.waychaserProxy.findOneOperation(
      this.result,
      { rel: relationship }
    )

    const foundOp = await this.waychaserProxy.findOneOp(this.result, relationship)

    const foundOpLokiStyle = await this.waychaserProxy.findOneOp(this.result, {
      rel: relationship
    })
    return { foundOperation, foundOperationLokiStyle, foundOp, foundOpLokiStyle }
  }

  this.invoke = async function (relationship, previousResult) {
    this.previousResult = previousResult

    this.operationResult = await this.waychaserProxy.invokeOperation(
      this.previousResult,
      relationship
    )
    this.operationResultLokiStyle = await this.waychaserProxy.invokeOperation(
      this.previousResult,
      { rel: relationship }
    )
    this.opResult = await this.waychaserProxy.invokeOp(this.previousResult, relationship)
    this.opResultLokiStyle = await this.waychaserProxy.invokeOp(this.previousResult, {
      rel: relationship
    })
    this.resultLokiStyle = await this.waychaserProxy.invoke(this.previousResult, {
      rel: relationship
    })
    this.result = await this.waychaserProxy.invoke(this.previousResult, relationship)
    logger.debug('RESULT', this.result)
  }

  this.invokeSuccessfully = async function (relationship, previousResult) {
    await this.invoke(relationship, previousResult)
    expect(this.operationResult.success).to.be.true
    expect(this.operationResultLokiStyle.success).to.be.true
    expect(this.opResult.success).to.be.true
    expect(this.opResultLokiStyle.success).to.be.true
    expect(this.resultLokiStyle.success).to.be.true
    expect(this.result.success).to.be.true
  }
})

Then('the loaded resource will have no operations', async function () {
  const operationsCount = await this.waychaserProxy.getOperationsCount(
    this.result
  )
  expect(operationsCount).to.equal(0)
  const opsCount = await this.waychaserProxy.getOpsCount(this.result)
  expect(opsCount).to.equal(0)
})

Then('the loaded resource will have {int} operation(s)', async function (
  expected
) {
  const operationsCount = await this.waychaserProxy.getOperationsCount(
    this.result
  )
  expect(operationsCount).to.equal(expected)
  const opsCount = await this.waychaserProxy.getOpsCount(this.result)
  expect(opsCount).to.equal(expected)
})

Then('the loaded resource will have {string} operation', async function (
  relationship
) {
  await this.expectFindOne(relationship, assert.isNotNull)
})

Then("it won't have a(n) {string} operation", async function (relationship) {
  await this.expectFindOne(relationship, assert.isNull)
})

When('we successfully invoke the {string} operation', async function (
  relationship
) {
  await this.invokeSuccessfully(relationship, this.result)
})

When('we invoke the {string} operation', async function (relationship) {
  await this.invoke(relationship, this.result)
})

Then('the same resource will be returned', async function () {
  await this.checkUrls()
})

Then('the former resource will be returned', async function () {
  await this.checkUrls(this.firstResourceRoute)
})

When('invokes each of the {string} operations in turn {int} times', async function (relationship, count) {
  for (let index = 0; index < count; index++) {
    await this.invoke(relationship, this.result)
    logger.debug('RESULT2', this.result)
  }
})

Then('the last resource returned will be the last item in the list', async function () {
  await this.checkUrls(this.lastOnList)
})
