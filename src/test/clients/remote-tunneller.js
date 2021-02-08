import logger from '../../util/logger'
import browserstack from 'browserstack-local'
import assert from 'assert'

class RemoteTunneller {
  async startTunnel () {
    logger.info('Starting browserstack tunnel...')
    /* istanbul ignore next: does not get executed on CI */
    if (!process.env.BROWSERSTACK_LOCAL_IDENTIFIER) {
      assert(
        process.env.BROWSERSTACK_ACCESS_KEY,
        'process.env.BROWSERSTACK_ACCESS_KEY not set'
      )
      this.tunnel = new browserstack.Local({
        key: process.env.BROWSERSTACK_ACCESS_KEY,
        verbose: true
      })
      await new Promise((resolve, reject) => {
        this.tunnel.start({}, error => {
          /* istanbul ignore if: only get's executed on tunnel setup failure */
          if (error) {
            logger.error('error starting tunnel', error)
            reject(error)
          }
          logger.info('tunnel started')
          resolve()
        })
      })
      logger.info('🚇 Browserstack tunnel started')
    }
  }

  async stopTunnel () {
    /* istanbul ignore next: does not get executed on CI */
    if (this.tunnel) {
      await new Promise(resolve => {
        this.tunnel.stop(resolve)
      })
      delete this.tunnel
    }
  }
}

const instance = new RemoteTunneller()

export { instance as remoteTunneller }
