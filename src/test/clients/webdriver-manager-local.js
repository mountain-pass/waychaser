import { WebdriverManager } from './webdriver-manager'
import { Builder, Capabilities } from 'selenium-webdriver'
import logging from 'selenium-webdriver/lib/logging'
import chrome from 'selenium-webdriver/chrome'
import firefox from 'selenium-webdriver/firefox'
import logger from '../../util/logger'
import { API_HOST, API_PORT } from '../config'

class WebdriverManagerLocal extends WebdriverManager {
  async beforeAllTests () {
    this.driver = await this.buildDriver()
    const url = `http://${API_HOST}:${API_PORT}`
    await this.loadWaychaserTestPage(url)
    return url
  }

  async afterTest (scenario) {
    await super.afterTest(scenario)

    /* istanbul ignore next: only gets executed on test failure */
    if (
      scenario.result.status === 'failed' ||
      scenario.result.status === 'pending'
    ) {
      logger.debug('waiting for browser debugging to complete...')
      await this.allowDebug(600_000)
    }
  }

  /* istanbul ignore next: only gets executed on test failure */
  async allowDebug (timeout) {
    if (this.driver && process.env.CI === undefined) {
      this.executeScript(
        /* istanbul ignore next: only gets executed on test failure */
        function () {
          window.alert(
            `Window will remain for ${arguments[0]}ms for debugging purposes`
          )
        },
        timeout
      )
      await this.driver.wait(
        () =>
          this.driver.getAllWindowHandles().then(handles => {
            // logger.debug(`${handles.length} handles still open`);
            return handles.length === 0
          }),
        timeout
      )
    }
  }

  async afterAllTests () {
    // we should call this.driver.quit() here, but
    // doing so cause the tests to hang on my machine, waiting for
    // firefox to quit.
    // Since webdriver closes the browsers when the process terminates
    // we rely on that instead.
    /* istanbul ignore next: only firefox */
    if (this.driver && this.browser !== 'firefox') {
      await this.driver.quit()
    }
    await super.afterAllTests()
  }

  async doBuildDriver () {
    const prefs = new logging.Preferences()
    prefs.setLevel(logging.Type.BROWSER, logging.Level.DEBUG)

    const caps = Capabilities[this.browser]()
    caps.setLoggingPrefs(prefs)

    const builder = new Builder()
      .withCapabilities(caps)
      .forBrowser(this.browser)

    const chromeOptions = new chrome.Options()
    const firefoxOptions = new firefox.Options()
    chromeOptions.addArguments('disable-web-security')
    /* istanbul ignore next: only gets executed on CI server */
    if (process.env.CI) {
      chromeOptions.headless()
      firefoxOptions.headless()
    }
    builder.setChromeOptions(chromeOptions)
    builder.setFirefoxOptions(firefoxOptions)
    this.driver = builder.build()

    return this.driver
  }
}

const instance = new WebdriverManagerLocal()

export { instance as webdriverManagerLocal }
