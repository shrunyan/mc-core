'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()
let registry = require('../../extensions/registry')
let status = require('../../workers/pipeline/status')

module.exports = class Stage {

  /**
   *
   */
  constructor(opts) {
    this.opts = opts
    this.stageOptions = JSON.parse(opts.config.options)
  }

  /**
   * Mark a stage as failed
   */
  fail() {
    this.opts.failure()
  }

  /**
   * Mark a stage as successful
   */
  succeed() {
    this.opts.success()
  }

  /**
   * Get an option that the user configured for this stage instance
   */
  option(key) {
    return this.stageOptions[key]
  }

  options() {
    return this.stageOptions
  }

  /**
   * Add a new log
   *
   * Usage Syntax 1:
   * stage.log('This is a log title')
   *
   * Usage Syntax 2:
   * stage.log('mc.basics.logs.snippet', title, args)
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

      let logType = registry.get(arguments[0])
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
      pipeline_execution_id: this.opts.pipelineId,
      stage_execution_id: this.opts.stageId,
      stage_num: this.opts.index,
      logged_at: new Date(),
      type: log.type || null,
      title: log.title,
      data: log.data ? JSON.stringify(log.data) : null
    }

    connection
      .table('pipeline_execution_logs')
      .insert(data)
      .catch(err => logger.error(err))
  }

}
