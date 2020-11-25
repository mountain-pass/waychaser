import webdriver from "selenium-webdriver";
// eslint-disable-next-line no-unused-vars
import logger from "../../util/logger";
import { WebdriverManager } from "./webdriver-manager";
import assert from "assert";
import { remoteTunneler } from "./remote-tunneler";
import { BUILD } from "./build-info";

class WebdriverManagerRemote extends WebdriverManager {
  constructor() {
    super();
    this.tunneler = remoteTunneler;
  }

  async beforeAllTests() {
    await this.tunneler.startTunnel();
    await super.beforeAllTests();
  }

  async beforeTest(scenario) {
    this.driver = await this.buildDriver(scenario.pickle.name);
    logger.debug("driver built");
    await this.loadWaychaserTestPage();

    await super.beforeTest(scenario);
  }

  async afterTest(scenario) {
    await super.afterTest(scenario);

    try {
      logger.debug("sending test results...", scenario.result.status);
      await this.sendTestResult(scenario.result.status);
    } catch (error) {
      /* istanbul ignore next: only get's executed on test framework failure */
      logger.error("coverage", error);
    }
    logger.debug("...sent");

    await this.driver.quit();
    delete this.driver;
  }

  async doBuildDriver(name) {
    assert(
      process.env.BROWSERSTACK_USERNAME,
      "process.env.BROWSERSTACK_USERNAME not set"
    );
    assert(
      process.env.BROWSERSTACK_ACCESS_KEY,
      "process.env.BROWSERSTACK_ACCESS_KEY not set"
    );

    /* istanbul ignore next: branching depends on if running on CI or not */
    const projectName =
      process.env.npm_package_name +
      (process.env.GITHUB_RUN_ID ? "" : "-LOCAL");
    /* istanbul ignore next: branching depends on if running on CI or not */
    const localIdentifier = process.env.BROWSERSTACK_LOCAL_IDENTIFIER;
    const capabilities = {
      "bstack:options": {
        os: "Any",
        projectName,
        buildName: BUILD,
        sessionName: name,
        local: "true",
        ...(localIdentifier && {
          localIdentifier,
        }),
        debug: "true",
        consoleLogs: "verbose",
        networkLogs: "true",
        seleniumVersion: "3.14.0",
        userName: process.env.BROWSERSTACK_USERNAME,
        accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
      },
      browserName: this.browser,
      ...(this.browser !== "iphone" &&
        this.browser !== "android" && { browserVersion: "latest" }),
    };

    this.driver = new webdriver.Builder()
      .usingServer("https://hub-cloud.browserstack.com/wd/hub")
      .withCapabilities(capabilities)
      .build();
    await this.driver.manage().setTimeouts({ script: 40000 });
    return this.driver;
  }

  async sendTestResult(status) {
    /* istanbul ignore else: only get's executed on driver setup failure */
    if (this.driver) {
      await this.driver.executeScript(
        `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"${status}"}}`
      );
    }
  }

  async afterAllTests() {
    super.afterAllTests();
    await this.tunneler.stopTunnel();
  }
}

const instance = new WebdriverManagerRemote();

export { instance as webdriverManagerRemote };
