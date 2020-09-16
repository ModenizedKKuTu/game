import logger from '../logger'
import Client from './Client'

export interface IWebServerSeek {
  value: number
}

export default class WebServer extends Client {
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
