'use strict'

let RedisSMQ = require('rsmq')
let rsmq = new RedisSMQ({host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, ns: 'mission_control'})

rsmq.createQueue({qname: 'pipeline_executions'}, function (err, resp) {

  // Queue is successfully created if resp === 1

  // If there is an error, handle it
  if (err) {
    switch (err.name) {

      case 'queueExists':
        // If the queue already exists, that's fine, ignore the error
        break

      default:
        throw err

    }
  }

})

module.exports = rsmq
