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

Before({ timeout: 240000 }, async function () {});

function world({ attach, parameters }) {
  logger.debug('BEGIN world');
  this.attach = attach;
  this.parameters = parameters;
  logger.debug('parameters:\n', JSON.stringify(parameters, undefined, 2));
  this.app = app;
  router = express.Router();
  this.router = router;

  switch (this.parameters.profile) {
    case 'node-api':
      this.waychaser = waychaser;
      break;
    case 'browser-api-chrome':
      this.waychaser = waychaserViaWebdriverChrome;
      break;
    case 'browser-api-firefox':
      this.waychaser = waychaserViaWebdriverFirefox;
      break;
    // ignore, because it only get's executed when there are test config issues
    /* istanbul ignore next */
    default:
      throw new Error(`unknown profile: ${this.parameters.profile}`);
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
      // ignore, because it only get's executed on test framework failure
      /* istanbul ignore next */
      logger.error('coverage', error);
    }
  }

  // ignore, because it only get's executed on test failure
  /* istanbul ignore next */
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
      // ignore, because it only get's executed on test failure
      /* istanbul ignore next */
      logger.error(error);
    }
  }
  stopServer();
});

setWorldConstructor(world);

setDefinitionFunctionWrapper(stepDefinitionWrapper);

setDefaultTimeout(20 * 1000);
