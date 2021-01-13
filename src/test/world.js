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

import { WaychaserDirect } from './clients/waychaser-direct'
import { WaychaserViaWebdriver } from './clients/waychaser-via-webdriver'
import { webdriverManagerLocal } from './clients/webdriver-manager-local'
import { webdriverManagerRemote } from './clients/webdriver-manager-remote'

import { startServer, app, stopServer, getNewRouter } from './fakes/server'

chai.use(chaiAsPromised)
chai.use(dirtyChai)

global.expect = chai.expect
global.PendingError = PendingError

const profile = process.env.npm_lifecycle_event
  .replace('test:', '')
  .replace(/:/g, '-')

const DEFAULT_STEP_TIMEOUT = 80 * 1000

let waychaserProxy, webdriverManager

// if testing via browser, setup web-driver
if (profile.startsWith('browser-api')) {
  const mode = profile.replace(/browser-api-.*-(.*)/, '$1')
  const clients = {
    local: webdriverManagerLocal,
    remote: webdriverManagerRemote
  }
  webdriverManager = clients[mode.toString()]
  webdriverManager.DEFAULT_STEP_TIMEOUT = DEFAULT_STEP_TIMEOUT

  /* istanbul ignore next: only get's executed when there are test config issues */
  if (webdriverManager === undefined) {
    throw new Error(`unknown mode: ${mode}`)
  }
  webdriverManager.browser = profile.replace(/browser-api-(.*)-.*/, '$1')
  waychaserProxy = new WaychaserViaWebdriver(webdriverManager)
} else {
  // otherwise, direct
  waychaserProxy = new WaychaserDirect()
}

BeforeAll({ timeout: 240000 }, async function () {
  logger.debug('BEGIN BeforeAll', Date.now())

  if (webdriverManager) {
    await webdriverManager.beforeAllTests()
  }
  startServer()
})

function world ({ attach }) {
  logger.debug('BEGIN world')

  this.attach = attach
  this.app = app

  // reset the fake API server, so we can set new routes
  this.router = getNewRouter()

  logger.debug('END world')
  return ''
}

Before({ timeout: 240000 }, async function (scenario) {
  logger.debug('BEGIN Before')
  this.router = getNewRouter()
  this.waychaserProxy = waychaserProxy
  if (webdriverManager) {
    await webdriverManager.beforeTest(scenario)
  }
  logger.debug('END Before')
})

After({ timeout: 600000 }, async function (scenario) {
  logger.debug('BEGIN After')

  logger.debug('%s: - %s', scenario.pickle.name, scenario.result.status)
  if (webdriverManager) {
    await webdriverManager.afterTest(scenario)
  }
  logger.debug('END After')
})

AfterAll({ timeout: 600000 }, async function () {
  logger.debug('BEGIN AfterAll')
  if (webdriverManager) {
    await webdriverManager.afterAllTests()
  }
  stopServer()
  logger.debug('END AfterAll')
})

setWorldConstructor(world)

setDefinitionFunctionWrapper(stepDefinitionWrapper)

setDefaultTimeout(DEFAULT_STEP_TIMEOUT)
