import WebSocket from 'ws'

export default class WebSocketClient {
  protected socket: WebSocket

  constructor (socket: WebSocket) {
    this.socket = socket

    socket.on('message', (msg: string) => this.onMessage(msg))
    socket.on('close', (code: number, reason: string) =>
      this.onClose(code, reason)
    )
  }

  public send (type: string, data: Object = {}) {
    const $d = data as any

    $d.type = type

    if (this.socket.readyState === 1) {
      this.socket.send(JSON.stringify($d))
    }
  }

  public close () {
    this.socket.close()
  }

  protected onMessage (msg: string): void {

  }

  public onClose (code: number, reason: string): void {

  }

  public onCloseWithHandler (closeHandler: (code: number, reason: string) => void) {
    this.socket.on('close', (code, reason) => closeHandler(code, reason))
  }
}
