import cluster from 'cluster'
import config from './config'
import logger from './logger'

import master from './master'

const ServerID = 0
const WorkerNum = 2

interface IWorkerForkEnv {
  workerID: number
}

if (cluster.isMaster) {
  const workers: cluster.Worker[] = []

  for (let i = 0; i < WorkerNum; i++) {
    workers[i] = cluster.fork({
      workerID: i
    } as IWorkerForkEnv)
  }

  cluster.on('exit', (deadWorker) => {
    workers.forEach((worker, idx, _arr) => {
      if (worker === deadWorker) {
        workers[idx] = cluster.fork({
          workerID: idx
        } as IWorkerForkEnv)
        logger.info(`Worker @${idx}(PID ${deadWorker.process.pid}) is dead`)
      }
    })
  })

  logger.info('Master is started!')

  master(config.server.port)
} else {
  const WorkerID = parseInt(process.env.workerID!)

  logger.info(`Worker @${WorkerID}(PID ${process.pid}) is started!`)
}
