'use strict'

require('dotenv').load()

let logger = require('tracer').colorConsole()
let RSMQWorker = require('rsmq-worker')

/**
 * Worker factory
 * @return {function} Function to get worker instance
 */
module.exports = (function() {
  return function(name) {
    let worker = new RSMQWorker(name, {
      timeout: 0,
      redisPrefix: 'mission_control',
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    })

    const WORKER_MSG = name + ' | '

    worker.on('ready', () => logger.debug(WORKER_MSG + 'READY'))
    worker.on('deleted', id => logger.debug(WORKER_MSG + 'DELETED: ', id))
    worker.on('exceeded', msg => logger.error(WORKER_MSG + 'EXCEEDED', msg))
    worker.on('timeout', msg => logger.error(WORKER_MSG + 'TIMEOUT', msg))
    worker.on('error', (err, msg) => {
      logger.error(WORKER_MSG + 'ERROR', err, msg)
      if (err.stack) {
        logger.error(err.stack)
      }
    })

    return worker
  }
}())
