'use strict'

let logger = require('tracer').colorConsole()
let RedisSMQ = require('rsmq')
let rsmq = new RedisSMQ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  ns: 'mission_control'
})

/**
 * Queue factory
 * @return {Function} Function to get queue instance
 */
module.exports = (function() {
  return function Queue(name) {
    if (!name) throw new Error('Must provide queue name')

    const QUEUE_MSG = name + ' | '
    const QUEUE_SETTINGS = {
      qname: name
    }

    rsmq.createQueue(QUEUE_SETTINGS, (err, resp) => {
      if (err) {
        // Ignore queueExists errors
        if (err.name !== 'queueExists') {
          throw err
        } else {
          logger.log(QUEUE_MSG + 'EXISTS')
        }
      } else if (resp === 1) {
        logger.log(QUEUE_MSG + 'CREATED')
      }
    })

    rsmq.receiveMessage(QUEUE_SETTINGS, (err, resp) => {
      if (err) {
        logger.error(err)
      } else if (resp.id) {
        logger.log(QUEUE_MSG + 'MESSAGE |' + resp)
      } else {
        logger.log(QUEUE_MSG + 'EMPTY')
      }
    })

    return rsmq
  }
}())
