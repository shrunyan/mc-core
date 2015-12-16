'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()
let snapshotBuilder = require('./config-snapshot-builder')
let publishPipelineUpdate = require('../../queueing/publish-pipeline-update-event')

/**
 * Execute Pipeline Command - Creates a new pipeline execution, and queues it for processing.
 * This functionality is encapsulated here so it can be used by the API, a trigger, CLI, etc
 *
 * @param pipelineId
 * @param input
 * @param userId
 * @param callback
 */
module.exports = (pipelineId, input, userId, callback) => {

  let pipelineRsmq = require('../../queueing/pipeline-executions-queue')

  input = input || {}

  connection.first().where('id', pipelineId).from('pipeline_configs').then((pipelineConfig) => {

    // build pipeline configuration snapshot
    snapshotBuilder(pipelineId, (snapshot) => {

      let newExecutionData = {
        pipeline_config_id: pipelineId,
        pipeline_config_name: pipelineConfig.name,
        owner_id: userId,
        status: 'created',
        created_at: new Date(),
        updated_at: new Date(),
        initial_values: JSON.stringify(input), // TODO: rename or merge input with defaults
        config_snapshot: JSON.stringify(snapshot)
      }

      // Create pipeline execution entry in DB
      connection.insert(newExecutionData, 'id').into('pipeline_executions').then((id) => {

        let newExecutionId = id[0]

        callback(newExecutionId)

        // Publish a pipeline update event
        publishPipelineUpdate()

        // Send message to queue to handle new execution
        let message = JSON.stringify({
          pipeline_execution_id: newExecutionId
        })
        pipelineRsmq.sendMessage({qname: 'pipeline_executions', message: message}, function(err, resp) {

          if (resp) {
            console.log('Message sent. ID:', resp)
            // Mark new execution as queued (using the id captured above)
            connection('pipeline_executions')
              .where('id', newExecutionId)
              .update('status', 'queued').catch(err => {
                logger.error(err)
              })

            // Publish a pipeline update event
            publishPipelineUpdate()

          }

          if (err) {
            logger.error(err)
            throw err
          }

        })

      }).catch(err => {
        logger.error(err)
        throw err
      })

    })

  })

}
