import logger from '../../util/logger'
import { createServer } from 'http'
import { API_PORT } from '../config'

import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
import { createHttpTerminator } from 'http-terminator'

const upload = multer()

export const app = express()
app.use(express.static('public'))
app.use(express.static('dist'))

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support url encoded bodies
app.use(upload.none()) // support multi-part bodies
/* istanbul ignore next: only gets executed when there are test errors (at this stage) */
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
let httpTerminator

export async function stopServer () {
  if (httpTerminator !== undefined) {
    logger.info('Stopping Server...')
    await httpTerminator.terminate()
    logger.info('...stopped')
    httpTerminator = undefined
    server = undefined
  }
}

export async function startServer () {
  await stopServer()
  server = createServer(app)
  httpTerminator = createHttpTerminator({
    server
  })
  return new Promise(resolve => {
    server.listen(API_PORT, function () {
      logger.info(
        '📡  Server is listening on port %d ( http://localhost:%d ) ',
        API_PORT,
        API_PORT
      )
      resolve(app)
    })
  })
}
