import logger from '../logger'
import Server from '../server'
import { IncomingMessage } from 'http'
import WebSocket from 'ws'
import { Client, WebServer } from '../kkutu'
import { db as MainDB } from 'lib'
import config from '../config'
import { IClientProfile } from '../kkutu/Client'

const WDIC: {
  [idx: string]: WebServer
} = {}
const DIC: {
  [idx: string]: Client
} = {}

export { WDIC, DIC }

export interface IUser {
  _id: string
  authType: string
  money: number
  kkutu: object
  lastLogin: Date
  box: object
  equip: object
  exordial: object
  black: string
  blackDate: Date
  server: string
  friends: object
}

export default async (port: number) => {
  const db = await MainDB({
    database: config.db.database,
    username: config.db.username,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port
  })
  logger.info('Master: DB is Ready!')

  const connectionHandler = async (socket: WebSocket, info: IncomingMessage) => {
    const key = info.url?.slice(1) || makeSID()

    logger.info('Master: new clinet connect!')

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
        }))?.toJSON() as any)?.profile as IClientProfile | undefined

        const client = new Client(socket, session, key)

        if (!client.guest) {
          const user = ((await db.User.findOne({
            where: {
              _id: session?.id,
              authType: session?.authType
            }
          }))?.toJSON() as any) as IUser | undefined

          logger.info(user)
        }

        if (DIC[client.profile.id]) {
          DIC[client.profile.id].sendError(408)
        }

        logger.info(`Master: New client #${client.profile.authType}-${client.profile.id}`)
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

  return server
}

function makeSID (): string {
  let result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (let i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
