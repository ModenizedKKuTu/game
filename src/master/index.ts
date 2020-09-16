import logger from '../logger'
import Server from '../server'
import { IncomingMessage } from 'http'
import WebSocket from 'ws'
import { Client, WebServer } from '../kkutu'

export default (port: number) => {
  const WDIC: {
    [idx: string]: Client
  } = {}

  const connectionHandler = (socket: WebSocket, info: IncomingMessage) => {
    const key = info.url?.slice(1)

    logger.info(`Master: new clinet connect! @key:${key}`)

    if (key === 'webserver') {
      if (WDIC[key]) WDIC[key].close()
      WDIC[key] = new WebServer(socket)

      logger.info(`Master: New web server #${key}`)

      WDIC[key].onClose(() => {
        logger.info(`Master: Exit web server #${key}`)
        delete WDIC[key]
      })
    }
  }

  const server = new Server({
    port: port,
    errorHandler: (error) => {
      throw error
    },
    connectionHandler
  })
}
