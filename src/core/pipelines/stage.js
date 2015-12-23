'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()
let registry = require('../../extensions/registry')

module.exports.Stage = class Stage {

  /**
   *
   */
  constructor(successCallback, failureCallback, stageConfig, pipelineExecutionId, stageExecutionId, stageNum) {
    this.successCallback = successCallback
    this.failureCallback = failureCallback
    this.stageConfig = stageConfig
    this.stageConfig.options = JSON.parse(this.stageConfig.options)
    this.pipelineExecutionId = pipelineExecutionId
    this.stageExecutionId = stageExecutionId
    this.stageNum = stageNum
  }

  /**
   * Mark a stage as failed
   */
  fail() {
    this.failureCallback()
  }

  /**
   * Mark a stage as successful
   */
  succeed() {
    this.successCallback()
  }

  /**
   * Get an option that the user configured for this stage instance
   */
  option(key) {
    return this.stageConfig.options[key]
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
      pipeline_execution_id: this.pipelineExecutionId,
      stage_execution_id: this.stageExecutionId,
      stage_num: this.stageNum,
      logged_at: new Date(),
      type: log.type || null,
      title: log.title,
      data: log.data ? JSON.stringify(log.data) : null
    }

    connection.insert(data).into('pipeline_execution_logs').catch((err) => {
      logger.error(err)
    })
  }

}
