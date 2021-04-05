// import { SkippedError } from '@windyroad/cucumber-js-throwables'
import { SkippedError } from '@windyroad/cucumber-js-throwables'
import { assert } from 'chai'
import logger from '../../util/logger'
import { WaychaserProxy } from './waychaser-proxy'

class WaychaserViaWebdriver extends WaychaserProxy {
  constructor (manager) {
    super()
    this.manager = manager
  }

  async load (url) {
    await this.manager.getBrowserLogs()
    logger.debug(`loading ${url}`)
    const rval = await this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (url, done) {
        window.testLogger(`loading ${url}`)
        window.testWaychaser
          .load(url)
          .then(function (resource) {
            window.testLogger('success')
            const id = window.testResults.push(resource) - 1
            window.testLogger('calling back')
            done({ success: true, id })
          })
          .catch(error => {
            window.callbackWithError(done, error)
          })
      },
      url
    )
    await this.manager.getBrowserLogs()
    return rval
  }

  async getOperationsCounts (results) {
    return this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (results, done) {
        const counts = {}
        for (const key in results) {
          counts[`${key}-operations`] =
            window.testResults[results[key].id].operations.length
          counts[`${key}-ops`] = window.testResults[results[key].id].ops.length
        }
        done(counts)
      },
      results
    )
  }

  async find (results, relationship) {
    await this.manager.getBrowserLogs()
    const found = await this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (results, relationship, done) {
        window.testLogger(JSON.stringify({ results }, undefined, 2))
        const innerFound = [
          // eslint-disable-next-line unicorn/no-array-callback-reference -- relationship is not a function
          window.testResults[results[0].id].operations.find(relationship),
          window.testResults[results[0].id].operations.find({
            rel: relationship
          }),
          window.testResults[results[0].id].operations.find(element => {
            return element.rel === relationship
          }),
          // eslint-disable-next-line unicorn/no-array-callback-reference -- relationship is not a function
          window.testResults[results[0].id].ops.find(relationship),
          window.testResults[results[0].id].ops.find({ rel: relationship }),
          window.testResults[results[0].id].ops.find(element => {
            return element.rel === relationship
          })
        ]
        window.testLogger('INNER FOUND')
        window.testLogger(JSON.stringify(innerFound))
        window.testLogger(results[0].id)
        window.testLogger(window.testResults[results[0].id])
        window.testLogger(
          // eslint-disable-next-line unicorn/no-array-callback-reference -- relationship is not a function
          window.testResults[results[0].id].ops.find(relationship)
        )
        window.testLogger(
          JSON.stringify([
            // eslint-disable-next-line unicorn/no-array-callback-reference -- relationship is not a function
            window.testResults[results[0].id].ops.find(relationship)
          ])
        )
        // iphone tests will fail if we try and pass this back as array
        done(JSON.stringify(innerFound))
      },
      results,
      relationship
    )
    // when an matching operation is not found, `find` returns `undefined`, but when `undefined` is converted
    // to a string within an array, it becomes `null`. Yeah, WTF?
    // WebDriver converts to and from string to send to and from the browser, so when we get null back, we need
    // to convert it back to undefined
    return JSON.parse(found).map(item => {
      return item === null ? undefined : item
    })
  }

  async invokeAll (result, relationship, context, options) {
    let batchSize = this.manager.invokeScriptCount
    // taking too long on IE doing it as one batch, so we split it into three batches
    /* istanbul ignore next: IE doesn't report coverage */
    if (['ie', 'iphone'].includes(this.manager.browser)) {
      batchSize = 4
    }
    const batches = this.manager.invokeScriptCount / batchSize
    let allResults = []
    for (let batch = 0; batch < batches; batch++) {
      const batchStart = batch * batchSize
      const batchEnd = batchStart + batchSize

      const batchResults = await this.manager.executeAsyncScript(
        batchInvoke,
        result.id,
        relationship,
        context,
        options,
        { start: batchStart, end: batchEnd }
      )
      allResults = [...allResults, ...batchResults]
    }
    assert.equal(allResults.length, this.manager.invokeScriptCount)
    // when an matching operation is not found, `invoke` returns `undefined`, but when `undefined` is converted
    // to a string within an array, it becomes `null`. Yeah, WTF?
    // WebDriver converts to and from string to send to and from the browser, so when we get null back, we need
    // to convert it back to undefined
    return allResults.map(item => (item === null ? undefined : item))
  }

  async invokeWithObjectQuery (result, query, context) {
    return this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (id, query, context, done) {
        Promise.all([
          window.handleResponse(window.testResults[id].invoke(query, context)),
          window.handleResponse(
            window.testResults[id].operations.invoke(query, context)
          ),
          window.handleResponse(
            window.testResults[id].ops.invoke(query, context)
          ),
          window.handleResponse(
            // eslint-disable-next-line unicorn/no-array-callback-reference -- query is not a function
            window.testResults[id].operations.find(query).invoke(context)
          ),
          window.handleResponse(
            // eslint-disable-next-line unicorn/no-array-callback-reference -- query is not a function
            window.testResults[id].ops.find(query).invoke(context)
          )
        ]).then(results => {
          done(results)
        })
      },
      result.id,
      query,
      context
    )
  }

  async getUrls (results) {
    return this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (ids, done) {
        done(
          ids.map(id => {
            return window.testResults[id].response.url
          })
        )
      },
      results.map(result => result.id)
    )
  }

  async getBodies (results) {
    return this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (results, done) {
        Promise.all(
          results.map(result => {
            return window.testResults[result.id].body()
          })
        ).then(bodies => {
          done(bodies)
        })
      },
      results
    )
  }

  async getStatusCodes (results) {
    return this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (results, done) {
        const codes = {}
        for (const key in results) {
          codes[key] = window.testResults[results[key].id].response.status
        }
        done(codes)
      },
      results
    )
  }

  async use (handler, mediaRanges) {
    const handlerCode = handler
      .toString()
      .replace('_waychaser.Operation', 'Operation')
    logger.debug('handlerCode', handlerCode)
    return this.manager.executeAsyncScript(
      `function (mediaRanges, done) {
        window.testWaychaser = window.testWaychaser.use(${handlerCode}, mediaRanges)
        done()
      }`,
      mediaRanges
    )
  }

  async reset () {
    return this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (done) {
        window.testWaychaser = window.waychaser
        done()
      }
    )
  }

  async useDefaultHandlers () {
    return this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (done) {
        window.testWaychaser.useDefaultHandlers()
        done()
      }
    )
  }

  async parseAccept (accept) {
    return this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (accept, done) {
        done(window.parseAccept(accept))
      },
      accept
    )
  }

  async executeCode (code, baseUrl) {
    await this.manager.executeScriptNoReturn(
      `window.waychaserTestFunction = function(waychaser, baseUrl) {
          ${code}
        }`
    )
    const result = await this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (baseUrl, done) {
        window
          .waychaserTestFunction(window.testWaychaser, baseUrl)
          .then(resource => {
            done({
              success: resource.response.ok,
              id: window.testResults.push(resource) - 1
            })
          })
          .catch(error => {
            done({
              success: error.message === 'Server Error' ? 'skipped' : false,
              id: window.testResults.push(error) - 1
            })
          })
      },
      baseUrl
    )
    /* istanbul ignore next: only occurs if a testing external dependency is unavailable */
    if (result.success === 'skipped') {
      throw new SkippedError('Server is having issues')
    }
    return result
  }
}

export { WaychaserViaWebdriver }

/* istanbul ignore next: won't work in browser otherwise */
function batchInvoke (id, relationship, context, options, batch, done) {
  const resultsPromises = window.waychaserInvokeFunctions
    .slice(batch.start, batch.end)
    .map(invokeFunction => {
      return invokeFunction(id, relationship, context, options)
    })
  Promise.all(resultsPromises).then(results => {
    done(results)
  })
}
