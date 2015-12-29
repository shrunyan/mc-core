'use strict'

const RUNNING = 'running'
const FAILED = 'failed'
const SUCCEEDED = 'succeeded'
const PIPELINE_TABLE = 'pipeline_executions'
// const STAGE_TABLE = 'pipeline_stage_executions'

let logger = require('tracer').colorConsole()
let connection = require('../../db/connection')
let pipelineEvent = require('../../queues/pipeline/events')
let Stage = require('../../core/pipelines/stage')
let registry = require('../../extensions/registry')
let status = require('../status')

module.exports = class Job {
  constructor(msg, next) {
    this.hasFailed = false
    this.pipeline = {}
    this.stages = []

    // Start this party
    this.load(msg.id)
      .then(status(msg.id, RUNNING, PIPELINE_TABLE))
      .then(pipelineEvent('update'))
      .then(() => {
        // Create stage instance for each configuration
        this.pipeline.stageConfigs.forEach((config, index) => {
          this.stages.push(new Stage(index, config, msg))
        })

        // Resolve once all instances have an execution record
        return Promise.all(this.stages.map(stage => stage.exec))
      })
      .then(() => {
        // Map over stage instances and create an execution
        return Promise.all(this.stages.map(stage => {
          return this.execute(stage, this.hasFailed)
        }))

        // this.stages.forEach(stage => {
        //   this.execute(stage, hasFailed)
        // })

      })
      .then(status(msg.id, (this.hasFailed ? FAILED : SUCCEEDED), PIPELINE_TABLE))
      .then(pipelineEvent('update'))
      .then(next)
      .catch(err => logger.error(err))
  }

  load(id) {
    return connection
      .table(PIPELINE_TABLE)
      .where('id', id)
      .first()
      .then(exec => this.pipeline = JSON.parse(exec.config_snapshot))
      .catch(err => logger.error(err))
  }

  execute(stage, hasFailed) {
    console.log('execute', hasFailed, stage)

    if (hasFailed) {
      logger.error('Previous hasFailed')
      // TODO skip execution
    }

    return new Promise((resolve, reject) => {
      let extension = registry.get(stage.config.type)

      stage.on(FAILED, () => {
        hasFailed = true
        // TODO: Should we be rejecting?
        // won't this fail fast the rest of the executions
        // preventing them from running?
        // reject()
      })
      stage.on(SUCCEEDED, resolve)

      extension.execute(stage)
    })
  }

  // skip() {
  //   return connection
  // }

}
