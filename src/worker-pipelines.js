'use strict'

let RSMQWorker = require('rsmq-worker')
let dotenv = require('dotenv')
let logger = require('tracer').colorConsole()

dotenv.load()

let worker = new RSMQWorker('pipeline_executions', {
  redisPrefix: 'mission_control',
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
})

worker.on('message', function (msg, next, msgid) {

  // process your message
  logger.debug('message received. ID: ' + msgid)
  logger.debug(msg)
  next()

})

// optional error listeners
worker.on('error', function (err, msg) {

  logger.error('ERROR', err, msg.id)

})

worker.on('exceeded', function (msg) {

  logger.error('EXCEEDED', msg.id)

})

worker.on('timeout', function (msg) {

  logger.error('TIMEOUT', msg.id, msg.rc)

})

worker.start()
