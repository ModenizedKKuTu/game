import { db } from 'lib'
import config from '../config'

const dbConfig = config.db

const dbManager = db(dbConfig)

export default dbManager
