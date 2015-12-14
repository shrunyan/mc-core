'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()
let extensionRegistry = require('../../extensions/registry')
let Stage = require('./stage').Stage

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

    // Assume no stage has failed until we find out otherwise
    this.anyStageHasFailed = false

    this.loadPipelineExecution()
      .then(this.markPipelineExecutionAsRunning.bind(this))
      .then(this.executeStages.bind(this))
      .then(this.markPipelineAsComplete.bind(this))
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
      logger.debug('stagesRemaining')
      logger.debug(this.stagesRemaining)

      this.runNextStage(() => {
        resolve()
      })
    })

  }

  runNextStage(callback) {
    logger.debug('runNextStage running')

    if (this.stagesRemaining.length > 0) {
      let stageConfig = this.stagesRemaining.shift()

      if (this.anyStageHasFailed) {

        // TODO: allow for option to "run step even if a previous step has failed"
        this.createStageAsSkipped(stageConfig.id, () => {
          this.runNextStage(callback)
        })
      } else {

        this.createStageAsStarted(stageConfig.id, () => {
          this.executeStage(stageConfig, () => {
            this.runNextStage(callback)
          })
        })

      }
    } else {
      callback()
    }
  }

  executeStage(stageConfig, onComplete) {

    let successCallback = () => {
      connection('pipeline_stage_executions')
        .where('pipeline_execution_id', this.executionId)
        .where('stage_config_id', stageConfig.id)
        .update({
          status: 'succeeded',
          finished_at: new Date(),
          updated_at: new Date()
        })
        .then(() => {
        onComplete()
      })
    }

    let failureCallback = () => {

      this.anyStageHasFailed = true

      connection('pipeline_stage_executions')
        .where('pipeline_execution_id', this.executionId)
        .where('stage_config_id', stageConfig.id)
        .update({
          status: 'failed',
          finished_at: new Date(),
          updated_at: new Date()
        })
        .then(() => {
          onComplete()
        })

      onComplete()
    }

    // state we pass must contain, stage options, pipeline variables, etc
    let stage = new Stage(successCallback, failureCallback) // TODO: pass state

    // stage.type == 'mc.basics.stages.pause_execution_for_x_seconds'
    //extensionRegistry.getStageType(stageConfig.type).execute(stage)

    let fakeStageType = {
      execute: function(stage) {

        stage.log('Starting pause for 2 seconds')

        setTimeout(() => {
          stage.log('Completed pause for 2 seconds')
          stage.succeed()
        }, 2000)
      }
    }

    try {
      fakeStageType.execute(stage)
    } catch (err) {
      stage.fail()
    }

  }

  createStageAsStarted(stageConfigId, callback) {
    connection('pipeline_stage_executions')
      .insert({
        pipeline_execution_id: this.executionId,
        stage_config_id: stageConfigId,
        status: 'running',
        created_at: new Date(),
        updated_at: new Date(),
        started_at: new Date()
      }).catch(err => {
        logger.error(err)
      }).then(callback)
  }

  createStageAsSkipped(stageConfigId, callback) {
    connection('pipeline_stage_executions')
      .insert({
        pipeline_execution_id: this.executionId,
        stage_config_id: stageConfigId,
        status: 'skipped',
        created_at: new Date(),
        updated_at: new Date(),
        skipped_at: new Date()
      }).catch(err => {
        logger.error(err)
      }).then(callback)
  }

  markPipelineAsComplete() {

    let statusUpdateAction

    if (this.anyStageHasFailed) {
      statusUpdateAction = this.markPipelineAsFailed()
    } else {
      statusUpdateAction = this.markPipelineAsSuccessful()
    }

    statusUpdateAction.then(() => {

      // TODO: emit event for pipeline_execution update

    })

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
      }).catch(err => logger.error(err))
  }

  /**
   * Mark the pipeline_execution as successful
   *
   * @returns {Promise}
   */
  markPipelineAsFailed() {
    return connection('pipeline_executions')
      .where('id', this.executionId)
      .update({
        status: 'failed',
        finished_at: new Date(),
        updated_at: new Date()
      }).catch(err => logger.error(err))
  }

}

module.exports = PipelineExecutor