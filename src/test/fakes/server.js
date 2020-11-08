import logger from '../../util/logger';
import { createServer } from 'http';
import { API_PORT } from '../config';

import express from 'express';

export var app = express();

var router;

export function getNewRouter() {
  router = express.Router();
  return router;
}

app.use(function (request, response, next) {
  router(request, response, next);
});

export var server;

export function stopServer() {
  if (server !== undefined) {
    server.close();
  }
}

export function startServer() {
  stopServer();
  server = createServer(app);
  server.listen(API_PORT, function () {
    logger.info(
      '📡  Server is listening on port %d ( http://localhost:%d ) ',
      API_PORT,
      API_PORT
    );
  });
  return app;
}
