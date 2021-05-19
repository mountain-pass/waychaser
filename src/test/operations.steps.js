import { assert, expect } from 'chai'
import { When, Then } from '@cucumber/cucumber'
import logger from '../util/logger'

async function checkBody (
  expectedBody,
  bodyMutator = body => {
    return body
  }
) {
  const bodies = await this.waychaserProxy.getBodies(this.results)
  // eslint-disable-next-line unicorn/no-array-for-each
  bodies.forEach(body => {
    expect(bodyMutator(body)).to.deep.equal(expectedBody)
  })
}

async function checkUrls (expectedUrl) {
  const results = this.results
  // if expectedUrl is undefined, then we want to check the URL against the previous resource,
  // so we add the previousResult to the results, get the urls and then pop it off.
  if (expectedUrl === undefined) {
    results.push(this.previousResult)
  }
  const urls = await this.waychaserProxy.getUrls(this.results)

  const previousResultUrl = expectedUrl === undefined ? urls.pop() : expectedUrl
  urls.forEach(url => {
    expect(url).to.equal(previousResultUrl)
  })
}

async function expectFindOne (relationship, expectation) {
  const found = await findOne.bind(this)(relationship)
  for (const key in found) {
    expectation(found[key])
  }
}

async function findOne (relationship) {
  const found = await this.waychaserProxy.find(this.results, relationship)
  logger.debug(found)
  return found
}

async function invoke (previousResult, relationship, context, options) {
  this.previousResult = previousResult
  this.results = await this.waychaserProxy.invokeAll(
    this.previousResult,
    relationship,
    context,
    options
  )

  return this.results
}

export async function invokeSuccessfully (previousResult, relationship) {
  await invoke.bind(this)(previousResult, relationship)
  for (const key in this.results) {
    expect(this.results[key].success).to.be.true()
  }
}

async function checkStatusCode (expectedStatusCode) {
  const statusCodes = await this.waychaserProxy.getStatusCodes(this.results)
  for (const key in statusCodes) {
    expect(statusCodes[key]).to.equal(expectedStatusCode)
  }
}

Then('the loaded resource will have no operations', async function () {
  await checkOperationCounts.bind(this)(0)
})

Then('the loaded resource will have {int} operation(s)', async function (
  expected
) {
  await checkOperationCounts.bind(this)(expected)
})

Then('the loaded resource will have {string} operation', async function (
  relationship
) {
  await expectFindOne.bind(this)(relationship, assert.isDefined)
})

Then("it won't have a(n) {string} operation", async function (relationship) {
  await expectFindOne.bind(this)(relationship, assert.isUndefined)
})

When('we successfully invoke the {string} operation', async function (
  relationship
) {
  await invokeSuccessfully.bind(this)(this.results[0], relationship)
})

When('we invoke the {string} operation', async function (relationship) {
  await invoke.bind(this)(this.results[0], relationship)
})

Then('the same resource will be returned', async function () {
  await checkUrls.bind(this)()
})

Then('the former resource will be returned', async function () {
  await checkUrls.bind(this)(this.firstResourceRoute)
})

When(
  'invokes each of the {string} operations in turn {int} times',
  async function (relationship, count) {
    for (let index = 0; index < count; index++) {
      await invoke.bind(this)(this.results[0], relationship)
    }
  }
)

Then(
  'invoking a missing operation will immediately return undefined',
  async function () {
    const results = await this.waychaserProxy.invokeAll(
      this.results[0],
      'missing'
    )
    results.forEach(result => {
      expect(result).to.be.undefined()
    })
  }
)

Then(
  'the last resource returned will be the last item in the list',
  async function () {
    await checkUrls.bind(this)(this.lastOnList)
  }
)

When(
  'we invoke the {string} operation with the input',
  { timeout: 3600000 },
  async function (relationship, dataTable) {
    // we store it in expectedBody, because we use in in the next step
    this.expectedBody = dataTable.rowsHash()
    await invoke.bind(this)(this.results[0], relationship, this.expectedBody)
  }
)

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
  await checkBody.bind(this)(
    expectedBody,
    ({ _links, links, customLinks, ...actualBody }) => {
      return actualBody
    }
  )
})

When('the body will contain', async function (documentString) {
  const expectedBody = JSON.parse(documentString)
  await checkBody.bind(this)(expectedBody)
})

async function checkOperationCounts (expected) {
  const operationsCounts = await this.waychaserProxy.getOperationsCounts(
    this.results
  )
  for (const key in operationsCounts) {
    expect(operationsCounts[key]).to.equal(expected)
  }
}

async function invokeWithName (relationship, name) {
  this.results = await this.waychaserProxy.invokeWithObjectQuery(
    this.rootResourceResult,
    {
      rel: relationship,
      name: name
    }
  )
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

When('we invoke the {string} operation with the headers', async function (
  relationship,
  dataTable
) {
  const options = {
    headers: dataTable.rowsHash()
  }
  await invoke.bind(this)(this.results[0], relationship, undefined, options)
})

Then('it will have {int} {string} operations', async function (
  count,
  relationship
) {
  const operationsCounts = await this.waychaserProxy.getOperationsCounts(
    this.results,
    relationship
  )
  for (const key in operationsCounts) {
    expect(operationsCounts[key]).to.equal(count)
  }
})

Then('each {string} will have a {string} operation', async function (
  getRelationship,
  hasRelationship
) {
  this.previousResult = this.results[0]
  const counts = await this.waychaserProxy.getOperationsCounts(
    this.results,
    getRelationship
  )
  for (let nth = 0; nth < counts['0-operations']; nth++) {
    const items = await this.waychaserProxy.invokeNth(
      this.results[0],
      getRelationship,
      nth
    )
    for (const item of items) {
      expect(item.success).to.be.true()
    }
    const hasCounts = await this.waychaserProxy.getOperationsCounts(
      items,
      hasRelationship
    )
    for (const key in hasCounts) {
      expect(hasCounts[key]).to.equal(1)
    }
  }
})
