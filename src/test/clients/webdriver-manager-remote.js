import webdriver from 'selenium-webdriver'
// eslint-disable-next-line no-unused-vars
import logger from '../../util/logger'
import { WebdriverManager } from './webdriver-manager'
import assert from 'node:assert'
import { remoteTunneller } from './remote-tunneller'
import { BUILD } from './build-info'
import chrome from 'selenium-webdriver/chrome'

class WebdriverManagerRemote extends WebdriverManager {
  constructor () {
    super()
    this.tunneller = remoteTunneller
    this.status = 'passed'
  }

  async beforeAllTests () {
    await this.tunneller.startTunnel()
    this.driver = await this.buildDriver()
    logger.debug('driver built')
    await this.loadWaychaserTestPage(remoteTunneller.tunnel.url)
    return remoteTunneller.tunnel.url
  }

  async afterTest (scenario) {
    await super.afterTest(scenario)
    /* istanbul ignore next: only get's executed when there are test failures */
    if (scenario.result.status === 'failed') {
      this.status = 'failed'
    }
  }

  async doBuildDriver () {
    assert(
      process.env.BROWSERSTACK_USERNAME,
      'process.env.BROWSERSTACK_USERNAME not set'
    )
    assert(
      process.env.BROWSERSTACK_ACCESS_KEY,
      'process.env.BROWSERSTACK_ACCESS_KEY not set'
    )

    /* istanbul ignore next: branching depends on if running on CI or not */
    const projectName =
      process.env.npm_package_name + (process.env.GITHUB_RUN_ID ? '' : '-LOCAL')
    /* istanbul ignore next: branching depends on if running on CI or not */
    const capabilities = {
      'bstack:options': {
        os: 'Any',
        projectName,
        buildName: BUILD,
        debug: 'true',
        consoleLogs: 'verbose',
        networkLogs: 'true',
        seleniumVersion: '3.14.0',
        userName: process.env.BROWSERSTACK_USERNAME,
        accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
        ...(this.browser === 'android' && {
          realMobile: 'true'
        }),
        ...(this.browser === 'iphone' && {
          deviceName: 'iPhone 12',
          realMobile: 'true'
        }),
        ...((this.browser === 'ie' ||
          this.browser === 'edge' ||
          this.browser === 'chrome' ||
          this.browser === 'firefox') && {
          os: 'Windows',
          osVersion: '10'
        }),
        ...(this.browser === 'safari' && {
          os: 'OS X',
          osVersion: 'Big Sur'
        }),
        idleTimeout: this.DEFAULT_STEP_TIMEOUT / 1000 + 10
      },
      browserName: this.browser,
      ...(this.browser !== 'iphone' &&
        this.browser !== 'android' && { browserVersion: 'latest' })
    }

    this.driver = new webdriver.Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub')
      .withCapabilities(capabilities)
      .setChromeOptions(
        new chrome.Options()
          .addArguments('disable-web-security')
          .addArguments('disable-notifications')
      )
      .build()
    await this.driver.manage().setTimeouts({ script: 60_000 })
    return this.driver
  }

  async sendTestResult (status) {
    /* istanbul ignore else: only get's executed on driver setup failure */
    if (this.driver) {
      await this.driver.executeScript(
        `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"${status}"}}`
      )
    }
  }

  async afterAllTests () {
    setTimeout(takeTheWin, 60 * 1000, this.status)
    try {
      logger.debug('sending test results...', this.status)
      await this.sendTestResult(this.status)
    } catch (error) {
      /* istanbul ignore next: only get's executed on test framework failure */
      logger.error('error sending test results', error)
    }
    logger.debug('...sent')

    await this.driver.quit()
    delete this.driver

    super.afterAllTests()
    await this.tunneller.stopTunnel()
  }
}

/* istanbul ignore next: only get's executed on test framework issues */
function takeTheWin (status) {
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(status === 'passed' ? 0 : 1)
}

const instance = new WebdriverManagerRemote()

export { instance as webdriverManagerRemote }
