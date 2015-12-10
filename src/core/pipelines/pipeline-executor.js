'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()

/**
 * @prop {int|string} executionId
 * @prop {object} execution
 * @prop {object} config
 * @prop {object} config.pipeline
 * @prop {array}  config.stages
 */
class PipelineExecutor {

  /**
   * Set up and fulfill a pipeline execution
   *
   * @param {int|string} pipelineExecutionId
   * @param {function} callback A callback to be called when the execution process is complete
   */
  constructor(pipelineExecutionId, callback) {

    this.executionId = pipelineExecutionId

    this.loadPipelineExecution()
      .then(this.markPipelineExecutionAsRunning.bind(this))
      .then(this.executeStages.bind(this))
      .then(this.markPipelineAsSuccessful.bind(this))
      .then(
        // Mark the queue job as complete, and move onto the next
        callback()
      )

  }

  /**
   * Load the pipeline execution data
   *
   * @returns {Promise}
   */
  loadPipelineExecution() {
    return connection.first()
      .where('id', this.executionId)
      .from('pipeline_executions')
      .catch(err => logger.error(err))
      .then((execution) => {
        this.execution = execution
        this.config = JSON.parse(execution.config_snapshot)
      })
  }

  /**
   * Mark the pipeline execution as running
   *
   * @returns {Promise}
   */
  markPipelineExecutionAsRunning() {
    return connection('pipeline_executions')
      .where('id', this.executionId)
      .update({
        status: 'running',
        started_at: new Date(),
        updated_at: new Date()
      }).catch(err => logger.error(err))
  }

  /**
   * Executes the stages of the pipeline
   *
   * @returns {Promise}
   */
  executeStages() {
    return new Promise(resolve => {

      // TODO: emit event for pipeline_execution update

      // Clone the stages, so we can pick them off one at a time
      this.stagesRemaining = this.config.stages.slice(0)

      this.runNextStage(() => {
        resolve()
      })
    })

  }

  runNextStage(callback) {
    if (this.stagesRemaining.length > 0) {
      let stage = arr.shift()
      this.executeStage(stage)
      this.markStageAsStarted(stage.id, () => {
        this.runNextStage(callback)
      })
    } else {
      callback()
    }
  }

  markStageAsStarted(stageId) {
    return connection('pipeline_stage_executions')
      .insert({
        pipeline_execution_id: this.executionId,
        stage_id: stageId,
        status: 'running',
        created_at: new Date(),
        updated_at: new Date(),
        started_at: new Date()
      }).catch(err => {
        logger.error(err)
      })
  }

  /**
   * @todo
   */
  markStageAsSuccessful() {
    //return connection('pipeline_stage_executions')
    //  .update({
    //    pipeline_execution_id: this.executionId,
    //    stage_id: stage.id,
    //    status: 'succeeded',
    //    created_at: new Date(),
    //    updated_at: new Date(),
    //    started_at: new Date(),
    //    finished_at: new Date()
    //  }).catch(err => {
    //  logger.error(err)
    //})
  }

  /**
   * Mark the pipeline_execution as successful
   *
   * @returns {Promise}
   */
  markPipelineAsSuccessful() {
    return connection('pipeline_executions')
      .where('id', this.executionId)
      .update({
        status: 'succeeded',
        finished_at: new Date(),
        updated_at: new Date()
      }).catch(err => logger.error(err)).then(() => {

        // TODO: emit event for pipeline_execution update

      })
  }

}

module.exports = PipelineExecutor