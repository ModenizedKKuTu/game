import WebSocket from 'ws'

export default class Client {
  protected socket: WebSocket

  constructor (socket: WebSocket) {
    this.socket = socket

    socket.on('message', (msg: string) => this.onMessage(msg))
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

  public onClose (closeHandler: () => void) {
    this.socket.on('close', closeHandler)
  }

  protected onMessage (msg: string): void {

  }
}
