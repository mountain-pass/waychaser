import { assert, expect } from 'chai'
import { When, Then } from '@cucumber/cucumber'

async function checkBody (
  expectedBody,
  bodyMutator = body => {
    return body
  }
) {
  const bodies = await this.waychaserProxy.getBodies(
    [
      this.operationResult,
      this.operationResultLokiStyle,
      this.opResult,
      this.opResultLokiStyle,
      this.resultLokiStyle,
      this.result
    ].filter(result => result !== undefined)
  )
  bodies.forEach(body => {
    expect(bodyMutator(body)).to.deep.equal(expectedBody)
  })
}

async function checkUrls (expectedUrl) {
  const previousResultUrl =
    expectedUrl === undefined
      ? await this.waychaserProxy.getUrl(this.previousResult)
      : expectedUrl
  const resultUrl = await this.waychaserProxy.getUrl(this.result)
  expect(resultUrl).to.equal(previousResultUrl, 'resultUrl')

  const resultLokiStyleUrl = await this.waychaserProxy.getUrl(
    this.resultLokiStyle
  )
  expect(resultLokiStyleUrl).to.equal(previousResultUrl, 'resultLokiStyleUrl')

  const operationResultUrl = await this.waychaserProxy.getUrl(
    this.operationResult
  )
  expect(operationResultUrl).to.equal(previousResultUrl, 'operationResultUrl')

  const operationResultLokiStyleUrl = await this.waychaserProxy.getUrl(
    this.operationResultLokiStyle
  )
  expect(operationResultLokiStyleUrl).to.equal(
    previousResultUrl,
    'operationResultLokiStyleUrl'
  )

  const opResultUrl = await this.waychaserProxy.getUrl(this.opResult)
  expect(opResultUrl).to.equal(previousResultUrl, 'opResultUrl')

  const opResultLokiStyleUrl = await this.waychaserProxy.getUrl(this.opResult)
  expect(opResultLokiStyleUrl).to.equal(
    previousResultUrl,
    'opResultLokiStyleUrl'
  )
}

async function expectFindOne (relationship, expectation) {
  const {
    foundOperation,
    foundOperationLokiStyle,
    foundOp,
    foundOpLokiStyle
  } = await findOne.bind(this)(relationship)
  expectation(foundOperation)
  expectation(foundOperationLokiStyle)
  expectation(foundOp)
  expectation(foundOpLokiStyle)
}

async function findOne (relationship) {
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
  return {
    foundOperation,
    foundOperationLokiStyle,
    foundOp,
    foundOpLokiStyle
  }
}

async function invoke (relationship, previousResult, context) {
  this.previousResult = previousResult

  this.operationResult = await this.waychaserProxy.invokeOperation(
    this.previousResult,
    relationship,
    context
  )
  this.operationResultLokiStyle = await this.waychaserProxy.invokeOperation(
    this.previousResult,
    { rel: relationship },
    context
  )
  this.opResult = await this.waychaserProxy.invokeOp(
    this.previousResult,
    relationship,
    context
  )
  this.opResultLokiStyle = await this.waychaserProxy.invokeOp(
    this.previousResult,
    {
      rel: relationship
    },
    context
  )
  this.resultLokiStyle = await this.waychaserProxy.invoke(
    this.previousResult,
    {
      rel: relationship
    },
    context
  )
  this.result = await this.waychaserProxy.invoke(
    this.previousResult,
    relationship,
    context
  )
}
async function invokeSuccessfully (relationship, previousResult) {
  await invoke.bind(this)(relationship, previousResult)
  expect(this.operationResult.success).to.be.true()
  expect(this.operationResultLokiStyle.success).to.be.true()
  expect(this.opResult.success).to.be.true()
  expect(this.opResultLokiStyle.success).to.be.true()
  expect(this.resultLokiStyle.success).to.be.true()
  expect(this.result.success).to.be.true()
}

async function checkStatusCodeSingle (expectedStatusCode, result) {
  const actualStatusCode = await this.waychaserProxy.getStatusCode(result)
  expect(actualStatusCode).to.equal(expectedStatusCode)
}

async function checkStatusCode (expectedStatusCode) {
  await checkStatusCodeSingle.bind(this)(
    expectedStatusCode,
    this.operationResult
  )
  await checkStatusCodeSingle.bind(this)(
    expectedStatusCode,
    this.operationResultLokiStyle
  )
  await checkStatusCodeSingle.bind(this)(expectedStatusCode, this.opResult)
  await checkStatusCodeSingle.bind(this)(
    expectedStatusCode,
    this.opResultLokiStyle
  )
  await checkStatusCodeSingle.bind(this)(
    expectedStatusCode,
    this.resultLokiStyle
  )
  await checkStatusCodeSingle.bind(this)(expectedStatusCode, this.result)
}

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
  await expectFindOne.bind(this)(relationship, assert.isNotNull)
})

Then("it won't have a(n) {string} operation", async function (relationship) {
  await expectFindOne.bind(this)(relationship, assert.isNull)
})

When('we successfully invoke the {string} operation', async function (
  relationship
) {
  await invokeSuccessfully.bind(this)(relationship, this.result)
})

When('we invoke the {string} operation', async function (relationship) {
  await invoke.bind(this)(relationship, this.result)
})

Then('the same resource will be returned', async function () {
  await checkUrls.bind(this)()
})

Then('the former resource will be returned', async function () {
  await checkUrls.bind(this)(this.firstResourceRoute)
})

When(
  'invokes each of the {string} operations in turn {int} times',
  { timeout: 60000 },
  async function (relationship, count) {
    for (let index = 0; index < count; index++) {
      await invoke.bind(this)(relationship, this.result)
    }
  }
)

Then(
  'the last resource returned will be the last item in the list',
  async function () {
    await checkUrls.bind(this)(this.lastOnList)
  }
)

When('we invoke the {string} operation with the input', async function (
  relationship,
  dataTable
) {
  // we store it in expectedBody, because we use in in the next step
  this.expectedBody = dataTable.rowsHash()
  await invoke.bind(this)(relationship, this.result, this.expectedBody)
})

Then('resource returned will contain those values', async function () {
  await checkBody.bind(this)(this.expectedBody)
})

Then('resource returned will contain only', async function (dataTable) {
  const expectedBody = dataTable.rowsHash()
  await checkBody.bind(this)(expectedBody)
})

Then('resource returned will have the status code {int}', async function (
  statusCode
) {
  await checkStatusCode.bind(this)(statusCode)
})

Then('the body without the links will contain', async function (
  documentString
) {
  const expectedBody = JSON.parse(documentString)
  await checkBody.bind(this)(expectedBody, actualBody => {
    delete actualBody._links
    return actualBody
  })
})

async function invokeWithName (relationship, name) {
  this.operationResultLokiStyle = await this.waychaserProxy.invokeOperation(
    this.rootResourceResult,
    { rel: relationship, name: name }
  )
  // means we can use the same check body function as use in other invocations
  this.operationResult = undefined

  this.opResultLokiStyle = await this.waychaserProxy.invokeOp(
    this.rootResourceResult,
    {
      rel: relationship,
      name: name
    }
  )
  // means we can use the same check body function as use in other invocations
  this.opResult = undefined

  this.resultLokiStyle = await this.waychaserProxy.invoke(
    this.rootResourceResult,
    {
      rel: relationship,
      name: name
    }
  )
  // means we can use the same check body function as use in other invocations
  this.result = undefined
}

When(
  'we invoke the {string} operation for the link name {string}',
  async function (relationship, name) {
    await invokeWithName.bind(this)(relationship, name)
  }
)

Then(
  'when we invoke the {string} operation for the link name {string}',
  async function (relationship, name) {
    await invokeWithName.bind(this)(relationship, name)
  }
)

Then('resource returned will contain', async function (documentString) {
  const expectedBody = JSON.parse(documentString)
  await checkBody.bind(this)(expectedBody)
})
