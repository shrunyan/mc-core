'use strict'

let logger = require('tracer').colorConsole()
// let connection = require('../db/connection')
// let registry = require('../extensions/registry')
// let Stage = require('../core/pipelines/stage').Stage
// let pipelineEvent = require('./pipeline/events')

module.exports = class Job {
  constructor(opts) {
    this.opts = opts
    // this.execId = execId
    // this.next = next
    // this.table = 'pipeline_executions'

    this.failure = false
    this.currentStage = 0

  }

  run() {}

  status(status) {

  }
}



/**
 * @prop {int|string} executionId
 * @prop {object} execution
 * @prop {object} config
 * @prop {object} config.pipeline
 * @prop {array}  config.stages
 */
// class PipelineExecutor {

//   /**
//    * Set up and fulfill a pipeline execution
//    *
//    * @param {int|string} pipelineExecutionId
//    * @param {function} callback A callback to be called when the execution process is complete
//    */
//   constructor(execId, next) {
//     logger.debug('Running Execution: ', execId)

//     this.executionId = execId
//     this.anyStageHasFailed = false
//     this.currentStageNumber = 0

//     this.load()
//       .then(this.markAsRunning.bind(this))
//       .then(this.executeStages.bind(this))
//       .then(this.markAsCompleted.bind(this))
//       .then(next)
//   }

//   /**
//    * Load the pipeline execution data
//    *
//    * @returns {Promise}
//    */
//   // load() {
//   //   return connection('pipeline_executions')
//   //     .where('id', this.executionId)
//   //     .first()
//   //     .then(execution => {
//   //       this.execution = execution
//   //       this.config = JSON.parse(execution.config_snapshot)
//   //     })
//   //     .catch(err => logger.error(err))
//   // }

//   updatePipeline(data) {
//     return connection('pipeline_executions')
//       .where('id', this.executionId)
//       .update(data)
//       .then(() => pipelineEvent('update'))
//       .catch(err => logger.error(err))
//   }

//   updateStage(stageId, data, callback) {
//     return connection('pipeline_stage_executions')
//       .where('pipeline_execution_id', this.executionId)
//       .where('stage_config_id', stageId)
//       .update(data)
//       .then(callback)
//   }

//   insertStage(execId, stageId, data, callback) {
//     return connection('pipeline_stage_executions')
//       .where('pipeline_execution_id', execId)
//       .where('stage_config_id', stageId)
//       .insert(data)
//       .then(callback)
//   }

//   /**
//    * Mark the pipeline execution as running
//    *
//    * @returns {Promise}
//    */
//   markAsRunning() {
//     return this.updatePipeline({
//       status: 'running',
//       started_at: new Date(),
//       updated_at: new Date()
//     })
//   }

//   /**
//    * Executes the stages of the pipeline
//    *
//    * @returns {Promise}
//    */
//   executeStages() {
//     return new Promise(resolve => {
//       // Clone the stages, so we can pick them off one at a time
//       this.stagesRemaining = this.config.stageConfigs.slice(0)
//       this.runNextStage(resolve)
//     })

//   }

//   runNextStage(callback) {
//     if (this.stagesRemaining.length > 0) {
//       let stageConfig = this.stagesRemaining.shift()

//       this.currentStageNumber++

//       if (this.anyStageHasFailed) {
//         // TODO: allow for option to "run step even if a previous step has failed"
//         this.createStageAsSkipped(stageConfig.id, () => {
//           this.runNextStage(callback)
//         })
//       } else {
//         this.createStageAsStarted(stageConfig.id, (stageExecutionId) => {
//           this.executeStage(stageConfig, stageExecutionId, () => {
//             this.runNextStage(callback)
//           })
//         })
//       }
//     } else {
//       callback()
//     }
//   }

//   executeStage(stageConfig, stageExecutionId, onComplete) {
//     let successCallback = () => {
//       this.updateStage(stageConfig.id, {
//         status: 'succeeded',
//         finished_at: new Date(),
//         updated_at: new Date()
//       }, onComplete)
//     }
//     let failureCallback = () => {
//       this.anyStageHasFailed = true
//       this.updateStage(stageConfig.id, {
//         status: 'failed',
//         finished_at: new Date(),
//         updated_at: new Date()
//       }, onComplete)
//     }

//     // state we pass must contain, stage options, pipeline variables, etc
//     let stage = new Stage(
//       successCallback,
//       failureCallback,
//       stageConfig,
//       this.executionId,
//       stageExecutionId,
//       this.currentStageNumber)

//     // stage.type == 'mc.basics.stages.pause_execution_for_x_seconds'
//     let stageType = registry.get(stageConfig.type)

//     if (!stageType) {
//       stage.log('Stage type: ' + stageConfig.type + ' not found.')
//       stage.fail()
//     } else {
//       try {
//         stageType.execute(stage)
//       } catch (err) {
//         logger.error(err)
//         stage.fail()
//       }
//     }

//   }

//   /**
//    * Record that a stage was started
//    *
//    * @param stageConfigId
//    * @param callback
//    */
//   createStageAsStarted(stageConfigId, callback) {
//     connection('pipeline_stage_executions')
//       .insert({
//         pipeline_execution_id: this.executionId,
//         stage_config_id: stageConfigId,
//         stage_num: this.currentStageNumber,
//         status: 'running',
//         created_at: new Date(),
//         updated_at: new Date(),
//         started_at: new Date()
//       })
//       .then(callback)
//       .catch(err => logger.error(err))
//   }

//   /**
//    * Record that a stage was skipped
//    *
//    * @param stageConfigId
//    * @param callback
//    */
//   createStageAsSkipped(stageConfigId, callback) {
//     connection('pipeline_stage_executions')
//       .insert({
//         pipeline_execution_id: this.executionId,
//         stage_config_id: stageConfigId,
//         stage_num: this.currentStageNumber,
//         status: 'skipped',
//         created_at: new Date(),
//         updated_at: new Date(),
//         skipped_at: new Date()
//       })
//       .catch(err => logger.error(err))
//       .then(() => pipelineEvent('update'))
//       .then(callback)
//   }

//   /**
//    * Mark the pipeline execution as complete
//    */
//   markAsCompleted() {
//     let status = (this.anyStageHasFailed)
//       ? 'failed'
//       : 'succeeded'

//     return this.updatePipeline({
//       status: status,
//       finished_at: new Date(),
//       updated_at: new Date()
//     })
//   }

// }

// // module.exports = PipelineExecutor
