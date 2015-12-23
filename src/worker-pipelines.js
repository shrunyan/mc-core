'use strict'

let RSMQWorker = require('rsmq-worker')
let dotenv = require('dotenv').load()
let logger = require('tracer').colorConsole()
let jobHandler = require('./queueing/job-handlers/pipeline-execution-handler')
let worker = new RSMQWorker('pipeline_executions', {
  redisPrefix: 'mission_control',
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
})

logger.log('WORKER: Pipeline worker started')
worker.on('message', jobHandler)

// optional error listeners
worker.on('error', (err, msg) => logger.error('ERROR', err, msg))
worker.on('exceeded', msg => logger.error('EXCEEDED', msg))
worker.on('timeout', msg => logger.error('TIMEOUT', msg))

worker.start()
