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
import chaiAsPromised from 'chai-as-promised';
import { waychaser as waychaserDirect } from '../waychaser';

import { waychaserViaWebdriverLocal } from './clients/waychaser-via-webdriver-local';
import { waychaserViaWebdriverRemote } from './clients/waychaser-via-webdriver-remote';

chai.use(chaiAsPromised);

global.expect = chai.expect;
global.PendingError = PendingError;

import { startServer, app, stopServer, getNewRouter } from './fakes/server';

const profile = process.env.npm_lifecycle_event
  .replace('test:', '')
  .replace(/:/g, '-');

let waychaser, webdriver;

// if testing via browser, setup web-driver
if (profile.startsWith('browser-api')) {
  const mode = profile.replace(/browser-api-.*-(.*)/, '$1');
  const clients = {
    local: waychaserViaWebdriverLocal,
    remote: waychaserViaWebdriverRemote,
  };
  waychaser = clients[mode.toString()];

  /* istanbul ignore next: only get's executed when there are test config issues*/
  if (waychaser == undefined) {
    throw new Error(`unknown mode: ${mode}`);
  }

  webdriver = waychaser;
  webdriver.browser = profile.replace(/browser-api-(.*)-.*/, '$1');
} else {
  // otherwise, direct
  waychaser = waychaserDirect;
}

BeforeAll({ timeout: 240000 }, async function () {
  logger.debug(['BEGIN BeforeAll', Date.now()]);

  if (webdriver) {
    await webdriver.beforeAllTests();
  }
  startServer();
});

function world({ attach }) {
  logger.debug('BEGIN world');

  this.attach = attach;
  this.app = app;

  // reset the fake API server, so we can set new routes
  this.router = getNewRouter();

  logger.debug('END world');
  return '';
}

Before({ timeout: 240000 }, async function (scenario) {
  logger.debug('BEGIN Before');
  this.router = getNewRouter();
  this.waychaser = waychaser;
  if (webdriver) {
    await webdriver.beforeTest(scenario);
  }
  logger.debug('END Before');
});

After({ timeout: 600000 }, async function (scenario) {
  logger.debug('BEGIN After');

  logger.debug('%s: - %s', scenario.pickle.name, scenario.result.status);
  if (webdriver) {
    await webdriver.afterTest(scenario);
  }
  logger.debug('END After');
});

AfterAll({ timeout: 600000 }, async function () {
  logger.debug('BEGIN AfterAll');
  if (webdriver) {
    await webdriver.afterAllTests();
  }
  stopServer();
  logger.debug('END AfterAll');
});

setWorldConstructor(world);

setDefinitionFunctionWrapper(stepDefinitionWrapper);

setDefaultTimeout(20 * 1000);
