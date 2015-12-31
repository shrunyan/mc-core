'use strict'

const PIPELINE_TABLE = 'pipeline_executions'

let logger = require('tracer').colorConsole()
let connection = require('../../db/connection')
let status = require('../../workers/status')
let pipelineEvent = require('../../queues/pipeline/events')
let extensionRegistry = require('../../extensions/registry')

/**
 * Pipeline Instance
 * @type {Object}
 */
module.exports = class Pipeline {
  constructor(id) {
    this.id = id
    this.completed = false
  }

  load() {
    console.log('pipeline:load')

    return new Promise((resolveLoad) => {
      console.log('pipeline:load:executing promise')
      connection
        .table(PIPELINE_TABLE)
        .where('id', this.id)
        .first()
        .then(exec => {
          console.log('pipeline:load:resolved', this)
          logger.debug('Pipeline > load() > exec record: ')
          //logger.debug(exec)
          this.config = JSON.parse(exec.config_snapshot)
          //logger.debug(this.config)
          this.input = JSON.parse(exec.input)

          resolveLoad()
        })
        .catch(err => logger.error(err))
    })
  }

  running() {
    let id = this.id
    logger.debug('Pipeline RUNNING', id)

    return new Promise(resolve => {
      status(id, 'running', PIPELINE_TABLE)
        .then(() => {
          pipelineEvent('update')
          resolve()
        })
    })
  }

  /**
   * Mark the pipeline execution as failed
   */
  fail() {
    return this.complete(true)
  }

  /**
   * Mark the pipeline execution as successful
   */
  succeed() {
    return this.complete()
  }

  /**
   * Mark the pipeline execution as complete
   *
   * @param {boolean} [failed]
   * @returns {Promise}
   */
  complete(failed) {

    let statusValue = failed ? 'failed' : 'succeeded'

    if (this.completed) {
      logger.error('complete() called on pipeline but it is already complete')
    }

    // Otherwise, mark it as completed locally, and then in the database
    this.completed = true

    let id = this.id
    logger.debug('Pipeline COMPLETE (' + statusValue.toUpperCase() + ')', id)

    return new Promise(resolve => {
      status(id, statusValue, PIPELINE_TABLE)
        .then(() => {
          pipelineEvent('update')
          resolve()
        })
    })
  }

  /**
   * Add a basic log
   *
   * @returns {Promise}
   */
  log() {

    let log

    if (arguments.length === 1) {
      if (typeof arguments[0] === 'string') {
        log = {
          title: arguments[0]
        }
      } else {
        throw new Error('Argument 1 must be a string')
      }
    } else if (arguments.length >= 2 && arguments.length <= 3) {

      let logType = extensionRegistry.get(arguments[0])
      let args = (Array.isArray(arguments[2])) ? arguments[2] : []

      log = {
        type: arguments[0],
        title: arguments[1],
        data: logType.generate.apply(this, args)
      }
    } else {
      throw new Error('Wrong number of arguments')
    }

    let data = {
      pipeline_execution_id: this.id,
      logged_at: new Date(),
      type: log.type || null,
      title: log.title,
      data: log.data ? JSON.stringify(log.data) : null
    }

    return connection
      .table('pipeline_execution_logs')
      .insert(data)
      .catch(err => logger.error(err))

  }

}
