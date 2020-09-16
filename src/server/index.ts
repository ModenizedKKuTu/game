import WebSocket, { Server as WSServer } from 'ws'
import { IncomingMessage } from 'http'

function connectionHandler (socket: WebSocket, info: IncomingMessage): void {
}
// eslint-disable-next-line handle-callback-err
function errorHandler (error: Error): void {
}

export default class Server {
  private Server: WSServer

  constructor (configure: {
    port: number,
    connectionHandler: typeof connectionHandler,
    errorHandler: typeof errorHandler
  }) {
    this.Server = new WSServer({
      port: configure.port
    })

    this.Server.on('connection', configure.connectionHandler)
    this.Server.on('error', configure.errorHandler)
  }

  public close () {
    this.Server.close()
  }
}
