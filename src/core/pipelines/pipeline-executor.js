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

      this.runNextStage(() => {
        resolve()
      })
    })

  }

  runNextStage(callback) {

    // TODO: emit event for pipeline_execution update

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
    let stage = new Stage(successCallback, failureCallback, stageConfig) // TODO: pass state

    logger.debug('available types')
    logger.debug(extensionRegistry._extensions)

    // stage.type == 'mc.basics.stages.pause_execution_for_x_seconds'
    console.log('attempting to load ' + stageConfig.type + ' from registry')
    let stageType = extensionRegistry.get(stageConfig.type)

    console.log('stageType returned value = ', stageType)

    if (!stageType) {
      stage.log('Stage type: ' + stageConfig.type + ' not found.')
      stage.fail()
    } else {
      try {
        stageType.execute(stage)
      } catch (err) {
        stage.fail()
      }
    }

    //let fakeStageType = {
    //  execute: function(stage) {
    //
    //    stage.log('Starting pause for 2 seconds')
    //
    //    setTimeout(() => {
    //      stage.log('Completed pause for 2 seconds')
    //      stage.succeed()
    //    }, 2000)
    //  }
    //}
    //
    //try {
    //  fakeStageType.execute(stage)
    //} catch (err) {
    //  stage.fail()
    //}
    //
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
        status: 'skipped',
        created_at: new Date(),
        updated_at: new Date(),
        skipped_at: new Date()
      }).catch(err => {
        logger.error(err)
      }).then(callback)
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
      .then(() => {
        // TODO: emit event for pipeline_execution update
      })

  }

}

module.exports = PipelineExecutor
