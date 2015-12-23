'use strict'

let worker = require('./worker')('pipeline_executions')
let msgHandler = require('../queues/pipeline/message')

worker.on('message', msgHandler)

worker.start()
