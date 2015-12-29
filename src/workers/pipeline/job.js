'use strict'

const RUNNING = 'running'
const FAILED = 'failed'
const SUCCEEDED = 'succeeded'
const PIPELINE_TABLE = 'pipeline_executions'
const STAGE_TABLE = 'pipeline_stage_executions'

let logger = require('tracer').colorConsole()
let connection = require('../../db/connection')
// let pipelineEvent = require('../../queues/pipeline/events')
let Stage = require('../../core/pipelines/stage')
let registry = require('../../extensions/registry')
let status = require('../status')

module.exports = class Job {
  constructor(msg, next) {
    this.failure = false
    this.pipeline = {}
    this.stages = []

    // Start this party
    this.load(msg.id)
      .then(status(msg.id, RUNNING, PIPELINE_TABLE))
      .then(() => {

        // For each stage configuration make a
        // execution record which is captured as a
        // promise returned by the connection object
        this.pipeline.stageConfigs.forEach((stage, index) => {
          this.stages.push({
            msg,
            stage,
            index,
            exec: this.createStageExec(msg, stage, index, 'created')
          })
        })

        // Resolve once all connections are complete
        return Promise.all(this.stages.map(stage => stage.exec))
      })
      .then(() => {
        // Run all stage executions
        this.stages.forEach(stage => {
          stage.exec
            .then(id => this.execute.bind(this, stage, id))
            .catch(err => logger.error(err))
        })
      })
      .then(() => {
        // Update pipeline status
        let pipelineStatus = this.failure ? FAILED : SUCCEEDED
        status(msg.id, pipelineStatus, PIPELINE_TABLE)
      })
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

  createStageExec(msg, config, index, status) {
    return connection
      .table(STAGE_TABLE)
      .insert({
        pipeline_execution_id: msg.id,
        stage_config_id: config.id,
        stage_num: index,
        status: status,
        created_at: new Date(),
        updated_at: new Date(),
        skipped_at: new Date()
      })
      .catch(err => logger.error(err))
  }

  execute(data, id) {
    console.log('execute error', this, data, id)

    if (this.failure) {
      logger.error('Previous failure')
      // TODO skip execution
    }

    let stageId = id[0]
    // let success = () => status(stageId, SUCCEEDED, STAGE_TABLE)
    // let fail = () => status(stageId, FAILED, STAGE_TABLE)
    let ext = registry.get(data.stage.type)
    let stage = new Stage({
      // success: success,
      // failure: fail,
      config: data.stage,
      pipelineId: data.msg.id,
      stageId: stageId,
      index: data.index
    })

    try {
      ext.execute(stage)
    } catch (err) {
      this.failure = true
      logger.error(err)
      stage.fail()
    }
  }

  skip() {
    return connection
  }

}
