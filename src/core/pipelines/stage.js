'use strict'

const FAILED = 'failed'
const SUCCEEDED = 'succeeded'
const RUNNING = 'running'
const STAGE_TABLE = 'pipeline_stage_executions'
const PIPELINE_LOGS_TABLE = 'pipeline_execution_logs'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()
let registry = require('../../extensions/registry')
let status = require('../../workers/status')

/**
 * Stage Instance
 * @type {Object}
 */
module.exports = class Stage {
  constructor(index, config, msg) {
    this.events = {}
    this.stageNum = index
    this.pipeline = msg
    this.config = config
    this.opts = JSON.parse(config.options)
    this.hasFailed = false
    this.exec = this.createExec('created')
  }

  on(name, handler) {
    if (typeof handler === 'function') {
      this.events[name] = handler
    } else {
      throw new Error('Can not register a non function as event handler.')
    }
  }

  trigger(name) {
    if (this.events[name]) {
      this.events[name]()
    }
  }

  fail(err) {
    logger.debug('Stage FAILED | ', JSON.stringify(err))
    status(this.stageId, FAILED, STAGE_TABLE)
    this.trigger(FAILED)
  }

  succeed() {
    logger.debug('Stage SUCCESS')
    status(this.stageId, SUCCEEDED, STAGE_TABLE)
    this.trigger(SUCCEEDED)
  }

  running() {
    logger.debug('Stage RUNNING')
    status(this.stageId, RUNNING, STAGE_TABLE)
    this.trigger(RUNNING)
  }

  option(key) {
    return this.opts[key]
  }

  options() {
    return this.opts
  }

  //output(data) {
  //
  //}

  createExec(status) {
    return connection
      .table(STAGE_TABLE)
      .insert({
        pipeline_execution_id: this.pipeline.id,
        stage_config_id: this.config.id,
        stage_num: this.stageNum,
        status: status,
        created_at: new Date(),
        updated_at: new Date(),
        skipped_at: new Date()
      })
      .then(id => this.stageId = id[0])
      .catch(err => logger.error(err))
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
      pipeline_execution_id: this.pipeline.id,
      stage_execution_id: this.stageId,
      stage_num: this.stageNum,
      logged_at: new Date(),
      type: log.type || null,
      title: log.title,
      data: log.data ? JSON.stringify(log.data) : null
    }

    return connection
      .table(PIPELINE_LOGS_TABLE)
      .insert(data)
      .catch(err => logger.error(err))
  }
}
