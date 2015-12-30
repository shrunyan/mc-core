'use strict'

// DEPRECATED
// -- BELOW LEFT FOR REFERENCE --

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()
let extensionRegistry = require('../../extensions/registry')
let Stage = require('./stage').Stage
let pipelineEvent = require('../../queues/pipeline/events')

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

    this.currentStageNumber = 0

    this.loadPipelineExecution()
      .then(this.markPipelineExecutionAsRunning.bind(this))
      .then(this.executeStages.bind(this))
      .then(this.markPipelineAsComplete.bind(this))
      .then(
        // Mark the queue job as complete,
        // and move onto the next pipeline
        callback()
      )

  }

  /**
   * Load the pipeline execution data
   *
   * @returns {Promise}
   */
  loadPipelineExecution() {
    return connection('pipeline_executions')
      .where('id', this.executionId)
      .first()
      .catch(err => logger.error(err))
      .then(execution => {
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
      })
      .catch(err => logger.error(err))
      .then(() => pipelineEvent('update'))
  }

  /**
   * Executes the stages of the pipeline
   *
   * @returns {Promise}
   */
  executeStages() {
    return new Promise(resolve => {
      // Clone the stages, so we can pick them off one at a time
      this.stagesRemaining = this.config.stageConfigs.slice(0)
      this.runNextStage(resolve)
    })

  }

  runNextStage(callback) {

    if (this.stagesRemaining.length > 0) {
      let stageConfig = this.stagesRemaining.shift()

      this.currentStageNumber++

      if (this.anyStageHasFailed) {

        // TODO: allow for option to "run step even if a previous step has failed"
        this.createStageAsSkipped(stageConfig.id, () => {
          this.runNextStage(callback)
        })
      } else {

        this.createStageAsStarted(stageConfig.id, (stageExecutionId) => {
          this.executeStage(stageConfig, stageExecutionId, () => {
            this.runNextStage(callback)
          })
        })

      }
    } else {
      callback()
    }
  }

  executeStage(stageConfig, stageExecutionId, onComplete) {

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
    let stage = new Stage(successCallback, failureCallback, stageConfig, this.executionId, stageExecutionId, this.currentStageNumber)

    // stage.type == 'mc.basics.stages.pause_execution_for_x_seconds'
    let stageType = extensionRegistry.get(stageConfig.type)

    if (!stageType) {
      stage.log('Stage type: ' + stageConfig.type + ' not found.')
      stage.fail()
    } else {
      try {
        stageType.execute(stage)
      } catch (err) {
        logger.error(err)
        stage.fail()
      }
    }

  }

  /**
   * Record that a stage was started
   *
   * @param stageConfigId
   * @param callback
   */
  createStageAsStarted(stageConfigId, callback) {
    connection('pipeline_stage_executions')
      .insert({
        pipeline_execution_id: this.executionId,
        stage_config_id: stageConfigId,
        stage_num: this.currentStageNumber,
        status: 'running',
        created_at: new Date(),
        updated_at: new Date(),
        started_at: new Date()
      }).catch(err => {
        logger.error(err)
      }).then(callback)
  }

  /**
   * Record that a stage was skipped
   *
   * @param stageConfigId
   * @param callback
   */
  createStageAsSkipped(stageConfigId, callback) {
    connection('pipeline_stage_executions')
      .insert({
        pipeline_execution_id: this.executionId,
        stage_config_id: stageConfigId,
        stage_num: this.currentStageNumber,
        status: 'skipped',
        created_at: new Date(),
        updated_at: new Date(),
        skipped_at: new Date()
      })
      .catch(err => logger.error(err))
      .then(() => pipelineEvent('update'))
      .then(callback)
  }

  /**
   * Mark the pipeline execution as complete
   */
  markPipelineAsComplete() {
    let status = (this.anyStageHasFailed) ? 'failed' : 'succeeded'

    connection('pipeline_executions')
      .where('id', this.executionId)
      .update({
        status: status,
        finished_at: new Date(),
        updated_at: new Date()
      })
      .catch(err => logger.error(err))
      .then(() => pipelineEvent('update'))
  }

}

module.exports = PipelineExecutor
