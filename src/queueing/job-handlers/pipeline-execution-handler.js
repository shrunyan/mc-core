'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()

module.exports = (msg, next, msgid) => {

  // process your message
  logger.debug('message received. ID: ' + msgid)
  logger.debug(msg)

  // Parse the JSON in the message
  msg = JSON.parse(msg)

  // Validate the incoming job data
  if (!msg.pipeline_execution_id) {
    logger.error('a queue job was submitted to pipeline_executions, but with no pipeline_execution_id')
  }

  // TODO: look up the pipeline execution

  // Mark the pipeline execution as started
  connection('pipeline_executions')
    .where('id', msg.pipeline_execution_id)
    .update({
      status: 'running',
      started_at: new Date(),
      updated_at: new Date()
    }).then(() => {

    // Mark the pipeline_execution as successful
    connection('pipeline_executions')
      .where('id', msg.pipeline_execution_id)
      .update({
        status: 'succeeded',
        finished_at: new Date(),
        updated_at: new Date()
      }).then(() => {

      // TODO: emit event for pipeline_execution update

      // Mark the queue job as complete, and move onto the next
      next()

    })

  })


}