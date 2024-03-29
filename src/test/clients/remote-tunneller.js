import logger from '../logger'
import localtunnel from 'localtunnel'

class RemoteTunneller {
  async startTunnel () {
    logger.info('Starting tunnel...')
    this.tunnel = await localtunnel({ port: process.env.API_PORT })
    logger.info(`🚇  tunnel started: ${this.tunnel.url}`)
  }

  async stopTunnel () {
    this.tunnel.close()
  }
}

const instance = new RemoteTunneller()

export { instance as remoteTunneller }
