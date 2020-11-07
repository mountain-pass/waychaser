import {
  PendingError,
  stepDefinitionWrapper,
} from '@windyroad/cucumber-js-throwables';
import {
  setDefinitionFunctionWrapper,
  setWorldConstructor,
  Before,
  BeforeAll,
  After,
  AfterAll,
  setDefaultTimeout,
} from 'cucumber';
import chai from 'chai';
import logger from '../util/logger';
import ioc from '../util/ioc-container';
import chaiAsPromised from 'chai-as-promised';
import { waychaser } from '../waychaser';

import { waychaserViaWebdriverLocalChrome } from './clients/waychaser-via-webdriver-local-chrome';
import { waychaserViaWebdriverLocalFirefox } from './clients/waychaser-via-webdriver-local-firefox';
import { waychaserViaWebdriverRemote } from './clients/waychaser-via-webdriver-remote';
import { waychaserViaWebdriverLocalSafari } from './clients/waychaser-via-webdriver-local-safari';

chai.use(chaiAsPromised);

global.expect = chai.expect;
global.PendingError = PendingError;

import { startServer, app, stopServer, resetRouter } from './server';

BeforeAll({ timeout: 240000 }, async function () {
  logger.debug(['BEGIN BeforeAll', Date.now()]);

  startServer();
});

Before({ timeout: 240000 }, async function (scenario) {
  if (this.waychaser && this.waychaser.setJobName) {
    await this.waychaser.setJobName(scenario.pickle.name);
  }
});

function world({ attach, parameters }) {
  logger.debug('BEGIN world');
  this.attach = attach;
  this.app = app;
  this.router = resetRouter();

  const clients = {
    'node-api': waychaser,
    'browser-api-chrome-local': waychaserViaWebdriverLocalChrome,
    'browser-api-firefox-local': waychaserViaWebdriverLocalFirefox,
    'browser-api-safari-local': waychaserViaWebdriverLocalSafari,
    'browser-api-remote': waychaserViaWebdriverRemote,
  };
  const clientName = parameters.profile.replace(
    /browser-api-.*-remote/,
    'browser-api-remote'
  );
  this.waychaser = clients[clientName.toString()];
  /* istanbul ignore next: only get's executed when there are test config issues*/
  if (this.waychaser == undefined) {
    throw new Error(`unknown client: ${clientName}`);
  }
  waychaserViaWebdriverRemote.browser = parameters.profile.replace(
    /browser-api-(.*)-remote/,
    '$1'
  );

  // needed for afterAll shutdown
  ioc.service('waychaser', () => this.waychaser);

  return '';
}

After({ timeout: 600000 }, async function (scenario) {
  logger.debug('%s: - %s', scenario.pickle.name, scenario.result.status);
  if (this.waychaser && this.waychaser.loadCoverage) {
    logger.debug('downloading coverage from browser...');
    try {
      await this.waychaser.loadCoverage();
    } catch (error) {
      /* istanbul ignore next: only get's executed on test framework failure */
      logger.error('coverage', error);
    }
    logger.debug('...coverage downloaded');
  }

  if (this.waychaser && this.waychaser.sendTestResult) {
    try {
      logger.debug('sending test results...', scenario.result.status);
      await this.waychaser.sendTestResult(scenario.result.status);
    } catch (error) {
      /* istanbul ignore next: only get's executed on test framework failure */
      logger.error('coverage', error);
    }
    logger.debug('...sent');
  }
  /* istanbul ignore next: only get's executed on test failure */
  if (
    scenario.result.status === 'failed' ||
    scenario.result.status === 'pending'
  ) {
    if (!process.env.CI && this.waychaser && this.waychaser.allowDebug) {
      logger.debug('waiting for browser debugging to complete...');
      await this.waychaser.allowDebug(600000);
    }
  }
});

AfterAll({ timeout: 600000 }, async function () {
  if (ioc.waychaser && ioc.waychaser.quit) {
    try {
      await ioc.waychaser.quit();
    } catch (error) {
      /* istanbul ignore next: only get's executed on test failure */
      logger.error(error);
    }
  }
  stopServer();
});

setWorldConstructor(world);

setDefinitionFunctionWrapper(stepDefinitionWrapper);

setDefaultTimeout(20 * 1000);
