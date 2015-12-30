'use strict'

const RUNNING = 'running'
const FAILED = 'failed'
const SUCCEEDED = 'succeeded'
const PIPELINE_TABLE = 'pipeline_executions'

let logger = require('tracer').colorConsole()
let connection = require('../../db/connection')
let status = require('../../workers/status')
let pipelineEvent = require('../../queues/pipeline/events')

/**
 * Pipeline Instance
 * @type {Object}
 */
module.exports = class Pipeline {
  constructor(id) {
    this.id = id
    this.hasFailed = false
    this.exec = this.load()
  }

  load() {
    return connection
      .table(PIPELINE_TABLE)
      .where('id', this.id)
      .first()
      .then(exec => {
        this.config = JSON.parse(exec.config_snapshot)
      })
      .catch(err => logger.error(err))
  }

  running() {
    let id = this.id
    logger.debug('Pipeline RUNNING', id)

    return new Promise(resolve => {
      status(id, RUNNING, PIPELINE_TABLE)
        .then(() => {
          pipelineEvent('update')
          resolve()
        })
    })
  }

  complete() {
    let id = this.id
    logger.debug('Pipeline COMPLETE', id)

    return new Promise(resolve => {
      status(id, (this.hasFailed ? FAILED : SUCCEEDED), PIPELINE_TABLE)
        .then(() => {
          pipelineEvent('update')
          resolve()
        })
    })
  }

}
