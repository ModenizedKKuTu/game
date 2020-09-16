import logger from '../logger'
import Server from '../server'
import { IncomingMessage } from 'http'
import WebSocket from 'ws'
import { Client, WebServer } from '../kkutu'
import { db as MainDB } from 'lib'
import config from '../config'
import { IClientProfile } from '../kkutu/Client'

export default (port: number) => {
  const WDIC: {
    [idx: string]: WebServer
  } = {}
  const DIC: {
    [idx: string]: Client
  } = {}

  const db = MainDB({
    database: config.db.database,
    username: config.db.username,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port
  })

  const connectionHandler = async (socket: WebSocket, info: IncomingMessage) => {
    const key = info.url?.slice(1)!

    logger.info(`Master: new clinet connect! @key:${key}`)

    if (key === 'webserver') {
      if (WDIC[key]) WDIC[key].close()
      WDIC[key] = new WebServer(socket)

      logger.info(`Master: New web server #${key}`)

      WDIC[key].onCloseWithHandler(() => {
        logger.info(`Master: Exit web server #${key}`)
        delete WDIC[key]
      })
    } else {
      if (Object.keys(DIC).length >= 400) {
        socket.send(
          JSON.stringify({
            type: 'error',
            code: 'full'
          })
        )
      } else {
        const session = ((await db.Session.findOne({
          where: {
            _id: key
          },
          attributes: ['profile']
        }))?.toJSON() as any)?.profile as IClientProfile

        logger.info(session)

        const client = new Client(socket, session, key)

        logger.info(`Master: New client #${client.profile.id}`)
      }
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
