import logger from '../logger'
import WebSocketClient from './WebSocketClinet'

export interface IWebServerSeek {
  value: number
}

export default class WebServer extends WebSocketClient {
  protected onMessage (msg: string) {
    try {
      const $msg = JSON.parse(msg)
      switch ($msg.type) {
        case 'seek':
          this.send('seek', { value: 0 } as IWebServerSeek)
          break
        case 'narrate-friend':
          break
      }
    } catch (e) {
      logger.debug(e)
    }
  }
}
