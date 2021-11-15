import {
  PendingError,
  stepDefinitionWrapper
} from '@windyroad/cucumber-js-throwables'
import {
  setDefinitionFunctionWrapper,
  setWorldConstructor,
  Before,
  BeforeAll,
  After,
  AfterAll,
  setDefaultTimeout
} from '@cucumber/cucumber'
import chai from 'chai'
import dirtyChai from 'dirty-chai'
import logger from '../util/logger'
import chaiAsPromised from 'chai-as-promised'
import assert from 'assert'

import { WaychaserDirect } from './clients/waychaser-direct'
import { WaychaserViaWebdriver } from './clients/waychaser-via-webdriver'
import { webdriverManagerLocal } from './clients/webdriver-manager-local'
import { webdriverManagerRemote } from './clients/webdriver-manager-remote'

import { startServer, app, stopServer, getNewRouter } from './fakes/server'
import { API_PORT, API_HOST } from './config'

chai.use(chaiAsPromised)
chai.use(dirtyChai)

global.expect = chai.expect
global.PendingError = PendingError

const profile = process.env.npm_lifecycle_event
  .replace('test:', '')
  .replace(/:/g, '-')

const DEFAULT_STEP_TIMEOUT = 90 * 1000

let waychaserProxy, webdriverManager

// if testing via browser, setup web-driver
if (profile.startsWith('browser-api')) {
  const mode = process.env.npm_lifecycle_event.replace(
    /.*:(local|remote).*/,
    '$1'
  )
  const clients = {
    local: webdriverManagerLocal,
    remote: webdriverManagerRemote
  }
  webdriverManager = clients[mode.toString()]
  assert(webdriverManager !== undefined, `unknown mode ${mode}`)
  webdriverManager.DEFAULT_STEP_TIMEOUT = DEFAULT_STEP_TIMEOUT

  /* istanbul ignore next: only gets executed when there are test config issues */
  if (webdriverManager === undefined) {
    throw new Error(`unknown mode: ${mode}`)
  }
  webdriverManager.browser = process.env.npm_lifecycle_event.replace(
    /.*:browser-api[^:]*:([^:]+):.*/,
    '$1'
  )
  waychaserProxy = new WaychaserViaWebdriver(webdriverManager)
} else {
  // otherwise, direct
  waychaserProxy = new WaychaserDirect()
}

let baseUrl = `http://${API_HOST}:${API_PORT}`

BeforeAll({ timeout: 240_000 }, async function () {
  logger.info('BEGIN BeforeAll', Date.now())

  logger.info('Starting server...')
  await startServer()

  logger.info('Setting up test framework')
  if (webdriverManager) {
    baseUrl = await webdriverManager.beforeAllTests()
  }

  logger.info('END BeforeAll', Date.now())
})

function world ({ attach }) {
  logger.info('BEGIN world')

  this.attach = attach
  this.app = app

  // reset the fake API server, so we can set new routes
  this.router = getNewRouter()
  this.baseUrl = baseUrl

  logger.info('END world')
  return ''
}

Before({ timeout: 240_000 }, async function (scenario) {
  logger.info('BEGIN Before')
  this.router = getNewRouter()
  this.waychaserProxy = waychaserProxy
  await this.waychaserProxy.reset()
  if (webdriverManager) {
    await webdriverManager.beforeTest(scenario)
  }
  logger.info('END Before')
})

After({ timeout: 600_000 }, async function (scenario) {
  logger.info('BEGIN After')

  logger.info('%s: - %s', scenario.pickle.name, scenario.result.status)
  if (webdriverManager) {
    await webdriverManager.afterTest(scenario)
  }
  logger.info('END After')
})

AfterAll({ timeout: 600_000 }, async function () {
  logger.info('BEGIN AfterAll')
  if (webdriverManager) {
    await webdriverManager.afterAllTests()
  }
  await stopServer()
  logger.info('END AfterAll')
})

setWorldConstructor(world)

setDefinitionFunctionWrapper(stepDefinitionWrapper)

setDefaultTimeout(DEFAULT_STEP_TIMEOUT)
