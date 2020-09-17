import WebSocketClient from './WebSocketClinet'
import WebSocket from 'ws'

export interface IClientProfile {
  id: string
  name: string
  authType: string
  image: string
}

export default class Client extends WebSocketClient {
  profile: IClientProfile
  isAjae: boolean
  guest: boolean

  place: number
  team: number
  ready: boolean
  game: object

  subPlace: number
  error: boolean
  blocked: boolean
  spam: number
  _pub: Date

  admin: boolean
  remoteAddress: string

  constructor (socket: WebSocket, profile: IClientProfile|undefined, sid: string) {
    super(socket)

    this.socket = socket
    this.place = 0
    this.team = 0
    this.ready = false
    this.game = {}

    this.subPlace = 0
    this.error = false
    this.blocked = false
    this.spam = 0
    this._pub = new Date()

    this.admin = false
    this.remoteAddress = ''

    if (profile) {
      this.profile = {
        id: profile.id,
        name: profile.name,
        authType: profile.authType,
        image: profile.image
      }

      this.guest = false
      this.isAjae = false
    } else {
      this.profile = {
        id: sid,
        name: getGuestName(sid),
        authType: 'guest',
        image: '/img/kkutu/guest.png'
      }

      this.guest = true
      this.isAjae = false
    }
  }

  public onClose (code: number, _reason: string) {

  }

  protected onMessage (msg: string) {

  }

  public sendError (code: number, reason: string = '') {
    this.send('error', { code, reason })
  }
}

function getGuestName (sid: string) {
  const len = sid.length
  let res = 0

  for (let i = 0; i < len; i++) {
    res += sid.charCodeAt(i) * (i + 1)
  }
  return `GUEST${(1000 + (res % 9000))}`
}
