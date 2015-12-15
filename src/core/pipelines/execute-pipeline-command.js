'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()
let snapshotBuilder = require('./config-snapshot-builder')

/**
 * Execute Pipeline Command - Creates a new pipeline execution, and queues it for processing.
 * This functionality is encapsulated here so it can be used by the API, a trigger, CLI, etc
 *
 * @param pipelineId
 * @param input
 * @param callback
 */
module.exports = (pipelineId, input, callback) => {

  let pipelineRsmq = require('../../queueing/pipeline-queue')

  input = input || {}

  // build pipeline configuration snapshot
  snapshotBuilder(pipelineId, (snapshot) => {

    let newExecutionData = {
      pipeline_config_id: pipelineId,
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

}
