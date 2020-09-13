import { redis } from 'lib'
import config from '../config'

const redisConfig = config.redis

const redisManager = redis({
  db: redisConfig.userDatabase,
  host: redisConfig.host,
  password: redisConfig.password,
  port: redisConfig.port
})

export default redisManager
