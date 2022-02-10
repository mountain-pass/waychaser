import debug from 'debug'
const logger = {
  debug: debug('debug'),
  info: debug('info'),
  error: debug('error'),
  browser: debug('browser'),
  remote: debug('remote'),
  waychaser: debug('waychaser'),
  test: debug('test')
}

logger.debug.log = console.log.bind(console)
logger.info.log = console.log.bind(console)
logger.error.log = console.log.bind(console)
logger.browser.log = console.log.bind(console)
logger.remote.log = console.log.bind(console)
logger.waychaser.log = console.log.bind(console)
logger.test.log = console.log.bind(console)

/* istanbul ignore next: not executed on CI */
if (typeof process === 'undefined' || process.env.DEBUG === undefined) {
  debug.enable('info,error')
  debug.enable('debug,info,error,browser,remote,waychaser,test')
}

export default logger
