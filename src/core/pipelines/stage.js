'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()

module.exports.Stage = class Stage {

  /**
   *
   */
  constructor(successCallback, failureCallback) {
    this.successCallback = successCallback
    this.failureCallback = failureCallback
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
  option() {
    // TODO: implement
  }

  /**
   * Add a new log
   *
   * @param {string|class|object} log
   */
  log(log) {

    // If a string is passed, format it as an object
    if (typeof log === 'string') {
      log = {
        title: log
      }
    }

    let data = {
      pipeline_execution_id: null, // TODO
      stage_execution_id: null, // TODO
      type: log.type || null,
      title: log.title,
      data: log.data ? JSON.stringify(log.data) : null
    }

    connection.insert(data).into('pipeline_execution_logs').catch((err) => {
      logger.error(err)
    })
  }

}