#!/usr/bin/env babel-node

import fetch from 'isomorphic-fetch'
import assert from 'assert'
import logger from '../src/util/logger'

assert(
  process.env.BROWSERSTACK_USERNAME,
  'process.env.BROWSERSTACK_USERNAME not set'
)
assert(
  process.env.BROWSERSTACK_ACCESS_KEY,
  'process.env.BROWSERSTACK_ACCESS_KEY not set'
)

/**
 *
 */
async function getPlanInfo () {
  const response = await fetch(
    'https://api.browserstack.com/automate/plan.json',
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.BROWSERSTACK_USERNAME +
            ':' +
            process.env.BROWSERSTACK_ACCESS_KEY
        ).toString('base64')}`
      }
    }
  )
  return response.json()
}

/**
 * @param since
 */
function secondsSince (since) {
  return (Date.now() - since) / 1000
}

/**
 * @param min
 * @param max
 */
function getRandomInt (min, max) {
  return Math.floor(Math.random() * Math.floor(max - min)) + min
}

const MAX_WAIT = 10 * 60 * 60 // 10hr
const RESERVED_SESSIONS = 1
const MIN_WAIT_TIME = 40
const MAX_WAIT_TIME = 80
const MAX_INIT_WAIT_TIME = 120
/**
 *
 */
async function waitForSpareSession () {
  const start = Date.now()
  // inital random sleep so all the different browserstack tests don't try to start at once
  const initialWaitTime = getRandomInt(0, MAX_INIT_WAIT_TIME)
  logger.info(`waiting ${initialWaitTime} before starting availability check`)
  while (secondsSince(start) < MAX_WAIT) {
    await new Promise(resolve => setTimeout(resolve, initialWaitTime * 1000))
    const planInfo = await getPlanInfo()
    const maxAllowed =
      planInfo.parallel_sessions_max_allowed - RESERVED_SESSIONS
    logger.info(
      `${maxAllowed -
        planInfo.parallel_sessions_running} of ${maxAllowed} sessions available (${RESERVED_SESSIONS} reserved)`
    )
    if (planInfo.parallel_sessions_running < maxAllowed) {
      return
    }
    await new Promise(resolve =>
      setTimeout(resolve, getRandomInt(MIN_WAIT_TIME, MAX_WAIT_TIME) * 1000)
    )
  }
  console.error(`No available sessions after waiting ${MAX_WAIT / 60 / 60}hrs`)
  process.exit(1)
}

waitForSpareSession()
