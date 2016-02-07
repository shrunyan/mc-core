'use strict'

const FAILED = 'failed'
const SUCCEEDED = 'succeeded'
const RUNNING = 'running'
const SKIPPED = 'skipped'
const STAGE_TABLE = 'pipeline_stage_executions'
const PIPELINE_LOGS_TABLE = 'pipeline_execution_logs'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()
let registry = require('../../extensions/registry')
let status = require('../../workers/status')

function createExec(pipelineId, configId, stageNum, callback) {
  return connection
    .insert({
      pipeline_execution_id: pipelineId,
      stage_config_id: configId,
      stage_num: stageNum,
      status: 'running',
      created_at: new Date(),
      updated_at: new Date(),
      skipped_at: new Date()
    })
    .into(STAGE_TABLE)
    .then((rows) => {
      callback(rows[0])
    })
    //.catch(err => logger.error(err))
}

/**
 * Stage Instance
 * @type {Object}
 */
module.exports = class Stage {
  constructor(stageNum, config, pipeline, tokenResolver, onReady) {
    this.events = {}
    this.stageNum = stageNum
    this.pipeline = pipeline
    this.config = config
    this._output = {}
    this.opts = JSON.parse(config.options)
    tokenResolver.processEach(this.opts)
    this.hasFailed = false
    this.exec = createExec(this.pipeline.id, this.config.id, this.stageNum, (id) => {
      this.stageId = id
      onReady()
    })
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
    logger.debug('about to call status() with args: [this.stageId, FAILED, STAGE_TABLE]')
    logger.debug([this.stageId, FAILED, STAGE_TABLE])
    status(this.stageId, FAILED, STAGE_TABLE)
    this.trigger(FAILED)
  }

  succeed() {
    logger.debug('Stage SUCCESS')
    status(this.stageId, SUCCEEDED, STAGE_TABLE)
    this.trigger(SUCCEEDED)
  }

  skip() {
    logger.debug('Stage SKIPPED')
    status(this.stageId, SKIPPED, STAGE_TABLE)
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

  output(data) {
    for (let key in data) {
      this._output[key] = data[key]
    }
  }

  /**
   * To capture the output after the stage execution. (not intended for end user)
   */
  getOutput() {
    return this._output
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
