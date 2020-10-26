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

import { waychaserViaWebdriver } from './clients/waychaser-via-webdriver';
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
  this.app = app;
  router = express.Router();
  this.router = router;

  switch (process.env.TEST_PROFILE) {
    case 'node-api':
      this.waychaser = waychaser;
      break;
    case 'browser-api':
      this.waychaser = waychaserViaWebdriver;
      break;
    // ignore, because it only get's executed when there are test config issues
    /* istanbul ignore next */
    default:
      throw new Error(`unknown TEST_PROFILE: ${process.env.TEST_PROFILE}`);
  }
  ioc.service('waychaser', () => this.waychaser);

  return '';
}

After({ timeout: 600000 }, async (scenario) => {
  logger.debug('%s: - %s', scenario.pickle.name, scenario.result.status);
  if (ioc.waychaser && ioc.waychaser.loadCoverage) {
    await ioc.waychaser.loadCoverage();
  }

  // ignore, because it only get's executed on test failure
  /* istanbul ignore next */
  if (
    scenario.result.status === 'failed' ||
    scenario.result.status === 'pending'
  ) {
    if (ioc.waychaser && ioc.waychaser.takeScreenshot) {
      await ioc.waychaser.takeScreenshot(
        `test-results/${process.env.TEST_PROFILE}/debug.png`
      );
    }
    if (!process.env.CI && ioc.waychaser && ioc.waychaser.allowDebug) {
      await ioc.waychaser.allowDebug(600000);
    }
  }
});

AfterAll({ timeout: 30000 }, async function () {
  try {
    if (ioc.waychaser && ioc.waychaser.loadCoverage) {
      await ioc.waychaser.loadCoverage();
    }
    if (ioc.waychaser && ioc.waychaser.quit) {
      ioc.waychaser.quit();
    }
    stopServer();
  } catch (error) {
    // ignore, because it only get's executed on test failure
    /* istanbul ignore next */
    {
      logger.error(error);
      throw error;
    }
  }
});
setWorldConstructor(world);

setDefinitionFunctionWrapper(stepDefinitionWrapper);

setDefaultTimeout(20 * 1000);
