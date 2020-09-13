import log4js from 'log4js'

const logger = log4js.getLogger()

if (process.env.NODE_ENV === 'production') {
  logger.level = 'INFO'
} else if (process.env.NODE_ENV === 'development') {
  logger.level = 'DEBUG'
} else {
  logger.level = 'DEBUG'
  process.env.NODE_ENV = 'development'
}
logger.info(`process.env.NODE_ENV = ${process.env.NODE_ENV}`)

export default logger
