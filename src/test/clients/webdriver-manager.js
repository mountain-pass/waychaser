import logger from '../../util/logger'
import logging from 'selenium-webdriver/lib/logging'
import { BROWSER_PORT, BROWSER_HOST } from '../config'
import { utils } from 'istanbul'
import * as babel from '@babel/core'
import babelConfig from '../../../babel.config'
import { abstract } from '../../util/abstract'

delete babelConfig.env.test

/* global __coverage__ */
// based on https://github.com/gotwarlost/istanbul-middleware/blob/dfbca20f361b9c2b79934e395fd266d95d9c5af5/lib/core.js#L217
function mergeClientCoverage (object) {
  /* istanbul ignore else: else is only taken if coverage is off */
  if (process.env.COVERAGE) {
    for (const [filePath, added] of Object.entries(object)) {
      const original = __coverage__[filePath.toString()]
      /* istanbul ignore if: needed for IE but IE doesn't give is coverage */
      if (added.s === null) {
        added.s = {}
      }
      /* istanbul ignore if: needed for IE but IE doesn't give is coverage */
      if (added.f === null) {
        added.f = {}
      }
      /* istanbul ignore if: needed for IE but IE doesn't give is coverage */
      if (added.b === null) {
        added.b = {}
      }
      __coverage__[filePath.toString()] = utils.mergeFileCoverage(
        original,
        added
      )
    }
  }
}

class WebdriverManager {
  async loadWaychaserTestPage () {
    logger.debug('loading page...')
    await this.driver.get('https://google.com')
    await this.driver.get(`http://${BROWSER_HOST}:${BROWSER_PORT}`)
    logger.debug('...page loaded')

    logger.debug('waiting for waychaser...')
    await this.driver.wait(() => {
      return this.executeScript(
        /* istanbul ignore next: won't work in browser otherwise */
        function () {
          return window.waychaser !== undefined
        }
      )
    }, 40000)

    logger.debug('setting up logger function...')
    await this.executeScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (browser) {
        window.testResults = []
        window.testLogs = []
        window.testLogger = function (arguments_) {
          console.log(arguments_)
          // window.testLogs.push(arguments_)
          // // eslint-disable-next-line unicorn/prefer-query-selector
          // var logsElement = document.getElementById('logs') // eslint-disable-line no-var
          // logsElement.textContent += arguments_
          // logsElement.textContent += '\n'
        }

        window.callbackWithError = (done, error) => {
          window.testLogger('error: ' + error.toString())
          const id = window.testResults.push(error) - 1
          done({
            success: false,
            id
            // un-commenting these causes the android tests to fail
            // error: error.toString(),
            // stackTrace: error.stack,
          })
        }

        window.handleResponse = function (promise) {
          return promise
            .then(function (resource) {
              window.testLogger('huzzah!')
              const id = window.testResults.push(resource) - 1
              return { success: true, id }
            })
            .catch(function (error) {
              const id = window.testResults.push(error) - 1
              const result = {
                success: false,
                id
              }
              // returning these on android causes tests to fail
              if (browser !== 'android') {
                result.error = error.toString()
                result.stackTrace = error.stack
              }
              return result
            })
        }

        const queries = [
          relationship => {
            return relationship
          },
          relationship => {
            return { rel: relationship }
          },
          relationship => {
            return element => {
              return element.rel === relationship
            }
          }
        ]

        const searchables = [
          id => {
            return window.testResults[id].operations
          },
          id => {
            return window.testResults[id].ops
          }
        ]

        const invocables = searchables.concat([
          id => {
            return window.testResults[id]
          }
        ])

        function waychaserInvokeAndHandle (invokable, query, context) {
          return window.handleResponse(invokable.invoke(query, context))
        }

        function waychaserFindInvokeAndHandle (searchable, query, context) {
          // eslint-disable-next-line unicorn/no-array-callback-reference -- we made sure query is a single param function
          return window.handleResponse(searchable.find(query).invoke(context))
        }

        window.waychaserInvokeFunctions = []
        invocables.forEach(invokable => {
          queries.forEach(query => {
            window.waychaserInvokeFunctions.push(function (
              id,
              relationship,
              context
            ) {
              return waychaserInvokeAndHandle(
                invokable(id),
                query(relationship),
                context
              )
            })
          })
        })

        searchables.forEach(searchable => {
          queries.forEach(query => {
            window.waychaserInvokeFunctions.push(function (
              id,
              relationship,
              context
            ) {
              return waychaserFindInvokeAndHandle(
                searchable(id),
                query(relationship),
                context
              )
            })
          })
        })
      },
      this.browser
    )
    this.invokeScriptCount = await this.executeScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function () {
        return window.waychaserInvokeFunctions.length
      }
    )
  }

  async beforeAllTests () {}

  async doExecuteScript (executor, script, ...arguments_) {
    const transformed = await this.babelifyCode(script)

    try {
      const returnedFromBrowser = await executor(transformed, ...arguments_)
      logger.debug({ transformed, returnedFromBrowser })
      return returnedFromBrowser
    } catch (error) {
      /* istanbul ignore next: only gets executed when there are webdriver issues */
      logger.error(`error executing script: ${error.name}`)
      /* istanbul ignore next: only gets executed when there are webdriver issues */
      if (
        error.constructor.name === 'WebDriverError' &&
        error.message === 'Session not started or terminated'
      ) {
        try {
          await this.driver.quit()
        } catch (error) {
          logger.error('error quitting browser')
          logger.error(error)
        }
        await this.buildDriver()
        await this.loadWaychaserTestPage()
      }
      /* istanbul ignore next: only gets executed when there are webdriver issues */
      throw error
    }
  }

  async babelifyCode (script) {
    const code = `(${script}).apply(window, arguments)`
    const transformed = await (
      await babel.transformAsync(code, babelConfig)
    ).code.replace('"use strict";\n\n', 'return ')
    return transformed
  }

  async executeScript (script, ...arguments_) {
    return this.doExecuteScript(
      this.driver.executeScript.bind(this.driver),
      script,
      ...arguments_
    )
  }

  async executeAsyncScript (script, ...arguments_) {
    return this.doExecuteScript(
      this.driver.executeAsyncScript.bind(this.driver),
      script,
      ...arguments_
    )
  }

  async beforeTest (scenario) {
    // await this.executeScript(
    //   /* istanbul ignore next: won't work in browser otherwise */
    //   function () {
    //     window.testResults = []
    //     const element = document.querySelector('#test-name')
    //     element.textContent = arguments[0].pickle.name
    //   },
    //   scenario
    // )
    // logger.debug("set test name to '%s'", scenario.pickle.name)
  }

  async afterTest () {
    await this.getBrowserLogs()
    /* istanbul ignore else: IE has issues returning the coverage */
    if (this.browser !== 'ie') {
      logger.debug('downloading coverage from browser...')
      try {
        await this.loadCoverage()
      } catch (error) {
        /* istanbul ignore next: only gets executed on test framework failure */
        logger.error('coverage', error)
      }
      logger.debug('...coverage downloaded')
    }
  }

  async getBrowserLogs () {
    // getting logs appears to be only possible with chrome
    /* istanbul ignore else: doesn't get executed on CI */
    if (this.browser === 'chrome') {
      await this.driver
        .manage()
        .logs()
        .get(logging.Type.BROWSER)
        .then(entries => {
          entries.forEach(entry => {
            logger.browser('[%s] %s', entry.level.name, entry.message)
          })
        })
    }
  }

  async afterAllTests () {}

  async clearRemoteCoverage () {
    /* istanbul ignore else: else is only taken if coverage is off */
    if (process.env.COVERAGE) {
      await this.executeScript(
        /* istanbul ignore next: won't work in browser otherwise */
        function () {
          if (
            typeof window.__coverage__ !== 'undefined' &&
            window.__coverage__ !== null
          ) {
            for (const f in window.__coverage__) {
              const coverage = window.__coverage__[f]
              for (const index in coverage.b) {
                coverage.b[index] = [0, 0]
              }
              for (const index in coverage.f) {
                coverage.f[index] = 0
              }
              for (const index in coverage.s) {
                coverage.s[index] = 0
              }
            }
          }
        }
      )
    }
  }

  async loadCoverage () {
    /* istanbul ignore else: only gets executed when there are fatal web driver issues  */
    if (this.driver && process.env.COVERAGE) {
      try {
        const remoteCoverage = await this.executeScript(
          /* istanbul ignore next: won't work in browser otherwise */
          function () {
            return window.__coverage__
          }
        )
        mergeClientCoverage(remoteCoverage)

        // clear coverage
        await this.clearRemoteCoverage()
      } catch (error) {
        /* istanbul ignore next: only gets executed when there are istanbul issues */
        logger.error(error)
        /* istanbul ignore next: only gets executed when there are istanbul issues */
        throw error
      }
    }
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async doBuildDriver () {
    abstract()
  }

  async buildDriver () {
    try {
      return this.doBuildDriver()
    } catch (error) {
      /* istanbul ignore next: only gets executed when there are web driver issues */
      logger.error('error getting browser', error)
      /* istanbul ignore next: only gets executed when there are web driver issues */
      throw error
    }
  }
}

export { WebdriverManager }
