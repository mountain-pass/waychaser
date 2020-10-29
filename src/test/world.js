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
import { waychaser } from '../../dist/waychaser';

import { waychaserViaWebdriverChrome } from './clients/waychaser-via-webdriver-chrome';
import { waychaserViaWebdriverFirefox } from './clients/waychaser-via-webdriver-firefox';
import { waychaserViaWebdriverSaucy } from './clients/waychaser-via-webdriver-saucy';

chai.use(chaiAsPromised);

global.expect = chai.expect;
global.PendingError = PendingError;

import express from 'express';
import { createServer } from 'http';
import { PORT } from './config';

var app = express();

app.use((request, response, next) => {
  response.append('Access-Control-Allow-Origin', '*');
  next();
});

var router;

app.use(function (request, response, next) {
  router(request, response, next);
});

var server;

export function startServer() {
  stopServer();
  server = createServer(app);
  server.listen(PORT, function () {
    logger.info(
      '📡  Server is listening on port %d ( http://localhost:%d ) ',
      PORT,
      PORT
    );
  });
  return app;
}

export function stopServer() {
  if (server !== undefined) {
    server.close();
  }
}

BeforeAll({ timeout: 240000 }, async function () {
  logger.debug(['BEGIN BeforeAll', Date.now()]);

  startServer();
});

Before({ timeout: 240000 }, async function (scenario) {
  if (this.waychaser && ioc.waychaser.setJobName) {
    await ioc.waychaser.setJobName(scenario.pickle.name);
  }
});

function world({ attach, parameters }) {
  logger.debug('BEGIN world');
  this.attach = attach;
  this.parameters = parameters;
  logger.debug('parameters:\n', JSON.stringify(parameters, undefined, 2));
  this.app = app;
  router = express.Router();
  this.router = router;

  waychaserViaWebdriverSaucy.browser = this.parameters.browser;
  waychaserViaWebdriverSaucy.platform = this.parameters.platform;

  const clients = {
    'node-api': waychaser,
    'browser-api-chrome-local': waychaserViaWebdriverChrome,
    'browser-api-firefox-local': waychaserViaWebdriverFirefox,
    'browser-api-saucy': waychaserViaWebdriverSaucy,
  };
  this.waychaser = clients[this.parameters.client];
  /* istanbul ignore next: only get's executed when there are test config issues*/
  if (this.waychaser == undefined) {
    throw new Error(`unknown client: ${this.parameters.client}`);
  }

  ioc.service('waychaser', () => this.waychaser);

  return '';
}

After({ timeout: 600000 }, async function (scenario) {
  logger.debug('%s: - %s', scenario.pickle.name, scenario.result.status);
  if (ioc.waychaser && ioc.waychaser.loadCoverage) {
    logger.debug('downloading coverage from browser...');
    try {
      await ioc.waychaser.loadCoverage();
    } catch (error) {
      /* istanbul ignore next: only get's executed on test framework failure */
      logger.error('coverage', error);
    }
  }

  if (this.waychaser && ioc.waychaser.sendTestResult) {
    await ioc.waychaser.sendTestResult(scenario.result.status);
  }
  /* istanbul ignore next: only get's executed on test failure */
  if (
    scenario.result.status === 'failed' ||
    scenario.result.status === 'pending'
  ) {
    if (!process.env.CI && ioc.waychaser && ioc.waychaser.allowDebug) {
      logger.debug('waiting for browser debugging to complete...');
      await ioc.waychaser.allowDebug(600000);
    }
  }
});

AfterAll({ timeout: 30000 }, async function () {
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
