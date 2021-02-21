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

const DEFAULT_STEP_TIMEOUT = 90 * 1000

let waychaserProxy, webdriverManager

// if testing via browser, setup web-driver
if (profile.startsWith('browser-api')) {
  const mode = profile.split('-')[3]
  const clients = {
    local: webdriverManagerLocal,
    remote: webdriverManagerRemote
  }
  webdriverManager = clients[mode.toString()]
  webdriverManager.DEFAULT_STEP_TIMEOUT = DEFAULT_STEP_TIMEOUT

  /* istanbul ignore next: only gets executed when there are test config issues */
  if (webdriverManager === undefined) {
    throw new Error(`unknown mode: ${mode}`)
  }
  webdriverManager.browser = profile.split('-')[2]
  waychaserProxy = new WaychaserViaWebdriver(webdriverManager)
} else {
  // otherwise, direct
  waychaserProxy = new WaychaserDirect()
}

BeforeAll({ timeout: 240000 }, async function () {
  logger.info('BEGIN BeforeAll', Date.now())

  if (webdriverManager) {
    await webdriverManager.beforeAllTests()
  }
  logger.info('Starting server...')
  await startServer()

  logger.info('END BeforeAll', Date.now())
})

function world ({ attach }) {
  logger.info('BEGIN world')

  this.attach = attach
  this.app = app

  // reset the fake API server, so we can set new routes
  this.router = getNewRouter()

  logger.info('END world')
  return ''
}

Before({ timeout: 240000 }, async function (scenario) {
  logger.info('BEGIN Before')
  this.router = getNewRouter()
  this.waychaserProxy = waychaserProxy
  await this.waychaserProxy.reset()
  if (webdriverManager) {
    await webdriverManager.beforeTest(scenario)
  }
  logger.info('END Before')
})

After({ timeout: 600000 }, async function (scenario) {
  logger.info('BEGIN After')

  logger.info('%s: - %s', scenario.pickle.name, scenario.result.status)
  if (webdriverManager) {
    await webdriverManager.afterTest(scenario)
  }
  logger.info('END After')
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
