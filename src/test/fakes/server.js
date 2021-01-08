import logger from '../../util/logger'
import { createServer } from 'http'
import { API_PORT } from '../config'

import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'

const upload = multer()

export const app = express()
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support url encoded bodies
app.use(upload.none()) // support multi-part bodies

app.use(function (error, request, response, next) {
  logger.error(error)
  next()
})
let router

export function getNewRouter () {
  router = express.Router()
  return router
}

app.use(function (request, response, next) {
  router(request, response, next)
})

export let server

export function stopServer () {
  if (server !== undefined) {
    server.close()
  }
}

export function startServer () {
  stopServer()
  server = createServer(app)
  server.listen(API_PORT, function () {
    logger.info(
      '📡  Server is listening on port %d ( http://localhost:%d ) ',
      API_PORT,
      API_PORT
    )
  })
  return app
}
